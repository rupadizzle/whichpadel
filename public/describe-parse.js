// Rule-based 'describe your game' parsing (keywords only, no AI service). Shared by /describe/ and /describe-shoes/.
(function(){
const has=(t,re)=>re.test(t);
// --- shared keyword rules ---
function parse(raw){const W={one:1,two:2,three:3,four:4,five:5,six:6,seven:7}; const t=' '+raw.toLowerCase().replace(/[’']/g,"'").replace(/\b(one|two|three|four|five|six|seven)\b/g,w=>W[w])+' ', A={}, why=[];
 // budget: first money amount or "under N"
 const m=t.match(/(?:£|€|\$|under|below|up to|max(?:imum)?|budget(?: of| is| about| around)?|around|about)\s*(\d{2,4})|(\d{2,4})\s*(?:£|€|\$|pounds|euros?|quid|dollars)/); if(m){A.money=+(m[1]||m[2]); why.push('Budget about '+A.money);}
 // frequency
 const f=t.match(/(\d)\s*(?:or\s*\d\s*)?(?:times|x|days|sessions)\s*(?:a|per|each)\s*week/)||(/every day|daily/.test(t)?['',7]:null)||(/twice a week/.test(t)?['',2]:null)||(/once a week/.test(t)?['',1]:null);
 const tf=t.match(/(\d)\s*or\s*(\d)\s*(?:times|x|days)/); A.freq=tf?+tf[2]:f?+f[1]:null; if(A.freq) why.push('Plays about '+A.freq+'× a week');
 // level
 A.level=has(t,/\b(advanced|competitive|tournaments?|expert|high level|very good|pro level|league|5\.0|4\.5)\b/)?'advanced':has(t,/\b(beginner|new to|just started|starting out|first racket|learning|casual|never played|novice|newbie)\b/)?'beginner':has(t,/\b(intermediate|improver|decent|club player|average)\b/)?'intermediate':null;
 if(!A.level) A.level=A.freq>=3?'intermediate':'intermediate'; else why.push('Level: '+A.level);
 if(A.level==='beginner'&&A.freq>=4){A.level='intermediate'; why.push('Plays a lot, so treated as intermediate');}
 // injuries
 A.injury=[...new Set((t.match(/\b(tennis elbow|elbow|wrist|shoulder|forearm|knees?|ankles?|heels?|plantar|back|achilles|shin)\b/g)||[]).map(x=>x.replace(/s$/,'').replace('tennis ','')))]; if(A.injury.length) why.push('Injury: '+A.injury.join(', '));
 A.headHeavyBad=has(t,/head[- ]heavy[^.]*\b(worse|hurt|pain|bad|aggravat)/); if(A.headHeavyBad) why.push('Head-heavy rackets made it worse');
 // side
 A.side=has(t,/\b(right side|drive side|derecha|on the right|forehand side)\b/)?'right':has(t,/\b(left side|reves|revés|backhand side|on the left)\b/)?'left':'either'; if(A.side!=='either') why.push('Plays on the '+A.side);
 // control vs power ("X more than Y" wins)
 const mt=t.match(/\b(control|power)\b[^.]{0,20}\b(more than|over|rather than|instead of)\b[^.]{0,15}\b(control|power)\b/);
 A.style=mt?mt[1]:has(t,/\b(all[- ]?round|balanced|bit of both|both)\b/)?'all':has(t,/\b(control|precis|placement|consistent|defen[cs]|touch|lob)/)&&!has(t,/\b(power|smash|attack|aggressive|hit hard|x3|x4|vibora|bandeja)\b/)?'control':has(t,/\b(power|smash|attack|aggressive|hit hard|x3|x4)\b/)&&!has(t,/\bcontrol\b/)?'power':'all';
 why.push('Wants '+(A.style==='all'?'a balance of control and power':A.style));
 // shoes
 A.surface=has(t,/\b(clay|sand|sandy|outdoor|artificial grass|turf|carpet|slippy|slippery)\b/)?'clay':has(t,/\b(indoor|hard court|concrete|cement|hard floor)\b/)?'hard':null; if(A.surface) why.push('Courts: '+(A.surface==='clay'?'sandy/outdoor artificial grass':'indoor/hard'));
 A.wide=has(t,/\b(wide|broad|wider) (feet|foot|fit)|\bwide\b/); if(A.wide) why.push('Wide feet');
 A.narrow=has(t,/\bnarrow (feet|foot)\b/); if(A.narrow) why.push('Narrow feet');
 A.gender=has(t,/\b(women'?s|woman|female|ladies|lady|girl)\b/)?'w':has(t,/\b(men'?s|man|male|guy)\b/)?'m':null; if(A.gender) why.push(A.gender==='w'?"Women's fit":"Men's fit");
 A.light=has(t,/\b(light|lightweight|fast|quick|nimble)\b/); A.dur=has(t,/\b(durable|last longer|wear out|wore out|breaks?)\b/); A.latest=has(t,/\b(newest|latest|2026|2027|new model)\b/);
 return {A,why};}
function racket({A}){const prio=(A.injury.some(x=>/elbow|wrist|shoulder|forearm/.test(x))||A.headHeavyBad)?'comfort':A.light?'light':A.dur?'durable':A.latest?'latest':A.level==='beginner'?'comfort':'latest';
 const budget=!A.money?'any':A.money<=100?'100':A.money<=150?'150':A.money<=200?'200':A.money<=300?'300':'any';
 return {level:A.level,side:A.side,style:A.style,prio,budget};}
window.DG={parse,racket};
})();
