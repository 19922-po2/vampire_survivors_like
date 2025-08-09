import { normalize } from '../../engine/math.js';

export function spawnEnemy(state, x, y, type = 1, boss = false) {
  const speed = boss ? (state.bossSpeed || 85) : (state.enemySpeed || 55);
  const hp = boss ? (state.bossHp || 320) : (state.enemyHp || 12);
  state.enemies.push({
    x, y,
    r: boss ? 26 : 16,
    speed,
    hp,
    maxHp: hp,
    type,
    boss,
  });
}

export function updateEnemies(state, dt) {
  const p = state.player;
  for (const e of state.enemies) {
    const dir = normalize(p.x - e.x, p.y - e.y);
    e.x += dir.x * e.speed * dt;
    e.y += dir.y * e.speed * dt;
  }
}

export function drawEnemies(ctx, state) {
  const img1 = state.assets.img('monster1');
  const img2 = state.assets.img('monster2');
  const bossImg = state.assets.img('boss');
  for (const e of state.enemies) {
    const img = e.boss ? bossImg : (e.type === 1 ? img1 : img2);
    const scale = e.boss ? 0.9 : 0.6;
    const w = img.width * scale;
    const h = img.height * scale;
    const sx = e.x - state.camera.x - w / 2;
    const sy = e.y - state.camera.y - h / 2;
    ctx.drawImage(img, sx, sy, w, h);
  }
}


