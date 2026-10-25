// Range line, filters and FAQ for the shoe and ball tabs on a brand page. Same job as copy.brand.intro for rackets.
const j=(a,and)=>a.length>1?a.slice(0,-1).join(', ')+' '+and+' '+a.at(-1):a[0]||'';
const price=(x,range,one)=>x.np>1&&x.pmin!==x.pmax?range(x.pmin,x.pmax):x.np?one(x.pmin):'';
const per=(x,range,one)=>x.bmin&&x.bmax&&x.bmin!==x.bmax?range(x.bmin,x.bmax):x.bmin?one(x.bmin):'';

export const PANEL={
en:{
 shoeShowing:n=>`Showing ${n} shoes`, ballShowing:n=>`Showing ${n} ball tubes`,
 shoeFaqH:b=>`${b} padel shoe FAQ`, ballFaqH:b=>`${b} padel ball FAQ`,
 shoeIntro:(b,x)=>{
  const years=x.y0?(x.y1&&x.y1!==x.y0?` from ${x.y0} to ${x.y1}`:` from ${x.y0}`):'';
  const g=j([x.g.m&&`${x.g.m} men's`,x.g.w&&`${x.g.w} women's`,x.g.k&&`${x.g.k} junior`].filter(Boolean),'and');
  const sole=!x.soleN?'':x.soleKinds===1&&x.soleN===x.n?` All have a ${x.soleName} sole.`:x.soleKinds===1?` ${x.soleN} of ${x.n} have a ${x.soleName} sole.`:` The most common sole is ${x.soleName} (${x.soleN} of ${x.n}).`;
  return `We list ${x.n} ${b} ${x.n===1?'padel shoe':'padel shoes'}${years}${g?`: ${g}`:''}.${sole}`+price(x,(a,c)=>` Recorded prices run from ${a} to ${c}.`,a=>` The recorded price is ${a}.`);
 },
 shoeFaq:(b,x)=>{const f=[]; const g=j([x.g.m&&`${x.g.m} men's`,x.g.w&&`${x.g.w} women's`,x.g.k&&`${x.g.k} junior`].filter(Boolean),'and');
  if(g) f.push([`Who are ${b} padel shoes made for?`,`The ${x.n} ${b} padel shoes we list split into ${g}. The split comes from the fit published by the brand or the shop.`]);
  if(x.grip) f.push([`Which ${b} shoes are made for sand-filled courts?`,`${x.grip} of ${x.n} have a clay, herringbone or omni sole, the patterns used on sand-filled artificial grass.`]);
  if(x.np) f.push([`How much do ${b} padel shoes cost?`,x.np>1?`Recorded prices for the ${x.np} priced ${b} padel shoes run from ${x.pmin} to ${x.pmax}. Prices change often: check the shop before you buy.`:`We have one recorded ${b} shoe price: ${x.pmin}. Prices change often: check the shop.`]);
  return f;},
 ballIntro:(b,x)=>{
  const lead=`We list ${x.n} ${b} ${x.n===1?'ball tube':'ball tubes'}${x.n===1&&x.name?`, the ${x.name}`:''}.`;
  const speed=x.n===1?` It is a ${x.fast?'fast':'medium-speed'} ball${x.per?`, sold in a tube of ${x.per}`:''}.`:x.fast&&x.med?` ${x.fast} ${x.fast===1?'is':'are'} fast and ${x.med} ${x.med===1?'is':'are'} medium.`:x.fast?` All ${x.n} are fast.`:` All ${x.n} are medium.`;
  const tour=x.tourN===1?` ${x.tourBalls[0]} is listed as: ${x.tourLabel}.`:x.tourN?` ${j(x.tourBalls,'and')} are listed as: ${x.tourLabel}.`:'';
  return lead+speed+tour+price(x,(a,c)=>` Recorded prices run from ${a} to ${c}.`,a=>` The recorded price is ${a}.`)+per(x,(a,c)=>` That is ${a} to ${c} per ball.`,a=>` That is ${a} per ball.`);
 },
 ballFaq:(b,x)=>{const f=[];
  f.push([`Are ${b} padel balls fast or medium?`,x.n===1?`The ${x.name} is a ${x.fast?'fast':'medium-speed'} ball${x.per?`, sold in a tube of ${x.per}`:''}.`:x.fast&&x.med?`${x.fast} of the ${x.n} tubes are fast and ${x.med} are medium.`:`All ${x.n} tubes we list are ${x.fast?'fast':'medium'}.`]);
  if(x.tourN) f.push([`Which ${b} ball is used in tournaments?`,x.tourN===1?`${x.tourBalls[0]} is listed as: ${x.tourLabel}.`:`${j(x.tourBalls,'and')} are listed as: ${x.tourLabel}.`]);
  if(x.np) f.push([`How much do ${b} balls cost?`,(x.np>1?`Recorded prices for the ${x.np} ${b} tubes run from ${x.pmin} to ${x.pmax}`:`We have one recorded ${b} tube price: ${x.pmin}`)+per(x,(a,c)=>`, ${a} to ${c} per ball. Prices change often: check the shop before you buy.`,a=>`, ${a} per ball. Prices change often: check the shop before you buy.`)]);
  return f;},
},
es:{
 shoeShowing:n=>`Mostrando ${n} zapatillas`, ballShowing:n=>`Mostrando ${n} botes`,
 shoeFaqH:b=>`Preguntas frecuentes sobre zapatillas ${b}`, ballFaqH:b=>`Preguntas frecuentes sobre pelotas ${b}`,
 shoeIntro:(b,x)=>{
  const years=x.y0?(x.y1&&x.y1!==x.y0?` de ${x.y0} a ${x.y1}`:` de ${x.y0}`):'';
  const g=j([x.g.m&&`${x.g.m} de hombre`,x.g.w&&`${x.g.w} de mujer`,x.g.k&&`${x.g.k} de niño`].filter(Boolean),'y');
  const sole=!x.soleN?'':x.soleKinds===1&&x.soleN===x.n?` Todas llevan suela ${x.soleName}.`:x.soleKinds===1?` ${x.soleN} de ${x.n} llevan suela ${x.soleName}.`:` La suela más habitual es ${x.soleName} (${x.soleN} de ${x.n}).`;
  return `Tenemos ${x.n} ${x.n===1?'zapatilla':'zapatillas'} de pádel ${b}${years}${g?`: ${g}`:''}.${sole}`+price(x,(a,c)=>` Los precios registrados van de ${a} a ${c}.`,a=>` El precio registrado es de ${a}.`);
 },
 shoeFaq:(b,x)=>{const f=[]; const g=j([x.g.m&&`${x.g.m} de hombre`,x.g.w&&`${x.g.w} de mujer`,x.g.k&&`${x.g.k} de niño`].filter(Boolean),'y');
  if(g) f.push([`¿Para quién son las zapatillas ${b}?`,`Las ${x.n} zapatillas de pádel ${b} que tenemos se reparten en ${g}. El reparto sale de la horma que publican la marca o la tienda.`]);
  if(x.grip) f.push([`¿Qué zapatillas ${b} valen para pista de arena?`,`${x.grip} de ${x.n} llevan suela clay, de espiga u omni, los dibujos que se usan en césped artificial con arena.`]);
  if(x.np) f.push([`¿Cuánto cuestan las zapatillas ${b}?`,x.np>1?`Los precios registrados de las ${x.np} zapatillas ${b} con precio van de ${x.pmin} a ${x.pmax}. Los precios cambian a menudo: míralo en la tienda antes de comprar.`:`Tenemos un precio registrado de zapatillas ${b}: ${x.pmin}. Los precios cambian a menudo: míralo en la tienda.`]);
  return f;},
 ballIntro:(b,x)=>{
  const lead=`Tenemos ${x.n} ${x.n===1?'bote':'botes'} de pelotas ${b}${x.n===1&&x.name?`, el ${x.name}`:''}.`;
  const speed=x.n===1?` Es una pelota ${x.fast?'rápida':'de velocidad media'}${x.per?`, en bote de ${x.per}`:''}.`:x.fast&&x.med?` ${x.fast} ${x.fast===1?'es rápida':'son rápidas'} y ${x.med} ${x.med===1?'es de velocidad media':'son de velocidad media'}.`:x.fast?` Las ${x.n} son rápidas.`:` Las ${x.n} son de velocidad media.`;
  const tour=x.tourN===1?` ${x.tourBalls[0]} figura como: ${x.tourLabel}.`:x.tourN?` ${j(x.tourBalls,'y')} figuran como: ${x.tourLabel}.`:'';
  return lead+speed+tour+price(x,(a,c)=>` Los precios registrados van de ${a} a ${c}.`,a=>` El precio registrado es de ${a}.`)+per(x,(a,c)=>` Sale a entre ${a} y ${c} por pelota.`,a=>` Sale a ${a} por pelota.`);
 },
 ballFaq:(b,x)=>{const f=[];
  f.push([`¿Las pelotas ${b} son rápidas o medias?`,x.n===1?`La ${x.name} es una pelota ${x.fast?'rápida':'de velocidad media'}${x.per?`, en bote de ${x.per}`:''}.`:x.fast&&x.med?`${x.fast} de los ${x.n} botes son rápidos y ${x.med} de velocidad media.`:`Los ${x.n} botes que tenemos son ${x.fast?'rápidos':'de velocidad media'}.`]);
  if(x.tourN) f.push([`¿Qué pelota ${b} se usa en torneos?`,x.tourN===1?`${x.tourBalls[0]} figura como: ${x.tourLabel}.`:`${j(x.tourBalls,'y')} figuran como: ${x.tourLabel}.`]);
  if(x.np) f.push([`¿Cuánto cuestan las pelotas ${b}?`,(x.np>1?`Los precios registrados de los ${x.np} botes ${b} van de ${x.pmin} a ${x.pmax}`:`Tenemos un precio registrado del bote ${b}: ${x.pmin}`)+per(x,(a,c)=>`, entre ${a} y ${c} por pelota. Los precios cambian a menudo: míralo en la tienda antes de comprar.`,a=>`, ${a} por pelota. Los precios cambian a menudo: míralo en la tienda.`)]);
  return f;},
},
fr:{
 shoeShowing:n=>`${n} chaussures affichées`, ballShowing:n=>`${n} tubes affichés`,
 shoeFaqH:b=>`Questions fréquentes sur les chaussures ${b}`, ballFaqH:b=>`Questions fréquentes sur les balles ${b}`,
 shoeIntro:(b,x)=>{
  const years=x.y0?(x.y1&&x.y1!==x.y0?` de ${x.y0} à ${x.y1}`:` de ${x.y0}`):'';
  const g=j([x.g.m&&`${x.g.m} pour homme`,x.g.w&&`${x.g.w} pour femme`,x.g.k&&`${x.g.k} junior`].filter(Boolean),'et');
  const sole=!x.soleN?'':x.soleKinds===1&&x.soleN===x.n?` Toutes ont une semelle ${x.soleName}.`:x.soleKinds===1?` ${x.soleN} sur ${x.n} ont une semelle ${x.soleName}.`:` La semelle la plus courante est ${x.soleName} (${x.soleN} sur ${x.n}).`;
  return `Nous référençons ${x.n} ${x.n===1?'chaussure':'chaussures'} de padel ${b}${years}${g?` : ${g}`:''}.${sole}`+price(x,(a,c)=>` Les prix relevés vont de ${a} à ${c}.`,a=>` Le prix relevé est de ${a}.`);
 },
 shoeFaq:(b,x)=>{const f=[]; const g=j([x.g.m&&`${x.g.m} pour homme`,x.g.w&&`${x.g.w} pour femme`,x.g.k&&`${x.g.k} junior`].filter(Boolean),'et');
  if(g) f.push([`Pour qui sont les chaussures ${b} ?`,`Les ${x.n} chaussures de padel ${b} que nous référençons se répartissent en ${g}. La répartition vient de la coupe publiée par la marque ou la boutique.`]);
  if(x.grip) f.push([`Quelles chaussures ${b} conviennent aux terrains sablés ?`,`${x.grip} sur ${x.n} ont une semelle clay, chevron ou omni, les dessins utilisés sur le gazon synthétique sablé.`]);
  if(x.np) f.push([`Combien coûtent les chaussures ${b} ?`,x.np>1?`Les prix relevés pour les ${x.np} chaussures ${b} avec un prix vont de ${x.pmin} à ${x.pmax}. Les prix changent souvent : vérifiez en boutique avant d’acheter.`:`Nous avons un prix relevé pour une chaussure ${b} : ${x.pmin}. Les prix changent souvent : vérifiez en boutique.`]);
  return f;},
 ballIntro:(b,x)=>{
  const lead=`Nous référençons ${x.n} ${x.n===1?'tube':'tubes'} de balles ${b}${x.n===1&&x.name?`, le ${x.name}`:''}.`;
  const speed=x.n===1?` C’est une balle ${x.fast?'rapide':'à vitesse moyenne'}${x.per?`, vendue en tube de ${x.per}`:''}.`:x.fast&&x.med?` ${x.fast} ${x.fast===1?'est rapide':'sont rapides'} et ${x.med} ${x.med===1?'est à vitesse moyenne':'sont à vitesse moyenne'}.`:x.fast?` Les ${x.n} sont rapides.`:` Les ${x.n} sont à vitesse moyenne.`;
  const tour=x.tourN===1?` ${x.tourBalls[0]} est indiqué ainsi : ${x.tourLabel}.`:x.tourN?` ${j(x.tourBalls,'et')} sont indiqués ainsi : ${x.tourLabel}.`:'';
  return lead+speed+tour+price(x,(a,c)=>` Les prix relevés vont de ${a} à ${c}.`,a=>` Le prix relevé est de ${a}.`)+per(x,(a,c)=>` Soit de ${a} à ${c} par balle.`,a=>` Soit ${a} par balle.`);
 },
 ballFaq:(b,x)=>{const f=[];
  f.push([`Les balles ${b} sont-elles rapides ou moyennes ?`,x.n===1?`La ${x.name} est une balle ${x.fast?'rapide':'à vitesse moyenne'}${x.per?`, vendue en tube de ${x.per}`:''}.`:x.fast&&x.med?`${x.fast} des ${x.n} tubes sont rapides et ${x.med} à vitesse moyenne.`:`Les ${x.n} tubes que nous référençons sont ${x.fast?'rapides':'à vitesse moyenne'}.`]);
  if(x.tourN) f.push([`Quelle balle ${b} est utilisée en tournoi ?`,x.tourN===1?`${x.tourBalls[0]} est indiqué ainsi : ${x.tourLabel}.`:`${j(x.tourBalls,'et')} sont indiqués ainsi : ${x.tourLabel}.`]);
  if(x.np) f.push([`Combien coûtent les balles ${b} ?`,(x.np>1?`Les prix relevés pour les ${x.np} tubes ${b} vont de ${x.pmin} à ${x.pmax}`:`Nous avons un prix relevé pour le tube ${b} : ${x.pmin}`)+per(x,(a,c)=>`, de ${a} à ${c} par balle. Les prix changent souvent : vérifiez en boutique avant d’acheter.`,a=>`, ${a} par balle. Les prix changent souvent : vérifiez en boutique.`)]);
  return f;},
},
pt:{
 shoeShowing:n=>`A mostrar ${n} sapatilhas`, ballShowing:n=>`A mostrar ${n} tubos`,
 shoeFaqH:b=>`Perguntas frequentes sobre sapatilhas ${b}`, ballFaqH:b=>`Perguntas frequentes sobre bolas ${b}`,
 shoeIntro:(b,x)=>{
  const years=x.y0?(x.y1&&x.y1!==x.y0?` de ${x.y0} a ${x.y1}`:` de ${x.y0}`):'';
  const g=j([x.g.m&&`${x.g.m} de homem`,x.g.w&&`${x.g.w} de mulher`,x.g.k&&`${x.g.k} de criança`].filter(Boolean),'e');
  const sole=!x.soleN?'':x.soleKinds===1&&x.soleN===x.n?` Todas têm sola ${x.soleName}.`:x.soleKinds===1?` ${x.soleN} de ${x.n} têm sola ${x.soleName}.`:` A sola mais comum é ${x.soleName} (${x.soleN} de ${x.n}).`;
  return `Temos ${x.n} ${x.n===1?'sapatilha':'sapatilhas'} de padel ${b}${years}${g?`: ${g}`:''}.${sole}`+price(x,(a,c)=>` Os preços registados vão de ${a} a ${c}.`,a=>` O preço registado é de ${a}.`);
 },
 shoeFaq:(b,x)=>{const f=[]; const g=j([x.g.m&&`${x.g.m} de homem`,x.g.w&&`${x.g.w} de mulher`,x.g.k&&`${x.g.k} de criança`].filter(Boolean),'e');
  if(g) f.push([`Para quem são as sapatilhas ${b}?`,`As ${x.n} sapatilhas de padel ${b} que temos dividem-se em ${g}. A divisão vem da forma publicada pela marca ou pela loja.`]);
  if(x.grip) f.push([`Que sapatilhas ${b} servem para piso com areia?`,`${x.grip} de ${x.n} têm sola clay, espinha ou omni, os desenhos usados em relva artificial com areia.`]);
  if(x.np) f.push([`Quanto custam as sapatilhas ${b}?`,x.np>1?`Os preços registados das ${x.np} sapatilhas ${b} com preço vão de ${x.pmin} a ${x.pmax}. Os preços mudam muitas vezes: confirme na loja antes de comprar.`:`Temos um preço registado de sapatilha ${b}: ${x.pmin}. Os preços mudam muitas vezes: confirme na loja.`]);
  return f;},
 ballIntro:(b,x)=>{
  const lead=`Temos ${x.n} ${x.n===1?'tubo':'tubos'} de bolas ${b}${x.n===1&&x.name?`, o ${x.name}`:''}.`;
  const speed=x.n===1?` É uma bola ${x.fast?'rápida':'de velocidade média'}${x.per?`, em tubo de ${x.per}`:''}.`:x.fast&&x.med?` ${x.fast} ${x.fast===1?'é rápida':'são rápidas'} e ${x.med} ${x.med===1?'é de velocidade média':'são de velocidade média'}.`:x.fast?` Os ${x.n} são rápidos.`:` Os ${x.n} são de velocidade média.`;
  const tour=x.tourN===1?` ${x.tourBalls[0]} está indicado como: ${x.tourLabel}.`:x.tourN?` ${j(x.tourBalls,'e')} estão indicados como: ${x.tourLabel}.`:'';
  return lead+speed+tour+price(x,(a,c)=>` Os preços registados vão de ${a} a ${c}.`,a=>` O preço registado é de ${a}.`)+per(x,(a,c)=>` Ou seja, de ${a} a ${c} por bola.`,a=>` Ou seja, ${a} por bola.`);
 },
 ballFaq:(b,x)=>{const f=[];
  f.push([`As bolas ${b} são rápidas ou médias?`,x.n===1?`A ${x.name} é uma bola ${x.fast?'rápida':'de velocidade média'}${x.per?`, em tubo de ${x.per}`:''}.`:x.fast&&x.med?`${x.fast} dos ${x.n} tubos são rápidos e ${x.med} de velocidade média.`:`Os ${x.n} tubos que temos são ${x.fast?'rápidos':'de velocidade média'}.`]);
  if(x.tourN) f.push([`Que bola ${b} se usa em torneios?`,x.tourN===1?`${x.tourBalls[0]} está indicado como: ${x.tourLabel}.`:`${j(x.tourBalls,'e')} estão indicados como: ${x.tourLabel}.`]);
  if(x.np) f.push([`Quanto custam as bolas ${b}?`,(x.np>1?`Os preços registados dos ${x.np} tubos ${b} vão de ${x.pmin} a ${x.pmax}`:`Temos um preço registado do tubo ${b}: ${x.pmin}`)+per(x,(a,c)=>`, de ${a} a ${c} por bola. Os preços mudam muitas vezes: confirme na loja antes de comprar.`,a=>`, ${a} por bola. Os preços mudam muitas vezes: confirme na loja.`)]);
  return f;},
},
it:{
 shoeShowing:n=>`${n} scarpe mostrate`, ballShowing:n=>`${n} tubi mostrati`,
 shoeFaqH:b=>`Domande frequenti sulle scarpe ${b}`, ballFaqH:b=>`Domande frequenti sulle palline ${b}`,
 shoeIntro:(b,x)=>{
  const years=x.y0?(x.y1&&x.y1!==x.y0?` dal ${x.y0} al ${x.y1}`:` del ${x.y0}`):'';
  const g=j([x.g.m&&`${x.g.m} da uomo`,x.g.w&&`${x.g.w} da donna`,x.g.k&&`${x.g.k} da bambino`].filter(Boolean),'e');
  const sole=!x.soleN?'':x.soleKinds===1&&x.soleN===x.n?` Tutte hanno suola ${x.soleName}.`:x.soleKinds===1?` ${x.soleN} su ${x.n} hanno suola ${x.soleName}.`:` La suola più comune è ${x.soleName} (${x.soleN} su ${x.n}).`;
  return `Abbiamo ${x.n} ${x.n===1?'scarpa':'scarpe'} da padel ${b}${years}${g?`: ${g}`:''}.${sole}`+price(x,(a,c)=>` I prezzi registrati vanno da ${a} a ${c}.`,a=>` Il prezzo registrato è ${a}.`);
 },
 shoeFaq:(b,x)=>{const f=[]; const g=j([x.g.m&&`${x.g.m} da uomo`,x.g.w&&`${x.g.w} da donna`,x.g.k&&`${x.g.k} da bambino`].filter(Boolean),'e');
  if(g) f.push([`Per chi sono le scarpe ${b}?`,`Le ${x.n} scarpe da padel ${b} che abbiamo si dividono in ${g}. La suddivisione viene dalla calzata pubblicata dalla marca o dal negozio.`]);
  if(x.grip) f.push([`Quali scarpe ${b} sono adatte ai campi con sabbia?`,`${x.grip} su ${x.n} hanno suola clay, a spina di pesce o omni, i disegni usati sull’erba sintetica con sabbia.`]);
  if(x.np) f.push([`Quanto costano le scarpe ${b}?`,x.np>1?`I prezzi registrati per le ${x.np} scarpe ${b} con un prezzo vanno da ${x.pmin} a ${x.pmax}. I prezzi cambiano spesso: controlla in negozio prima di comprare.`:`Abbiamo un prezzo registrato per una scarpa ${b}: ${x.pmin}. I prezzi cambiano spesso: controlla in negozio.`]);
  return f;},
 ballIntro:(b,x)=>{
  const lead=`Abbiamo ${x.n} ${x.n===1?'tubo':'tubi'} di palline ${b}${x.n===1&&x.name?`, il ${x.name}`:''}.`;
  const speed=x.n===1?` È una pallina ${x.fast?'veloce':'a velocità media'}${x.per?`, in tubo da ${x.per}`:''}.`:x.fast&&x.med?` ${x.fast} ${x.fast===1?'è veloce':'sono veloci'} e ${x.med} ${x.med===1?'è a velocità media':'sono a velocità media'}.`:x.fast?` Tutti i ${x.n} sono veloci.`:` Tutti i ${x.n} sono a velocità media.`;
  const tour=x.tourN===1?` ${x.tourBalls[0]} è indicato come: ${x.tourLabel}.`:x.tourN?` ${j(x.tourBalls,'e')} sono indicati come: ${x.tourLabel}.`:'';
  return lead+speed+tour+price(x,(a,c)=>` I prezzi registrati vanno da ${a} a ${c}.`,a=>` Il prezzo registrato è ${a}.`)+per(x,(a,c)=>` Ovvero da ${a} a ${c} a pallina.`,a=>` Ovvero ${a} a pallina.`);
 },
 ballFaq:(b,x)=>{const f=[];
  f.push([`Le palline ${b} sono veloci o medie?`,x.n===1?`La ${x.name} è una pallina ${x.fast?'veloce':'a velocità media'}${x.per?`, in tubo da ${x.per}`:''}.`:x.fast&&x.med?`${x.fast} dei ${x.n} tubi sono veloci e ${x.med} a velocità media.`:`Tutti i ${x.n} tubi che abbiamo sono ${x.fast?'veloci':'a velocità media'}.`]);
  if(x.tourN) f.push([`Quale pallina ${b} si usa nei tornei?`,x.tourN===1?`${x.tourBalls[0]} è indicato come: ${x.tourLabel}.`:`${j(x.tourBalls,'e')} sono indicati come: ${x.tourLabel}.`]);
  if(x.np) f.push([`Quanto costano le palline ${b}?`,(x.np>1?`I prezzi registrati per i ${x.np} tubi ${b} vanno da ${x.pmin} a ${x.pmax}`:`Abbiamo un prezzo registrato per il tubo ${b}: ${x.pmin}`)+per(x,(a,c)=>`, da ${a} a ${c} a pallina. I prezzi cambiano spesso: controlla in negozio prima di comprare.`,a=>`, ${a} a pallina. I prezzi cambiano spesso: controlla in negozio.`)]);
  return f;},
},
de:{
 shoeShowing:n=>`${n} Schuhe angezeigt`, ballShowing:n=>`${n} Röhren angezeigt`,
 shoeFaqH:b=>`Häufige Fragen zu ${b}-Schuhen`, ballFaqH:b=>`Häufige Fragen zu ${b}-Bällen`,
 shoeIntro:(b,x)=>{
  const years=x.y0?(x.y1&&x.y1!==x.y0?` aus den Jahren ${x.y0} bis ${x.y1}`:` aus dem Jahr ${x.y0}`):'';
  const g=j([x.g.m&&`${x.g.m} für Herren`,x.g.w&&`${x.g.w} für Damen`,x.g.k&&`${x.g.k} für Kinder`].filter(Boolean),'und');
  const sole=!x.soleN?'':x.soleKinds===1&&x.soleN===x.n?` Alle haben eine ${x.soleName}-Sohle.`:x.soleKinds===1?` ${x.soleN} von ${x.n} haben eine ${x.soleName}-Sohle.`:` Die häufigste Sohle ist ${x.soleName} (${x.soleN} von ${x.n}).`;
  return `Wir führen ${x.n} ${b}-${x.n===1?'Padelschuh':'Padelschuhe'}${years}${g?`: ${g}`:''}.${sole}`+price(x,(a,c)=>` Die erfassten Preise reichen von ${a} bis ${c}.`,a=>` Der erfasste Preis liegt bei ${a}.`);
 },
 shoeFaq:(b,x)=>{const f=[]; const g=j([x.g.m&&`${x.g.m} für Herren`,x.g.w&&`${x.g.w} für Damen`,x.g.k&&`${x.g.k} für Kinder`].filter(Boolean),'und');
  if(g) f.push([`Für wen sind ${b}-Padelschuhe?`,`Die ${x.n} ${b}-Padelschuhe, die wir führen, teilen sich in ${g}. Die Aufteilung kommt von der Passform, die Marke oder Shop angeben.`]);
  if(x.grip) f.push([`Welche ${b}-Schuhe sind für sandgefüllte Plätze?`,`${x.grip} von ${x.n} haben eine Clay-, Fischgrät- oder Omni-Sohle, die Profile für sandgefüllten Kunstrasen.`]);
  if(x.np) f.push([`Was kosten ${b}-Padelschuhe?`,x.np>1?`Die erfassten Preise für die ${x.np} ${b}-Schuhe mit Preis reichen von ${x.pmin} bis ${x.pmax}. Preise ändern sich oft: prüfe sie im Shop vor dem Kauf.`:`Wir haben einen erfassten ${b}-Schuhpreis: ${x.pmin}. Preise ändern sich oft: prüfe ihn im Shop.`]);
  return f;},
 ballIntro:(b,x)=>{
  const lead=`Wir führen ${x.n} ${b}-${x.n===1?'Ballröhre':'Ballröhren'}${x.n===1&&x.name?`, ${x.name}`:''}.`;
  const speed=x.n===1?` Es ist ein ${x.fast?'schneller Ball':'Ball mit mittlerer Geschwindigkeit'}${x.per?`, verkauft in einer Röhre zu ${x.per}`:''}.`:x.fast&&x.med?` ${x.fast} ${x.fast===1?'ist schnell':'sind schnell'} und ${x.med} ${x.med===1?'hat mittlere Geschwindigkeit':'haben mittlere Geschwindigkeit'}.`:x.fast?` Alle ${x.n} sind schnell.`:` Alle ${x.n} haben mittlere Geschwindigkeit.`;
  const tour=x.tourN===1?` ${x.tourBalls[0]} ist angegeben als: ${x.tourLabel}.`:x.tourN?` ${j(x.tourBalls,'und')} sind angegeben als: ${x.tourLabel}.`:'';
  return lead+speed+tour+price(x,(a,c)=>` Die erfassten Preise reichen von ${a} bis ${c}.`,a=>` Der erfasste Preis liegt bei ${a}.`)+per(x,(a,c)=>` Das sind ${a} bis ${c} pro Ball.`,a=>` Das sind ${a} pro Ball.`);
 },
 ballFaq:(b,x)=>{const f=[];
  f.push([`Sind ${b}-Bälle schnell oder mittel?`,x.n===1?`${x.name} ist ein ${x.fast?'schneller Ball':'Ball mit mittlerer Geschwindigkeit'}${x.per?`, verkauft in einer Röhre zu ${x.per}`:''}.`:x.fast&&x.med?`${x.fast} der ${x.n} Röhren sind schnell und ${x.med} mittel.`:`Alle ${x.n} Röhren, die wir führen, sind ${x.fast?'schnell':'mittel'}.`]);
  if(x.tourN) f.push([`Welcher ${b}-Ball wird im Turnier genutzt?`,x.tourN===1?`${x.tourBalls[0]} ist angegeben als: ${x.tourLabel}.`:`${j(x.tourBalls,'und')} sind angegeben als: ${x.tourLabel}.`]);
  if(x.np) f.push([`Was kosten ${b}-Bälle?`,(x.np>1?`Die erfassten Preise für die ${x.np} ${b}-Röhren reichen von ${x.pmin} bis ${x.pmax}`:`Wir haben einen erfassten Preis für die ${b}-Röhre: ${x.pmin}`)+per(x,(a,c)=>`, ${a} bis ${c} pro Ball. Preise ändern sich oft: prüfe sie im Shop vor dem Kauf.`,a=>`, ${a} pro Ball. Preise ändern sich oft: prüfe ihn im Shop.`)]);
  return f;},
},
};
