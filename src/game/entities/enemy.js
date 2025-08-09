import { normalize } from '../../engine/math.js';

export function spawnEnemy(state, x, y, type = 1) {
  const speed = state.enemySpeed || 55;
  const hp = state.enemyHp || 12;
  state.enemies.push({
    x, y,
    r: 16,
    speed,
    hp,
    maxHp: hp,
    type,
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
  const scale = 0.6;
  for (const e of state.enemies) {
    const img = e.type === 1 ? img1 : img2;
    const w = img.width * scale;
    const h = img.height * scale;
    const sx = e.x - state.camera.x - w / 2;
    const sy = e.y - state.camera.y - h / 2;
    ctx.drawImage(img, sx, sy, w, h);
  }
}


