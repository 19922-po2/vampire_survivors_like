import { ASSET_PATHS, WORLD, xpForLevel } from './config.js';
import { AssetStore } from './engine/assets.js';
import { Input } from './engine/input.js';
import { startGameLoop } from './engine/loop.js';
import { createInitialState } from './game/state.js';
import { updateCamera, worldToScreen } from './game/camera.js';
import { updatePlayer, drawPlayer } from './game/entities/player.js';
import { updateEnemies, drawEnemies } from './game/entities/enemy.js';
import { updateProjectiles, drawProjectiles } from './game/entities/projectile.js';
import { createSpawner } from './game/spawn.js';
import { openLevelUp } from './game/ui/levelup.js';
import { updateHud, ensureHud } from './game/ui/hud.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const state = createInitialState();
const assets = new AssetStore();
state.assets = assets;
const input = new Input(canvas);
const spawner = createSpawner(state);

await assets.loadImages(ASSET_PATHS);
ensureHud(state);

// Center player at origin and let the world scroll under them
state.player.x = 0;
state.player.y = 0;
state.player.xpToNext = xpForLevel(state.player.level);

function update(dt) {
  if (!state.pausedForLevel) {
    updatePlayer(state, input, dt, canvas);
    updateEnemies(state, dt);
    updateProjectiles(state, dt);
    spawner.update(dt);
    handleCombatAndXp(state);
  }
  updateCamera(state, canvas);
}

function renderBackground() {
  const img = assets.img('map');
  const tileW = img.width;
  const tileH = img.height;
  const startX = Math.floor((state.camera.x - canvas.width / 2) / tileW) * tileW;
  const endX = Math.floor((state.camera.x + canvas.width * 1.5) / tileW) * tileW;
  const startY = Math.floor((state.camera.y - canvas.height / 2) / tileH) * tileH;
  const endY = Math.floor((state.camera.y + canvas.height * 1.5) / tileH) * tileH;
  for (let x = startX; x <= endX; x += tileW) {
    for (let y = startY; y <= endY; y += tileH) {
      const sx = x - state.camera.x;
      const sy = y - state.camera.y;
      ctx.drawImage(img, sx, sy);
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderBackground();
  drawProjectiles(ctx, state);
  drawEnemies(ctx, state);
  drawPlayer(ctx, state);
  updateHud(state);
}

startGameLoop({ update, render });

function handleCombatAndXp(state) {
  // Enemy HP check, XP gain, and simple contact damage
  const before = state.enemies.length;
  state.enemies = state.enemies.filter((e) => e.hp > 0);
  const killed = before - state.enemies.length;
  if (killed > 0) {
    state.player.xp += killed * WORLD.xpPerEnemy;
  }

  // Level up
  if (state.player.xp >= state.player.xpToNext) {
    state.player.level += 1;
    state.player.xp -= state.player.xpToNext;
    state.player.xpToNext = xpForLevel(state.player.level);
    openLevelUp(state);
  }
}


