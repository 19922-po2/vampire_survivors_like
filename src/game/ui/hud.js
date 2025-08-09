export function ensureHud(state) {
  const root = document.getElementById('ui-root');
  let el = document.getElementById('hud');
  if (!el) {
    el = document.createElement('div');
    el.id = 'hud';
    el.className = 'hud';
    el.innerHTML = `
      <div class="hud-row">
        <div class="hud-chip" id="level-chip">Lvl 1</div>
        <div class="hud-chip" id="hp-chip">HP</div>
      </div>
      <div class="bar"><div id="xp-bar" class="bar-fill" style="width:0%"></div></div>
      <div class="bar"><div id="hp-bar" class="bar-fill hp" style="width:100%"></div></div>
    `;
    root.appendChild(el);

    // Stats panel
    const stats = document.createElement('div');
    stats.id = 'stats-panel';
    stats.className = 'stats-panel';
    stats.innerHTML = `
      <h4>Player Stats</h4>
      <div class="stats-grid" id="stats-grid"></div>
    `;
    root.appendChild(stats);
  }
  return el;
}

export function updateHud(state) {
  const el = ensureHud(state);
  const p = state.player;
  const xpPct = Math.max(0, Math.min(1, p.xp / p.xpToNext)) * 100;
  const hpPct = Math.max(0, Math.min(1, p.hp / p.maxHp)) * 100;
  el.querySelector('#xp-bar').style.width = `${xpPct}%`;
  el.querySelector('#hp-bar').style.width = `${hpPct}%`;
  el.querySelector('#level-chip').textContent = `Lvl ${p.level}`;
  el.querySelector('#hp-chip').textContent = `HP ${Math.ceil(p.hp)} / ${p.maxHp}`;

  const statsGrid = document.getElementById('stats-grid');
  if (statsGrid) {
    const rows = [
      ['HP', `${Math.ceil(p.hp)} / ${p.maxHp}`],
      ['Level', `${p.level}`],
      ['XP', `${p.xp} / ${p.xpToNext}`],
      ['Damage', `${p.damage.toFixed(1)}`],
      ['Attack Speed', `${p.fireRate.toFixed(2)} /s`],
      ['Move Speed', `${p.speed.toFixed(1)}`],
      ['Projectiles', `${p.projectilesPerShot}`],
      ['Proj Speed', `${p.projectileSpeed.toFixed(0)}`],
      ['Pickup Range', `${p.pickupRange.toFixed(0)}`],
      ['Kills (N)', `${state.kills.normal}`],
      ['Kills (Boss)', `${state.kills.boss}`],
      ['Time', formatTime(state.time)],
    ];
    statsGrid.innerHTML = rows.map(([k, v]) => `<div>${k}</div><div>${v}</div>`).join('');
  }
}

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}


