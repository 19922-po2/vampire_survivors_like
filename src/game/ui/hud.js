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
}


