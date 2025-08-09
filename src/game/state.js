import { WORLD } from '../config.js';

export function createInitialState() {
  return {
    time: 0,
    player: {
      x: 0,
      y: 0,
      r: 16,
      speed: WORLD.playerBaseSpeed,
      hp: WORLD.playerBaseHp,
      maxHp: WORLD.playerBaseHp,
      damage: WORLD.playerBaseDamage,
      fireRate: WORLD.playerBaseFireRate, // shots per second
      canShoot: true, // starting single skill
      projectilesPerShot: 1,
      projectileSpeed: WORLD.projectileSpeed,
      projectileSize: WORLD.projectileSize,
      attackCooldown: 0,
      pickupRange: WORLD.pickupRange,
      level: 1,
      xp: 0,
      xpToNext: 12,
    },
    enemySpeed: WORLD.enemyBaseSpeed,
    enemyHp: WORLD.enemyBaseHp,
    enemies: [],
    projectiles: [],
    rng: mulberry32(Date.now() % 2 ** 31),
    camera: { x: 0, y: 0 },
    pausedForLevel: false,
    pendingChoices: null,
    assets: null,
  };
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}


