/* On-device transcription for when the browser speech service returns a network error. */
(function(){
const SR=16000, LIB='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
let pipeP=null, report=function(){}, seq=0, ctx=null, live=null, asrChain=Promise.resolve();
function prime(){
 const AC=window.AudioContext||window.webkitAudioContext;
 if(!AC) return null;
 if(!ctx) ctx=new AC();
 if(ctx.state==='suspended') ctx.resume();
 return ctx;
}
function transcribe(audio){
 const job=asrChain.then(function(){return load();}).then(function(asr){return asr?asr(audio):null;});
 asrChain=job.then(function(){},function(){});
 return job;
}
function warm(){
 const go=function(){transcribe(new Float32Array(8000)).catch(function(){});};
 if(window.requestIdleCallback) requestIdleCallback(go,{timeout:1200});
 else setTimeout(go,300);
}
function load(){
 if(!pipeP) pipeP=(async()=>{
  const {pipeline, env}=await import(LIB);
  env.allowLocalModels=false;
  env.backends.onnx.wasm.numThreads=1;
  env.backends.onnx.wasm.wasmPaths=LIB+'/dist/';
  return pipeline('automatic-speech-recognition','onnx-community/whisper-tiny.en',{dtype:'q8',device:'wasm',progress_callback:function(p){
   if(p.status==='progress'&&p.progress!=null) report('Downloading voice… '+Math.round(p.progress)+'%');
   else if(p.status==='initiate'||p.status==='download') report('Downloading voice…');
  }});
 })().catch(function(e){pipeP=null; throw e;});
 return pipeP;
}
function down(input, rate){
 if(rate===SR){const o=new Float32Array(input.length); o.set(input); return o;}
 const ratio=rate/SR, len=Math.floor(input.length/ratio), o=new Float32Array(len);
 for(let i=0;i<len;i++){const p=i*ratio, i0=Math.floor(p), i1=Math.min(input.length-1,i0+1), f=p-i0; o[i]=input[i0]*(1-f)+input[i1]*f;}
 return o;
}
function cat(parts){
 let n=0; for(let i=0;i<parts.length;i++) n+=parts[i].length;
 const o=new Float32Array(n); let k=0;
 for(let i=0;i<parts.length;i++){o.set(parts[i],k); k+=parts[i].length;}
 return o;
}
function rms(b){let s=0; for(let i=0;i<b.length;i++) s+=b[i]*b[i]; return Math.sqrt(s/b.length);}
function clean(text){
 let t=(text||'').replace(/\s+/g,' ').trim().replace(/^[\s.,!?]+|[\s.,!?]+$/g,'');
 if(!t||/^(thanks for watching|thank you for watching|thank you|you|subtitles? by.*|please subscribe|\[.*\]|\(.*\)|music|applause|foreign|silence|bye)$/i.test(t)) return '';
 t=t.replace(/\b([a-z0-9]+)(?:\s*,?\s+\1\b){2,}/gi,'$1');
 return t;
}
function trimAudio(audio){
 let peak=0;
 for(let i=0;i<audio.length;i++) peak=Math.max(peak, Math.abs(audio[i]));
 const thr=Math.max(0.004, peak*0.12), pad=Math.floor(SR*0.08);
 let i=0, j=audio.length-1;
 while(i<j&&Math.abs(audio[i])<thr) i++;
 while(j>i&&Math.abs(audio[j])<thr) j--;
 i=Math.max(0, i-pad); j=Math.min(audio.length, j+1+pad);
 return audio.slice(i, j);
}
function boost(audio){
 let peak=0;
 for(let i=0;i<audio.length;i++){const a=Math.abs(audio[i]); if(a>peak) peak=a;}
 if(peak<0.0008||peak>0.4) return audio;
 const g=0.45/peak, o=new Float32Array(audio.length);
 for(let i=0;i<audio.length;i++) o[i]=Math.max(-1, Math.min(1, audio[i]*g));
 return o;
}
function join(prev, next){
 const a=prev?prev.split(' '):[], b=next.split(' ');
 let k=0; const max=Math.min(4,a.length,b.length);
 for(let n=max;n>0;n--){if(a.slice(-n).join(' ').toLowerCase()===b.slice(0,n).join(' ').toLowerCase()){k=n; break;}}
 return (prev+' '+b.slice(k).join(' ')).replace(/\s+/g,' ').trim();
}
function stop(){seq++; const a=live; live=null; if(!a) return; a.proc.onaudioprocess=null; try{a.proc.disconnect(); a.src.disconnect(); a.gain.disconnect();}catch(e){} a.stream.getTracks().forEach(function(t){t.stop();});}
async function mic(){
 try{return await navigator.mediaDevices.getUserMedia({audio:{channelCount:1, echoCancellation:false, noiseSuppression:false, autoGainControl:true}});}
 catch(e){if(e.name!=='NotReadableError'&&e.name!=='AbortError') throw e; await new Promise(function(r){setTimeout(r,400);}); return navigator.mediaDevices.getUserMedia({audio:true});}
}
function start(hooks){
 const mine=++seq; stop(); seq=mine;
 const audioCtx=prime();
 if(!audioCtx){hooks.onFail('Voice didn’t start. Type how you play, then press enter.'); return;}
 report=function(s){if(mine===seq) hooks.onStatus(s);};
 report('Downloading voice…');
 let modelReady=false, said='', hyp='', busy=false, queued=null, epoch=0;
 const model=load().then(function(asr){if(mine===seq){modelReady=true; hooks.onReady(); hooks.onStatus('Listening. Just start talking.');} return asr;}).catch(function(){if(mine===seq) hooks.onFail('Voice couldn’t download. Type how you play, then press enter.');});
 mic().then(function(stream){
  if(mine!==seq){stream.getTracks().forEach(function(t){t.stop();}); return;}
  if(audioCtx.state==='suspended') audioCtx.resume();
  const src=audioCtx.createMediaStreamSource(stream), gain=audioCtx.createGain(), proc=audioCtx.createScriptProcessor(4096,1,1);
  gain.gain.value=0; src.connect(proc); proc.connect(gain); gain.connect(audioCtx.destination);
  live={stream:stream, src:src, gain:gain, proc:proc};
  const rate=audioCtx.sampleRate;
  let parts=[], n=0, pre=[], preN=0, noise=0.002, speaking=false, quiet=0, lastKick=0, cal=0;
  function run(audio, final){
   if(mine!==seq) return;
   if(busy){if(!queued||final||!queued.final) queued={audio:audio, final:!!final}; return;}
   busy=true;
   const epochNow=epoch;
   transcribe(boost(trimAudio(audio))).then(function(out){
    busy=false; if(mine!==seq) return;
    const bit=clean(out&&out.text);
    if(final){epoch++; const next=bit||hyp; if(next) said=join(said, next); hyp=''; if(said) hooks.onText(said);}
    else if(epochNow===epoch&&bit){hyp=bit; const live=(said+' '+hyp).replace(/\s+/g,' ').trim(); (hooks.onPartial||hooks.onText)(live);}
    if(queued){const q=queued; queued=null; run(q.audio, q.final);}
    else if(final&&!said) hooks.onStatus('Listening. Just start talking.');
   }).catch(function(){busy=false; queued=null; if(mine===seq) hooks.onStatus('Listening. Just start talking.');});
  }
  proc.onaudioprocess=function(e){
   if(mine!==seq) return;
   const raw=e.inputBuffer.getChannelData(0), level=rms(raw), ms=raw.length/rate*1000, copy=down(raw, rate);
   if(cal<450){cal+=ms; noise=noise*0.85+level*0.15; if(cal<450){pre.push(copy); preN+=copy.length; while(preN>SR*0.3&&pre.length) preN-=pre.shift().length; return;}}
   const hot=level>Math.max(noise*2.6, noise+0.004);
   if(!hot&&!speaking) noise=noise*0.98+level*0.02;
   if(hot){
    if(!speaking){parts=pre; n=preN; pre=[]; preN=0;}
    speaking=true; quiet=0; parts.push(copy); n+=copy.length;
    if(!busy) hooks.onStatus(modelReady?'Hearing you…':'Hearing you. Downloading voice…');
   }else if(speaking){quiet+=ms; parts.push(copy); n+=copy.length;}
   else{pre.push(copy); preN+=copy.length; while(preN>SR*0.25&&pre.length) preN-=pre.shift().length;}
   const pause=speaking&&quiet>700&&n>SR*0.3, long=n>SR*20;
   if(pause||long){const audio=cat(parts); parts=[]; n=0; pre=[]; preN=0; lastKick=0; speaking=false; quiet=0; run(audio, true); return;}
   if(speaking&&quiet<200&&n>SR*0.45&&n-lastKick>SR*0.8){lastKick=n; run(cat(parts), false);}
  };
 }).catch(function(e){
  if(mine!==seq) return;
  hooks.onFail(e&&e.name==='NotAllowedError'?'The microphone is blocked. Type how you play, then press enter.':'No microphone found. Type how you play, then press enter.');
 });
}
window.DGVoice={prime:prime, start:start, stop:stop};
warm();
})();
