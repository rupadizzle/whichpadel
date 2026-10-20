import signal
import json,re,time,io,sys,urllib.parse as up,requests
from PIL import Image
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
S=requests.Session();S.headers.update({'User-Agent':UA,'Accept-Language':'en-GB,en;q=0.9'})
d=json.load(open('data/rackets.json'))['rackets']
res={}
try: res=json.load(open('data/images.json'))
except: pass
BAD=re.compile(r'logo|placeholder|no[-_]?image|default|banner|icon|favicon',re.I)
def get(u):
    for i in range(3):
        try:
            r=S.get(u,timeout=(10,20))
            if len(r.content)>15e6: return None
            if r.status_code==200: return r
            if r.status_code in(403,404,410): return r
        except Exception as e: pass
        time.sleep(2*(i+1))
def cands(html,base):
    c=[]
    for m in re.finditer(r'<meta[^>]+(?:property|name)=["\'](?:og:image(?::secure_url)?|twitter:image)["\'][^>]*>',html,re.I):
        x=re.search(r'content=["\']([^"\']+)',m.group(0));x and c.append(x.group(1))
    for m in re.finditer(r'<script[^>]+ld\+json[^>]*>(.*?)</script>',html,re.S|re.I):
        try: j=json.loads(m.group(1).strip())
        except: continue
        st=[j]
        while st:
            o=st.pop()
            if isinstance(o,list): st+=o
            elif isinstance(o,dict):
                if 'Product' in str(o.get('@type','')) and o.get('image'):
                    im=o['image']; im=im if isinstance(im,list) else [im]
                    for i in im: c.append(i.get('url') if isinstance(i,dict) else i)
                st+=list(o.values())
    for m in re.finditer(r'<img[^>]+(?:data-zoom-image|data-large_image|data-src|src)=["\']([^"\']+\.(?:jpe?g|png|webp)[^"\']*)',html,re.I):
        if re.search(r'product|gallery|zoom|large|cache',m.group(0),re.I): c.append(m.group(1))
    out=[]
    for x in c:
        if not x or not isinstance(x,str): continue
        x=up.urljoin(base,x.replace('&amp;','&'))
        if x.startswith('//'):x='https:'+x
        if x not in out and not BAD.search(x.split('?')[0].rsplit('/',1)[-1]): out.append(x)
    return out
for k,r in enumerate(d):
    s=r['slug']
    if s in res: continue
    u=r.get('productUrl');info={'ok':False,'url':u}
    if u and 'padelmarket' in u: info['err']='skipped padelmarket'; u=None
    signal.signal(signal.SIGALRM,lambda *a:(_ for _ in ()).throw(TimeoutError()));signal.alarm(90)
    try:
     if u:
         p=get(u);time.sleep(1)
         if p is None or p.status_code!=200: info['err']=f'page {getattr(p,"status_code",None)}'
         else:
             cs=cands(p.text,p.url);info['err']='no candidate' if not cs else 'all rejected'
             for c in cs[:5]:
                 q=get(c);time.sleep(0.5)
                 if not q or q.status_code!=200: continue
                 try: im=Image.open(io.BytesIO(q.content));im.load()
                 except: continue
                 w,h=im.size
                 if min(w,h)<250: continue
                 if im.mode in('RGBA','LA','P'):
                     im=im.convert('RGBA');bg=Image.new('RGB',im.size,'white');bg.paste(im,mask=im.split()[3]);im=bg
                 else: im=im.convert('RGB')
                 im.thumbnail((800,800));im.save(f'public/rackets/{s}.webp','WEBP',quality=82,method=6)
                 info={'ok':True,'url':u,'src':c,'size':[w,h]};break
    except TimeoutError: info['err']='timeout'
    signal.alarm(0)
    res[s]=info
    print(k,s,info.get('ok'),info.get('err',''),flush=True)
    json.dump(res,open('data/images.json','w'),indent=1)
