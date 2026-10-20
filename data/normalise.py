import json
EUR_GBP=0.842481; USD_EUR=1/1.121735  # open.er-api.com, 2026-10-20 00:02 UTC
src=json.load(open('data/rackets.json'))
out=[]
for r in src['rackets']:
    s=r['specs']; g=lambda k,f='display': (s.get(k) or {}).get(f)
    p=s['price']; cur=p['currency']; v=p['value']
    gbp = v if cur=='GBP' else (v*EUR_GBP if cur=='EUR' else v*USD_EUR*EUR_GBP) if v is not None else None
    bal=g('balance','value') or ((g('balance') or '').lower() or None)
    out.append(dict(slug=r['slug'],brand=r['brand'],model=r['name'],year=r['year'],
      shape=g('shape','value'),weight=g('weight'),weightMin=g('weight','min'),weightMax=g('weight','max'),
      balance=bal,coreHardness=g('core','value'),coreMaterial=g('core','material') or g('core'),
      faceMaterial=g('surface','material') or g('surface'),frame=g('frame'),thicknessMm=g('thicknessMm','value'),
      price=v,currency=cur,priceGBPApprox=round(gbp) if gbp else None,priceChecked=p.get('checkedOn'),
      productUrl=r['productUrl'],sourceUrl=r['url'],ratings=r['ratings'],profile=r['profile'],
      inputsMissing=r['inputsMissing'],sources={k:s[k].get('source') for k in s},image=None))
meta=dict(source='PadelTrue padel racket dataset',sourceUrl='https://padeltrue.com/data',license='CC BY 4.0',
 attribution='Data: PadelTrue (https://padeltrue.com/), CC BY 4.0. Adapted: fields renamed, GBP estimates added.',
 excluded='Brand names, model names and photographs belong to their owners and are not covered by the licence; no images included.',
 built=src['built'],fx='EUR->GBP 0.842481, USD->EUR 1/1.121735 (open.er-api.com, 2026-10-20)',count=len(out))
json.dump(dict(meta=meta,rackets=out),open('data/rackets.normalised.json','w'),indent=1)
print(len(out), sum(1 for x in out if x['balance']))
