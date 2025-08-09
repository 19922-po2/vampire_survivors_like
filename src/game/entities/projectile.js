import { circlesOverlap } from '../../engine/math.js';

export function updateProjectiles(state, dt) {
  for (const b of state.projectiles) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life += dt;
  }
  // Collisions and culling
  for (const b of state.projectiles) {
    for (const e of state.enemies) {
      if (e.hp > 0 && circlesOverlap({ x: b.x, y: b.y, r: b.r }, { x: e.x, y: e.y, r: e.r })) {
        e.hp -= b.damage;
        b.life = b.maxLife + 1; // flag for removal
        break;
      }
    }
  }
  state.projectiles = state.projectiles.filter((b) => b.life <= b.maxLife);
}

export function drawProjectiles(ctx, state) {
  ctx.fillStyle = '#87b6ff';
  for (const b of state.projectiles) {
    const sx = b.x - state.camera.x;
    const sy = b.y - state.camera.y;
    ctx.beginPath();
    ctx.arc(sx, sy, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
}


