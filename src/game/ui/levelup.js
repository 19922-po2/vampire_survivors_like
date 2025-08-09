import { SKILL_POOL } from '../../data/skills.js';

export function ensureLevelUi(state) {
  const root = document.getElementById('ui-root');
  let el = document.getElementById('levelup');
  if (!el) {
    el = document.createElement('div');
    el.id = 'levelup';
    el.className = 'overlay';
    el.style.display = 'none';
    el.innerHTML = `
      <div class="levelup-card">
        <h3 class="levelup-title">Level Up! Choose a bonus</h3>
        <div class="choices" id="choices"></div>
      </div>
    `;
    root.appendChild(el);
  }
  return el;
}

export function openLevelUp(state) {
  const ui = ensureLevelUi(state);
  const container = ui.querySelector('#choices');
  container.innerHTML = '';
  const choices = pickThree(state);
  state.pendingChoices = choices;
  choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerHTML = `<h4>${choice.name}</h4><p>${choice.description}</p>`;
    btn.addEventListener('click', () => {
      choice.apply(state);
      closeLevelUp(state);
    });
    container.appendChild(btn);
  });
  state.pausedForLevel = true;
  ui.style.display = 'flex';
}

export function closeLevelUp(state) {
  const ui = ensureLevelUi(state);
  ui.style.display = 'none';
  state.pausedForLevel = false;
  state.pendingChoices = null;
}

function pickThree(state) {
  const rng = state.rng;
  const candidates = [...SKILL_POOL];
  // Simple shuffle
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, 3);
}


