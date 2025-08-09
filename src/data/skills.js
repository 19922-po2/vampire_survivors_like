// Simple pool of skills and stat upgrades
export const SKILL_POOL = [
  {
    id: 'proj_count_+1',
    name: '+1 Projectile',
    description: 'Fire one additional projectile per shot.',
    apply(state) {
      state.player.projectilesPerShot += 1;
    }
  },
  {
    id: 'atk_speed_+15',
    name: '+15% Attack Speed',
    description: 'Reduce time between shots by 15%.',
    apply(state) {
      state.player.fireRate *= 1.15;
    }
  },
  {
    id: 'dmg_+20',
    name: '+20% Damage',
    description: 'Your projectiles deal 20% more damage.',
    apply(state) {
      state.player.damage *= 1.2;
    }
  },
  {
    id: 'move_+15',
    name: '+15% Move Speed',
    description: 'Increase movement speed by 15%.',
    apply(state) {
      state.player.speed *= 1.15;
    }
  },
  {
    id: 'hp_+20',
    name: '+20 Max HP',
    description: 'Increase maximum HP by 20 and heal 20.',
    apply(state) {
      state.player.maxHp += 20;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 20);
    }
  },
  {
    id: 'proj_speed_+20',
    name: '+20% Projectile Speed',
    description: 'Projectiles travel 20% faster.',
    apply(state) {
      state.player.projectileSpeed *= 1.2;
    }
  },
  {
    id: 'pickup_+50',
    name: '+50% Pickup Range',
    description: 'Pick up orbs and items from further away.',
    apply(state) {
      state.player.pickupRange *= 1.5;
    }
  },
];


