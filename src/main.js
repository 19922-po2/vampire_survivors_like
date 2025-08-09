import { ASSET_PATHS, WORLD, xpForLevel } from './config.js';
import { AssetStore } from './engine/assets.js';
import { AudioManager } from './engine/audio.js';
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
import { ensureStartMenu, showStartMenu, hideStartMenu } from './game/ui/menu.js';
import { ensureDeathMenu, showDeathMenu } from './game/ui/death.js';

// python -m http.server 5173
// http://localhost:5173

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
const audio = new AudioManager();
audio.bindForAutoStart(document.body);
state.audio = audio;
state.phase = 'menu';

await assets.loadImages(ASSET_PATHS);
ensureHud(state);
ensureStartMenu(state);
ensureDeathMenu(state);
showStartMenu(state, 'start');

// Center player at origin and let the world scroll under them
state.player.x = 0;
state.player.y = 0;
state.player.xpToNext = xpForLevel(state.player.level);

function update(dt) {
  if (state.phase === 'menu') {
    // idle until start
    return;
  }
  if (state.phase === 'dead') {
    return;
  }
  if (!state.pausedForLevel) {
    updatePlayer(state, input, dt, canvas);
    updateEnemies(state, dt);
    updateProjectiles(state, dt);
    spawner.update(dt);
    handleCombatAndXp(state, dt);
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

// Pause/Resume via ESC, reuse menu as pause overlay
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    if (state.phase === 'playing' && !state.pausedForLevel) {
      state.phase = 'menu';
      showStartMenu(state, 'pause');
    } else if (state.phase === 'menu') {
      state.phase = 'playing';
      hideStartMenu();
    }
  }
});

function handleCombatAndXp(state, dt) {
  // Enemy HP check, XP gain, and simple contact damage
  const died = state.enemies.filter((e) => e.hp <= 0);
  if (died.length) {
    for (const e of died) {
      if (e.boss) {
        state.kills.boss += 1;
        state.player.xp += WORLD.bossXp;
      } else {
        state.kills.normal += 1;
        state.player.xp += WORLD.xpPerEnemy;
      }
    }
    state.enemies = state.enemies.filter((e) => e.hp > 0);
  }

  // Level up
  if (state.player.xp >= state.player.xpToNext) {
    state.player.level += 1;
    state.player.xp -= state.player.xpToNext;
    state.player.xpToNext = xpForLevel(state.player.level);
    openLevelUp(state);
  }

  // Contact damage
  for (const e of state.enemies) {
    const dx = e.x - state.player.x;
    const dy = e.y - state.player.y;
    const rr = (e.r + state.player.r) * (e.r + state.player.r);
    if (dx * dx + dy * dy <= rr) {
      const dmg = e.boss ? WORLD.bossDamage : WORLD.enemyDamage;
      state.player.hp -= dmg * dt; // DPS-scaled contact damage
      if (state.player.hp <= 0) {
        state.player.hp = 0;
        state.phase = 'dead';
        showDeathMenu(state, e.boss ? 'Boss' : 'Monster');
        break;
      }
    }
  }

  // Restart request
  if (state._requestRestart) {
    state._requestRestart = false;
    hardReset();
  }
}

function hardReset() {
  // Reset core state without reloading assets
  state.time = 0;
  state.player.x = 0;
  state.player.y = 0;
  state.player.hp = state.player.maxHp;
  state.player.level = 1;
  state.player.xp = 0;
  state.player.xpToNext = xpForLevel(1);
  state.player.damage = WORLD.playerBaseDamage;
  state.player.fireRate = WORLD.playerBaseFireRate;
  state.player.projectilesPerShot = 1;
  state.player.projectileSpeed = WORLD.projectileSpeed;
  state.player.pickupRange = WORLD.pickupRange;
  state.enemies = [];
  state.projectiles = [];
  state.kills.normal = 0;
  state.kills.boss = 0;
  state.phase = 'menu';
  showStartMenu(state);
}


