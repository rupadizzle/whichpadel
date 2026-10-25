// Head, swing and feel from published specs. Does not read r.ratings.
// A missing or unusable spec stays null. Numeric balance is not scored.

const HEADS = ['round', 'hybrid', 'teardrop', 'diamond'];
const HEAD_STEP = { round: 0, hybrid: 1, teardrop: 2, diamond: 3 };
const FEEL_STEP = { soft: 0, medium: 1, firm: 2 };
const SWING_STEP = { easy: 0, moderate: 1, demanding: 2 };

function feelOf(r, foam) {
  const word = r.coreHardness;
  if (!word) return null;
  const names = foam[String(r.brand || '').trim().toLowerCase()];
  if (names && names[word]) return names[word];
  if (word === 'soft') return 'soft';
  if (word === 'medium') return 'medium';
  if (word === 'hard') return 'firm';
  return null;
}

export function profileOf(r, foam = {}) {
  const head = HEADS.includes(r.shape) ? r.shape : null;
  const balance = ['low', 'medium', 'high'].includes(r.balance) ? r.balance : null;
  const w = r.weightMax;
  let swing = null;
  if (balance && w != null && w !== '') {
    const sum = { low: 0, medium: 1, high: 2 }[balance] + (w < 355 ? 0 : w <= 370 ? 1 : 2);
    swing = sum <= 1 ? 'easy' : sum === 2 ? 'moderate' : 'demanding';
  }
  return { head, swing, feel: feelOf(r, foam), balance };
}

// First matching row wins. Null when the profile is incomplete or matches none.
export function suitKey(p) {
  if (!p.head || !p.swing || !p.feel) return null;
  if (p.head === 'round' && (p.swing === 'easy' || p.swing === 'moderate') && p.feel === 'soft') return 'beginner-soft';
  if ((p.head === 'teardrop' || p.head === 'hybrid') && p.swing === 'moderate' && p.feel === 'medium') return 'allround';
  if (p.head === 'diamond' && p.swing === 'demanding' && p.feel === 'firm') return 'attack';
  if (p.swing === 'easy' && p.feel === 'soft') return 'light-soft';
  return null;
}

// Steps from a target profile. Null if either side is missing a trait.
export function steps(profile, target) {
  if (!profile.head || !profile.swing || !profile.feel) return null;
  if (!target.head || !target.swing || !target.feel) return null;
  return Math.abs(HEAD_STEP[profile.head] - HEAD_STEP[target.head])
    + Math.abs(FEEL_STEP[profile.feel] - FEEL_STEP[target.feel])
    + Math.abs(SWING_STEP[profile.swing] - SWING_STEP[target.swing]);
}

export const BEGINNER = { head: 'round', feel: 'soft', swing: 'easy' };

// Two published maxima within 5 g are a tie.
export function weightTie(a, b) {
  if (a == null || b == null) return false;
  return Math.abs(a - b) <= 5;
}
