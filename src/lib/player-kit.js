// Shoes and bags named after a player, attached to the racket player pages.
import { players } from './data.js';
import { shoes } from './shoes.js';
import { bags } from './bags.js';
const byYear = (a, b) => (b.year || 0) - (a.year || 0) || a.name.localeCompare(b.name);
export const kitPlayers = players.map(p => ({
  ...p,
  shoes: shoes.filter(s => s.player === p.name).sort(byYear),
  bags: bags.filter(b => b.player === p.name).sort(byYear),
}));
