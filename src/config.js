export const WORLD = {
  baseEnemySpawnRatePerSecond: 0.7,
  enemySpawnAccelerationPerMinute: 0.5,
  enemyBaseSpeed: 55,
  enemyBaseHp: 12,
  enemyDamage: 5,
  bossDamage: 16,
  xpPerEnemy: 3,
  bossBaseHp: 320,
  bossSpeed: 85,
  bossXp: 50,
  bossSpawnIntervalSec: 60,
  projectileSpeed: 420,
  projectileSize: 6,
  projectileLifetimeSec: 2.2,
  playerBaseSpeed: 160,
  playerBaseHp: 100,
  playerBaseDamage: 10,
  playerBaseFireRate: 2.5,
  pickupRange: 80,
};

export const ASSET_PATHS = {
  map: 'assets/map/66a56d0f-3999-4e9d-b41b-0dd98470b1c0.png',
  character: 'assets/character/Char_Schoolgirl_Walk.webp',
  monster1: 'assets/monster/Monster_Bad_Fury_Move.webp',
  monster2: 'assets/monster/Monster_Tottochi_Move.webp',
  boss: 'assets/boss/Monster_Tutankhamen_Move.webp',
};

export function xpForLevel(level) {
  // Scaling XP curve similar to VS-like: starts easy, ramps reasonably
  const base = 12;
  return Math.floor(base + Math.pow(level, 1.6) * 9);
}


