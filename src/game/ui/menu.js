export function ensureStartMenu(state) {
  const root = document.getElementById('ui-root');
  let el = document.getElementById('start-menu');
  if (!el) {
    el = document.createElement('div');
    el.id = 'start-menu';
    el.className = 'overlay';
    el.innerHTML = `
      <div class="menu-card">
        <h2 id="menu-title">Vampire Survivors Like</h2>
        <div class="menu-actions">
          <button id="btn-start">Start Game</button>
          <button id="btn-options">Options</button>
        </div>
        <div class="menu-section" id="options" style="display:none">
          <h4>Audio</h4>
          <div class="row">
            <label for="sfx-volume">Projectile Volume</label>
            <input id="sfx-volume" type="range" min="0" max="0.3" step="0.005" />
          </div>
        </div>
      </div>
    `;
    root.appendChild(el);
  }
  // Wire handlers
  const startBtn = el.querySelector('#btn-start');
  const optionsBtn = el.querySelector('#btn-options');
  const options = el.querySelector('#options');
  const vol = el.querySelector('#sfx-volume');
  if (startBtn && !startBtn._wired) {
    startBtn._wired = true;
    startBtn.addEventListener('click', () => {
      el.style.display = 'none';
      state.phase = 'playing';
      state.audio?.ensureStarted();
    });
  }
  if (optionsBtn && !optionsBtn._wired) {
    optionsBtn._wired = true;
    optionsBtn.addEventListener('click', () => {
      options.style.display = options.style.display === 'none' ? 'block' : 'none';
    });
  }
  if (vol && !vol._wired) {
    vol._wired = true;
    vol.value = String(state.audio?.sfxVolume ?? 0.06);
    vol.addEventListener('input', () => {
      if (state.audio) state.audio.sfxVolume = Number(vol.value);
    });
  }
  return el;
}

export function showStartMenu(state, mode = 'start') {
  const el = ensureStartMenu(state);
  const title = el.querySelector('#menu-title');
  const startBtn = el.querySelector('#btn-start');
  const vol = el.querySelector('#sfx-volume');
  if (mode === 'pause') {
    title.textContent = 'Paused';
    startBtn.textContent = 'Continue';
  } else {
    title.textContent = 'Vampire Survivors Like';
    startBtn.textContent = 'Start Game';
  }
  if (vol && state.audio) vol.value = String(state.audio.sfxVolume);
  el.style.display = 'flex';
}

export function hideStartMenu() {
  const el = document.getElementById('start-menu');
  if (el) el.style.display = 'none';
}


