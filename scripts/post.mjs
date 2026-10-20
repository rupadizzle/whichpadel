import fs from 'fs';
for(const l of fs.readdirSync('dist').filter(d=>/^[a-z]{2}$/.test(d))){const s=`dist/${l}/404/index.html`; if(fs.existsSync(s)){fs.copyFileSync(s,`dist/${l}/404.html`); fs.rmSync(`dist/${l}/404`,{recursive:true});}}
