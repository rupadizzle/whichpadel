# Reorder each gallery so a clean racket-face shot is first; drop lifestyle/packaging/close-up shots; re-encode 400/800w q70.
import json,os,glob
from PIL import Image,ImageStat
G=json.load(open('data/gallery.json')); D='public/rackets/g'
def score(im):
    g=im.convert('L'); w,h=g.size
    bd=[g.getpixel((x,y)) for x in range(0,w,8) for y in (2,h-3)]+[g.getpixel((x,y)) for y in range(0,h,8) for x in (2,w-3)]
    white=sum(v>240 for v in bd)/len(bd)
    bb=g.point(lambda v:255 if v<235 else 0).getbbox() or (0,0,w,h); bw,bh=bb[2]-bb[0],bb[3]-bb[1]
    asp=bh/max(bw,1); fill=bw*bh/(w*h)
    inner=g.crop(bb).point(lambda v:255 if v<235 else 0); dens=ImageStat.Stat(inner).mean[0]/255
    s=white*2-abs(asp-1.45)*1.2-max(0,dens-0.75)*2
    if white<0.6 or fill>0.9: s-=3   # lifestyle / cropped close-up / box filling frame
    if asp<1.05: s-=1.5               # box, side view, flat lay
    return s
st={'kept':0,'dropped':0,'reordered':0}
for slug,n in G.items():
    ims=[]
    for i in range(n):
        p=f'{D}/{slug}-{i}-960.webp'
        if os.path.exists(p): ims.append(Image.open(p).convert('RGB'))
    if not ims: G[slug]=0; continue
    sc=[(score(im),i,im) for i,im in enumerate(ims)]; srt=sorted(sc,key=lambda x:-x[0])
    keep=[x for x in srt if x[0]>-1.5] or srt[:1]
    if keep[0][1]!=0: st['reordered']+=1
    st['dropped']+=len(srt)-len(keep)
    for f in glob.glob(f'{D}/{slug}-*.webp'): os.remove(f)
    for k,(_,_,im) in enumerate(keep):
        for w in (400,800): im.resize((w,int(w*1.25)),Image.LANCZOS).save(f'{D}/{slug}-{k}-{w}.webp','WEBP',quality=70,method=6)
    G[slug]=len(keep); st['kept']+=len(keep)
json.dump(G,open('data/gallery.json','w'),indent=0)
print(st,'2+:',sum(v>=2 for v in G.values()))
