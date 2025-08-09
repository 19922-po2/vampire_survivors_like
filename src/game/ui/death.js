export function ensureDeathMenu(state) {
  const root = document.getElementById('ui-root');
  let el = document.getElementById('death-menu');
  if (!el) {
    el = document.createElement('div');
    el.id = 'death-menu';
    el.className = 'overlay';
    el.style.display = 'none';
    el.innerHTML = `
      <div class="menu-card">
        <h2>You Died</h2>
        <p id="death-detail">...</p>
        <div class="menu-actions">
          <button id="btn-restart">Restart</button>
        </div>
      </div>
    `;
    root.appendChild(el);
  }
  const restart = el.querySelector('#btn-restart');
  if (restart && !restart._wired) {
    restart._wired = true;
    restart.addEventListener('click', () => {
      state._requestRestart = true;
      el.style.display = 'none';
    });
  }
  return el;
}

export function showDeathMenu(state, lastHitBy) {
  const el = ensureDeathMenu(state);
  const detail = el.querySelector('#death-detail');
  detail.textContent = lastHitBy ? `Killed by: ${lastHitBy}` : 'Killed in action';
  el.style.display = 'flex';
}


