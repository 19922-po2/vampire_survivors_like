import { randRange } from '../engine/math.js';
import { spawnEnemy } from './entities/enemy.js';
import { WORLD } from '../config.js';

export function createSpawner(state) {
  return {
    timer: 0,
    rate: WORLD.baseEnemySpawnRatePerSecond, // spawns/sec
    update(dt) {
      // Difficulty ramp
      state.time += dt;
      const minutes = state.time / 60;
      this.rate = WORLD.baseEnemySpawnRatePerSecond + minutes * WORLD.enemySpawnAccelerationPerMinute;
      this.timer += dt * this.rate;
      while (this.timer >= 1) {
        this.timer -= 1;
        spawnAroundPlayer(state);
      }
    },
  };
}

function spawnAroundPlayer(state) {
  const radius = 520;
  const angle = randRange(state.rng, 0, Math.PI * 2);
  const x = state.player.x + Math.cos(angle) * radius;
  const y = state.player.y + Math.sin(angle) * radius;
  const type = Math.random() < 0.5 ? 1 : 2;
  spawnEnemy(state, x, y, type);
}


