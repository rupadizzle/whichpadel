# Collect up to 6 product photos per racket from the product pages we already link to; saves WebP at 480/960w + data/gallery.json
import json,re,io,os,sys,html as H,urllib.parse as up,requests,concurrent.futures as cf
from PIL import Image
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
R=json.load(open('data/rackets.json'))['rackets']
M=json.load(open(sys.argv[1])) if len(sys.argv)>1 else {}
BAD=re.compile(r'logo|placeholder|no[-_]?image|banner|icon|favicon|sprite|payment|flag|badge|avatar|svg',re.I)
OUT='public/rackets/g'; os.makedirs(OUT,exist_ok=True)
def get(u,**k):
    try: return requests.get(u,headers={'User-Agent':UA},timeout=(8,20),**k)
    except Exception: return None
def cands(u):
    r=get(u); 
    if not r or r.status_code!=200: return []
    h=r.text; c=[]
    if 'cdn.shopify' in h or '/cdn/shop/' in h:
        j=get(u.split('?')[0].rstrip('/')+'.js')
        try: c+=['https:'+x if x.startswith('//') else x for x in j.json()['images']]
        except Exception: pass
    for m in re.finditer(r'<script[^>]+ld\+json[^>]*>(.*?)</script>',h,re.S|re.I):
        try: st=[json.loads(m.group(1).strip())]
        except Exception: continue
        while st:
            o=st.pop()
            if isinstance(o,list): st+=o
            elif isinstance(o,dict):
                if 'Product' in str(o.get('@type','')):
                    im=o.get('image'); im=im if isinstance(im,list) else [im]
                    for x in im:
                        if isinstance(x,dict): x=x.get('url') or x.get('contentUrl')
                        if isinstance(x,str): c.append(x)
                st+=[v for v in o.values() if isinstance(v,(dict,list))]
    c+=[x.replace('\\/','/') for x in re.findall(r'"full":"([^"]+)"',h)]
    c+=re.findall(r'data-large_image=["\']([^"\']+)',h)
    c+=re.findall(r'["\'](https?://[^"\']+?-(?:thickbox_default|large_default)/[^"\']+?\.(?:jpe?g|png|webp))',h)
    c+=re.findall(r'data-zoom(?:-image)?=["\']([^"\']+\.(?:jpe?g|png|webp)[^"\']*)',h)
    for m in re.finditer(r'<meta[^>]+og:image["\'][^>]*content=["\']([^"\']+)',h): c.append(m.group(1))
    out=[]
    for x in c:
        x=H.unescape(x.strip()); x=up.urljoin(u,x)
        if BAD.search(x.split('?')[0]) or not x.startswith('http'): continue
        x=re.sub(r'-(?:large|home|medium|small|cart)_default/','-thickbox_default/',x)
        if x not in out: out.append(x)
    return out
def ahash(im):
    g=im.convert('L').resize((12,12)); p=list(g.getdata()); a=sum(p)/len(p); return [v>a for v in p]
def one(r):
    s=r['slug']; urls=[r.get('productUrl')]+[m[s] for m in M.values() if s in m]
    urls=[u for u in urls if u]; imgs=[]; hs=[]
    for u in urls[:4]:
        for x in cands(u)[:10]:
            if len(imgs)>=6: break
            g=get(x)
            if not g or g.status_code!=200: continue
            try: im=Image.open(io.BytesIO(g.content)); im.load()
            except Exception: continue
            w,h=im.size
            if min(w,h)<400 or not (0.4<w/h<2.2): continue
            im=im.convert('RGBA'); bg=Image.new('RGB',im.size,(255,255,255)); bg.paste(im,mask=im.split()[3]); im=bg
            bb=Image.eval(im.convert('L'),lambda v:255 if v<246 else 0).getbbox()
            if bb: im=im.crop(bb)
            # pad to 4:5 portrait on white
            W,Hh=im.size; tw=max(W,int(Hh*0.8)); th=int(tw*1.25); 
            if th<Hh: th=Hh; tw=int(th*0.8)
            c=Image.new('RGB',(int(tw*1.08),int(th*1.08)),(255,255,255)); c.paste(im,((c.width-W)//2,(c.height-Hh)//2)); im=c
            hh=ahash(im)
            if any(sum(a!=b for a,b in zip(hh,k))<14 for k in hs): continue
            hs.append(hh); n=len(imgs)
            for wd in (480,960):
                im.resize((wd,int(wd*1.25)),Image.LANCZOS).save(f'{OUT}/{s}-{n}-{wd}.webp','WEBP',quality=78,method=5)
            imgs.append(n)
        if len(imgs)>=4 and u!=urls[0]: break
    return s,len(imgs)
res={}
OLD={}
try: OLD=json.load(open('data/gallery.json'))
except Exception: pass
if os.environ.get('ONLY_LT'): R=[r for r in R if OLD.get(r['slug'],0)<int(os.environ['ONLY_LT'])]
res=dict(OLD)
with cf.ThreadPoolExecutor(12) as ex:
    for s,n in ex.map(one,R):
        res[s]=max(n,0) if n>=OLD.get(s,0) else OLD[s]; print(s,n,flush=True)
json.dump({k:v for k,v in sorted(res.items()) if v},open('data/gallery.json','w'),indent=0)
print('2+:',sum(v>=2 for v in res.values()),'1:',sum(v==1 for v in res.values()),'0:',sum(v==0 for v in res.values()))
