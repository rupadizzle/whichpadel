# Order slots by silhouette match to the main racket photo; drop packaging/accessories/lifestyle (low match). Run after order_gallery.py.
import json,os,shutil
from PIL import Image
G=json.load(open('data/gallery.json')); D='public/rackets/g'
def sil(im):
    g=im.convert('L'); m=g.point(lambda v:255 if v<232 else 0); bb=m.getbbox()
    if bb: m=m.crop(bb)
    return [v>127 for v in m.resize((20,30)).getdata()], (bb[3]-bb[1])/max(1,bb[2]-bb[0]) if bb else 1
def iou(a,b): i=sum(x and y for x,y in zip(a,b)); u=sum(x or y for x,y in zip(a,b)); return i/max(u,1)
drop=0;log=[]
for s,n in list(G.items()):
    c=f'public/rackets/{s}.webp'; ref=f'{D}/{s}-0-800.webp'
    R,_=sil(Image.open(c if os.path.exists(c) else ref).convert('RGB'))
    sc=[]
    for i in range(n):
        m,a=sil(Image.open(f'{D}/{s}-{i}-800.webp').convert('RGB')); sc.append((iou(R,m) if i else 9, i))
    keep=[i for v,i in sorted(sc,reverse=True) if v>=0.42]
    drop+=n-len(keep); log.append((s,[round(v,2) for v,_ in sc]))
    tmp=f'/tmp/og/{s}'; os.makedirs(tmp,exist_ok=True)
    for i in range(n):
        for w in (400,800): shutil.move(f'{D}/{s}-{i}-{w}.webp',f'{tmp}/{i}-{w}.webp')
    for k,i in enumerate(keep):
        for w in (400,800): shutil.move(f'{tmp}/{i}-{w}.webp',f'{D}/{s}-{k}-{w}.webp')
    G[s]=len(keep)
json.dump(G,open('data/gallery.json','w'),indent=0)
print('dropped',drop,'2+:',sum(v>=2 for v in G.values()),'1:',sum(v==1 for v in G.values()))
