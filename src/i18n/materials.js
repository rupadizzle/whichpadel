// Spec values that shops publish in Spanish, translated per language. Key: lowercased source value. Used by mat() in index.js
// before the per-language term rules, so every language (English too) shows the material in its own language.
// Columns: en, es, fr, pt, it, de.
const T=[
 ['100% carbono','100% carbon','100% carbono','100 % carbone','100% carbono','100% carbonio','100 % Carbon'],
 ['carbono 100%','100% carbon','Carbono 100%','100 % carbone','100% carbono','100% carbonio','100 % Carbon'],
 ['100% de carbono','100% carbon','100% de carbono','100 % carbone','100% carbono','100% carbonio','100 % Carbon'],
 ['100% carbono entrelazado bidireccional','100% bidirectional woven carbon','100% carbono entrelazado bidireccional','100 % carbone tissé bidirectionnel','100% carbono entrelaçado bidirecional','100% carbonio intrecciato bidirezionale','100 % bidirektional gewebtes Carbon'],
 ['100% de carbono entrelazado bidireccional','100% bidirectional woven carbon','100% carbono entrelazado bidireccional','100 % carbone tissé bidirectionnel','100% carbono entrelaçado bidirecional','100% carbonio intrecciato bidirezionale','100 % bidirektional gewebtes Carbon'],
 ['100% de carbono entrelazado (carbontube)','100% woven carbon (CarbonTube)','100% carbono entrelazado (CarbonTube)','100 % carbone tissé (CarbonTube)','100% carbono entrelaçado (CarbonTube)','100% carbonio intrecciato (CarbonTube)','100 % gewebtes Carbon (CarbonTube)'],
 ['3k amplitex con fibras naturales','3K Amplitex with natural fibres','3K Amplitex con fibras naturales','3K Amplitex avec fibres naturelles','3K Amplitex com fibras naturais','3K Amplitex con fibre naturali','3K Amplitex mit Naturfasern'],
 ['50% fibra de carbono, 50% fibra de vidrio','50% carbon fibre, 50% fibreglass','50% fibra de carbono, 50% fibra de vidrio','50 % fibre de carbone, 50 % fibre de verre','50% fibra de carbono, 50% fibra de vidro','50% fibra di carbonio, 50% fibra di vetro','50 % Carbonfaser, 50 % Glasfaser'],
 ['carbono','Carbon','Carbono','Carbone','Carbono','Carbonio','Carbon'],
 ['carbono 12k / basalto','12K carbon / basalt','Carbono 12K / basalto','Carbone 12K / basalte','Carbono 12K / basalto','Carbonio 12K / basalto','12K-Carbon / Basalt'],
 ['carbono 15k textreme','15K Textreme carbon','Carbono 15K Textreme','Carbone 15K Textreme','Carbono 15K Textreme','Carbonio 15K Textreme','15K-Textreme-Carbon'],
 ['carbono 18k textreme','18K Textreme carbon','Carbono 18K Textreme','Carbone 18K Textreme','Carbono 18K Textreme','Carbonio 18K Textreme','18K-Textreme-Carbon'],
 ['carbono 3k 3d hexcel twill aeronautical','3K carbon, 3D Hexcel aeronautical twill','Carbono 3K 3D Hexcel Twill aeronáutico','Carbone 3K, sergé aéronautique Hexcel 3D','Carbono 3K, sarja aeronáutica Hexcel 3D','Carbonio 3K, twill aeronautico Hexcel 3D','3K-Carbon, 3D-Hexcel-Twill in Luftfahrtqualität'],
 ['carbono aluminizado 16k','16K aluminised carbon','Carbono aluminizado 16K','Carbone aluminisé 16K','Carbono aluminizado 16K','Carbonio alluminato 16K','16K aluminisiertes Carbon'],
 ['carbono aluminizado 18k','18K aluminised carbon','Carbono aluminizado 18K','Carbone aluminisé 18K','Carbono aluminizado 18K','Carbonio alluminato 18K','18K aluminisiertes Carbon'],
 ['carbono aluminizado 24k','24K aluminised carbon','Carbono aluminizado 24K','Carbone aluminisé 24K','Carbono aluminizado 24K','Carbonio alluminato 24K','24K aluminisiertes Carbon'],
 ['carbono de alta resistencia','High-strength carbon','Carbono de alta resistencia','Carbone haute résistance','Carbono de alta resistência','Carbonio ad alta resistenza','Hochfestes Carbon'],
 ['carbono jacquard','Jacquard carbon','Carbono jacquard','Carbone jacquard','Carbono jacquard','Carbonio jacquard','Jacquard-Carbon'],
 ['carbono twill','Twill carbon','Carbono twill','Carbone sergé','Carbono sarja','Carbonio twill','Twill-Carbon'],
 ['carbono y fibra de vidrio','Carbon and fibreglass','Carbono y fibra de vidrio','Carbone et fibre de verre','Carbono e fibra de vidro','Carbonio e fibra di vetro','Carbon und Glasfaser'],
 ['carbono-kevlar','Carbon-Kevlar','Carbono-Kevlar','Carbone-Kevlar','Carbono-Kevlar','Carbonio-Kevlar','Carbon-Kevlar'],
 ['carbontube de fibra 100% de carbono','CarbonTube, 100% carbon fibre','CarbonTube de fibra 100% de carbono','CarbonTube, 100 % fibre de carbone','CarbonTube, 100% fibra de carbono','CarbonTube, 100% fibra di carbonio','CarbonTube, 100 % Carbonfaser'],
 ['carbontube de fibra de carbono 100%','CarbonTube, 100% carbon fibre','CarbonTube de fibra de carbono 100%','CarbonTube, 100 % fibre de carbone','CarbonTube, 100% fibra de carbono','CarbonTube, 100% fibra di carbonio','CarbonTube, 100 % Carbonfaser'],
 ['carbontube, carbono 100%','CarbonTube, 100% carbon','CarbonTube, carbono 100%','CarbonTube, 100 % carbone','CarbonTube, 100% carbono','CarbonTube, 100% carbonio','CarbonTube, 100 % Carbon'],
 ['fibra de carbono','Carbon fibre','Fibra de carbono','Fibre de carbone','Fibra de carbono','Fibra di carbonio','Carbonfaser'],
 ['fibra de carbono unidireccional (ud carbon hs)','Unidirectional carbon fibre (UD Carbon HS)','Fibra de carbono unidireccional (UD Carbon HS)','Fibre de carbone unidirectionnelle (UD Carbon HS)','Fibra de carbono unidirecional (UD Carbon HS)','Fibra di carbonio unidirezionale (UD Carbon HS)','Unidirektionale Carbonfaser (UD Carbon HS)'],
 ['fibra de vidrio','Fibreglass','Fibra de vidrio','Fibre de verre','Fibra de vidro','Fibra di vetro','Glasfaser'],
 ['fibra de vidrio 3k','3K fibreglass','Fibra de vidrio 3K','Fibre de verre 3K','Fibra de vidro 3K','Fibra di vetro 3K','3K-Glasfaser'],
 ['fibra de vidrio aluminizada','Aluminised fibreglass','Fibra de vidrio aluminizada','Fibre de verre aluminisée','Fibra de vidro aluminizada','Fibra di vetro alluminata','Aluminisierte Glasfaser'],
 ['fibra vidrio alum','Aluminised fibreglass','Fibra de vidrio aluminizada','Fibre de verre aluminisée','Fibra de vidro aluminizada','Fibra di vetro alluminata','Aluminisierte Glasfaser'],
 ['fibra de vidrio aluminizado fiber tech','Fiber Tech aluminised fibreglass','Fibra de vidrio aluminizado Fiber Tech','Fibre de verre aluminisée Fiber Tech','Fibra de vidro aluminizada Fiber Tech','Fibra di vetro alluminata Fiber Tech','Aluminisierte Glasfaser Fiber Tech'],
 ['tejido de fibra de vidrio aluminizado fiber tech','Fiber Tech aluminised fibreglass weave','Tejido de fibra de vidrio aluminizado Fiber Tech','Tissu de fibre de verre aluminisée Fiber Tech','Tecido de fibra de vidro aluminizada Fiber Tech','Tessuto in fibra di vetro alluminata Fiber Tech','Aluminisiertes Glasfasergewebe Fiber Tech'],
 ['fibra de vidrio con refuerzos de carbono','Fibreglass with carbon reinforcements','Fibra de vidrio con refuerzos de carbono','Fibre de verre avec renforts en carbone','Fibra de vidro com reforços de carbono','Fibra di vetro con rinforzi in carbonio','Glasfaser mit Carbonverstärkungen'],
 ['fibra de vidrio plateada','Silver fibreglass','Fibra de vidrio plateada','Fibre de verre argentée','Fibra de vidro prateada','Fibra di vetro argentata','Silberne Glasfaser'],
 ['fibra de vidrio polyglass','Polyglass fibreglass','Fibra de vidrio Polyglass','Fibre de verre Polyglass','Fibra de vidro Polyglass','Fibra di vetro Polyglass','Polyglass-Glasfaser'],
 ['fibrix (mezcla de fibra de vidrio y carbono)','Fibrix (fibreglass and carbon blend)','Fibrix (mezcla de fibra de vidrio y carbono)','Fibrix (mélange fibre de verre et carbone)','Fibrix (mistura de fibra de vidro e carbono)','Fibrix (miscela di fibra di vetro e carbonio)','Fibrix (Mischung aus Glasfaser und Carbon)'],
 ['goma eva','EVA rubber','Goma EVA','Gomme EVA','Borracha EVA','Gomma EVA','EVA-Gummi'],
 ['goma eva mid hard','EVA rubber, mid-hard','Goma EVA media-dura','Gomme EVA mi-dure','Borracha EVA média-dura','Gomma EVA medio-dura','EVA-Gummi, mittelhart'],
 ['goma eva soft performance','EVA Soft Performance rubber','Goma EVA Soft Performance','Gomme EVA Soft Performance','Borracha EVA Soft Performance','Gomma EVA Soft Performance','EVA-Soft-Performance-Gummi'],
 ['goma híbrida','Hybrid rubber','Goma híbrida','Gomme hybride','Borracha híbrida','Gomma ibrida','Hybridgummi'],
 ['goma polietileno','Polyethylene rubber','Goma de polietileno','Gomme polyéthylène','Borracha de polietileno','Gomma polietilene','Polyethylen-Gummi'],
 ['polietileno','Polyethylene','Polietileno','Polyéthylène','Polietileno','Polietilene','Polyethylen'],
 ['polietileno blando de alta absorción','Soft, high-absorption polyethylene','Polietileno blando de alta absorción','Polyéthylène souple à haute absorption','Polietileno macio de alta absorção','Polietilene morbido ad alto assorbimento','Weiches, stark dämpfendes Polyethylen'],
 ['polietileno de alta densidad','High-density polyethylene','Polietileno de alta densidad','Polyéthylène haute densité','Polietileno de alta densidade','Polietilene ad alta densità','Polyethylen hoher Dichte'],
 ['tejido 3d hex','3D Hex weave','Tejido 3D Hex','Tissage 3D Hex','Tecido 3D Hex','Tessuto 3D Hex','3D-Hex-Gewebe'],
];
const L=['en','es','fr','pt','it','de']; const MAP=new Map(T.map(([k,...v])=>[k,Object.fromEntries(L.map((l,i)=>[l,v[i]]))]));
// carbono <N>K patterns (carbono 3k, carbono 12K …): one rule for every size
const K={en:n=>`${n}K carbon`,es:n=>`Carbono ${n}K`,fr:n=>`Carbone ${n}K`,pt:n=>`Carbono ${n}K`,it:n=>`Carbonio ${n}K`,de:n=>`${n}K-Carbon`};
export function srcMat(s,lang){const k=String(s).toLowerCase().trim().replace(/\s+/g,' '); const hit=MAP.get(k); if(hit) return hit[lang];
 const m=k.match(/^carbono (\d+)k$/); if(m) return K[lang](m[1]); return null;}
export const SRC_KEYS=[...MAP.keys()];
