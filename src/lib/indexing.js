import keep from '../../data/index-set.json';
export const INDEXED = new Set(keep);
export const isIndexed = p => INDEXED.has(p);
export const indexedAlternates = a => a ? Object.fromEntries(Object.entries(a).filter(([, u]) => INDEXED.has(u))) : null;
