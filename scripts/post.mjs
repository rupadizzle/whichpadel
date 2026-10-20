import fs from 'fs';
for(const l of ['es','fr']){const s=`dist/${l}/404/index.html`; if(fs.existsSync(s)){fs.copyFileSync(s,`dist/${l}/404.html`); fs.rmSync(`dist/${l}/404`,{recursive:true});}}
