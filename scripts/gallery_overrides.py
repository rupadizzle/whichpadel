# Manual fixes after visual check: new order by current index (missing = dropped); [] = use the single existing photo.
import json,os
O={'adidas-adipower-legend-2025':[0,2,1,3]}  # earlier: adipower-ctrl [2,1,0], cross-it-milano [2,1,3], metalbone-reserve [], oxdog-pure-pro-plus drop box
G=json.load(open('data/gallery.json')); D='public/rackets/g'
for s,o in O.items():
    n=G.get(s,0)
    for w in (400,800):
        for i in range(n): os.rename(f'{D}/{s}-{i}-{w}.webp',f'{D}/{s}-t{i}-{w}.webp')
        for k,i in enumerate(o): os.rename(f'{D}/{s}-t{i}-{w}.webp',f'{D}/{s}-{k}-{w}.webp')
        for i in range(n):
            p=f'{D}/{s}-t{i}-{w}.webp'
            if os.path.exists(p): os.remove(p)
    if o: G[s]=len(o)
    else: G.pop(s,None)
json.dump(G,open('data/gallery.json','w'),indent=0); print('2+:',sum(v>=2 for v in G.values()),len(G))
