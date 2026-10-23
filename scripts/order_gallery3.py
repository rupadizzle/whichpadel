# Drop solid-rectangle (box/packaging, tight close-up) and non-white-background (lifestyle) shots from slots 1+.
import json,os,shutil
from PIL import Image
G=json.load(open('data/gallery.json')); D='public/rackets/g'
def bad(p):
    g=Image.open(p).convert('L'); w,h=g.size
    bd=[g.getpixel((x,y)) for x in range(0,w,8) for y in (3,h-4)]+[g.getpixel((x,y)) for y in range(0,h,8) for x in (3,w-4)]
    if sum(v>235 for v in bd)/len(bd)<0.85: return True
    m=g.point(lambda v:255 if v<232 else 0); bb=m.getbbox()
    if not bb: return True
    c=m.crop(bb); fill=sum(1 for v in c.resize((40,50)).getdata() if v)/2000
    return fill>0.8
dr=0
for s,n in G.items():
    keep=[0]+[i for i in range(1,n) if not bad(f'{D}/{s}-{i}-800.webp')]
    if len(keep)==n: continue
    dr+=n-len(keep); t=f'/tmp/og3/{s}'; os.makedirs(t,exist_ok=True)
    for i in range(n):
        for w in (400,800): shutil.move(f'{D}/{s}-{i}-{w}.webp',f'{t}/{i}-{w}.webp')
    for k,i in enumerate(keep):
        for w in (400,800): shutil.move(f'{t}/{i}-{w}.webp',f'{D}/{s}-{k}-{w}.webp')
    G[s]=len(keep)
json.dump(G,open('data/gallery.json','w'),indent=0)
print('dropped',dr,'2+:',sum(v>=2 for v in G.values()),'1:',sum(v==1 for v in G.values()))
