import { angleBetween, normalize } from '../../engine/math.js';
import { screenToWorld } from '../camera.js';

export function updatePlayer(state, input, dt, canvas) {
  const p = state.player;
  const mv = input.getMoveVector();
  p.x += mv.x * p.speed * dt;
  p.y += mv.y * p.speed * dt;

  p.attackCooldown -= dt;
  if (p.canShoot && p.attackCooldown <= 0) {
    const rate = Math.max(0.1, p.fireRate);
    const delay = 1 / rate;
    p.attackCooldown = delay;
    const mouseWorld = screenToWorld(state.camera, input.mouseScreenX, input.mouseScreenY);
    const theta = angleBetween(p.x, p.y, mouseWorld.x, mouseWorld.y);
    const spread = 0.06; // radians between multi-projectiles
    const count = Math.max(1, p.projectilesPerShot | 0);
    const startOffset = -((count - 1) * spread) / 2;
    for (let i = 0; i < count; i++) {
      const t = theta + startOffset + i * spread;
      const dir = { x: Math.cos(t), y: Math.sin(t) };
      state.projectiles.push({
        x: p.x,
        y: p.y,
        vx: dir.x * p.projectileSpeed,
        vy: dir.y * p.projectileSpeed,
        r: p.projectileSize,
        life: 0,
        maxLife: 2.2,
        damage: p.damage,
      });
    }
    state.audio?.playShoot();
  }
}

export function drawPlayer(ctx, state) {
  const p = state.player;
  const { x, y } = { x: p.x - state.camera.x, y: p.y - state.camera.y };
  const img = state.assets.img('character');
  const scale = 0.5;
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, x - w / 2, y - h / 2, w, h);

  // Optional simple circle for hitbox visual aid when images are large
  // ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  // ctx.beginPath();
  // ctx.arc(x, y, p.r, 0, Math.PI * 2);
  // ctx.stroke();
}


