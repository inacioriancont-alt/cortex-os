/** Fórmulas de XP e nível — Fase 1 */

export const XP_PER_TASK = 25;
export const XP_STREAK_BONUS = 10;
export const XP_FOCUS_MINUTE = 2;

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.35));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let needed = xpForLevel(level);
  let remaining = xp;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = xpForLevel(level);
  }
  return level;
}

export function progressToNextLevel(xp: number): { level: number; current: number; max: number; percent: number } {
  const level = levelFromXp(xp);
  let spent = 0;
  for (let l = 1; l < level; l++) spent += xpForLevel(l);
  const current = xp - spent;
  const max = xpForLevel(level);
  return {
    level,
    current,
    max,
    percent: Math.min(100, Math.round((current / max) * 100)),
  };
}
