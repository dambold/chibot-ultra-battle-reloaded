// ══════════════════════════════════════════════
//   CHIBOT ULTRA BATTLE — ui/setup.js
//   Setup screen DOM logic
// ══════════════════════════════════════════════

import { ARENAS } from '../data/arenas.js';
import { ALL_CHARACTERS as CHARACTERS, heroChars, villainChars } from '../data/pools.js';
import { state, makeFighter, resetState, pickRandomItem } from '../engine/engine.js';
import { buildBattleUI, chatMsg, aiTick, arenaTick, renderCmdStrip } from './battle.js';
import { handleChatInput } from './commands.js';

// ── SERIES CONFIG ─────────────────────────────
const SERIES_CONFIG = [
  { key:'all',     label:'ALL',           color:'#00ffff', tagline:'Every fighter. Total chaos.',                                    series:[] },
  { key:'smeb',    label:'SAILOR MOON',   color:'#ff88cc', tagline:'The Sailor Senshi defend the universe — and destroy you.',       series:['SMEB'] },
  { key:'dbz',     label:'DRAGON BALL Z', color:'#ffaa00', tagline:'Power levels beyond comprehension. Kamehameha.',                 series:['DBZ'] },
  { key:'ff7',     label:'FINAL FANTASY', color:'#aa88ff', tagline:'SOLDIER, Cetra, and the world\'s most dangerous angel.',         series:['FF7'] },
  { key:'mvc',     label:'MARVEL VS CAP', color:'#ff3333', tagline:'Ryu, Venom, Morrigan — all in one arena.',                     series:['MvC'] },
  { key:'zelda',   label:'ZELDA 64',      color:'#44ffaa', tagline:'The Triforce, the Master Sword, and the King of Evil.',          series:['Zelda64'] },
  { key:'smrpg',   label:'MARIO RPG',     color:'#ff6644', tagline:'It\'s-a me — and some very dangerous friends.',                  series:['SMRPG'] },
  { key:'pokemon', label:'POKEMON',       color:'#ffee44', tagline:'Gotta catch \'em all. Or just destroy them.',                   series:['Pokemon'] },
  { key:'tenchi',  label:'TENCHI MUYO',   color:'#88ccff', tagline:'Jurai royal blood, space pirates, and someone doing chores.',   series:['TenchiMuyo'] },
  { key:'xmen',    label:'X-MEN',          color:'#ffcc00', tagline:'Mutants, optic blasts, and a rogue Mercedes Benz.',            series:['XMen'] },
  { key:'tng',     label:'STAR TREK TNG',  color:'#4488ff', tagline:'To boldly fight where no one has fought before.',               series:['TNG'] },
  { key:'starwars', label:'STAR WARS',       color:'#ffdd00', tagline:'A long time ago in an arena far far away...',                    series:['StarWars'] },
  { key:'oc',      label:'ORIGINAL CHARS',color:'#88ff88', tagline:'The OG chat room crew. Espresso and dimension-hopping.',        series:['OC','XFiles'] },
];

let activeSeries = 'all';

export function buildSeriesTabs() {
  const container = document.getElementById('series-tabs');
  if (!container) return;
  container.innerHTML = '';

  const pool = currentMode === 'team' ? heroChars() : CHARACTERS;

  SERIES_CONFIG.forEach(cfg => {
    // Only show tabs that have characters in current pool
    const hasChars = cfg.key === 'all' || pool.some(c => cfg.series.includes(c.series));
    if (!hasChars) return;

    const btn = document.createElement('button');
    btn.className = 'series-tab' + (activeSeries === cfg.key ? ' active' : '');
    btn.textContent = cfg.label;
    btn.style.color           = activeSeries === cfg.key ? cfg.color : '';
    btn.style.borderColor     = activeSeries === cfg.key ? cfg.color : '';
    btn.style.backgroundColor = activeSeries === cfg.key ? `${cfg.color}18` : '';

    btn.onclick = () => {
      activeSeries = cfg.key;
      buildSeriesTabs();
      buildCharGrid();
      updateSeriesBanner(cfg);
    };
    container.appendChild(btn);
  });
}

function updateSeriesBanner(cfg) {
  const banner  = document.getElementById('series-banner');
  const label   = document.getElementById('series-banner-label');
  const tagline = document.getElementById('series-banner-tagline');
  if (!banner) return;
  banner.style.borderLeftColor = cfg.color;
  banner.style.backgroundColor = `${cfg.color}08`;
  label.style.color            = cfg.color;
  label.textContent            = cfg.label;
  tagline.textContent          = cfg.tagline;
}
let currentMode = 'free';
let selectedChar = '';
let selectedArena = '';
let aiSlots = [];
let allySlots = [];
let enemySlots = [];

export function buildSetupUI() {
  selectedChar  = heroChars()[0]?.id || CHARACTERS[0].id;
  selectedArena = ARENAS[0].id;

  setMode('free');
  buildArenaGrid();
  buildSeriesTabs();
  buildCharGrid();
  addAISlot();
  addAISlot();
  addAllySlot();
  addEnemySlot();

  // Wire up mode buttons
  document.getElementById('mode-free-btn').onclick = () => setMode('free');
  document.getElementById('mode-team-btn').onclick = () => setMode('team');

  // Wire up start button
  document.getElementById('start-battle-btn').onclick = startBattle;

  // Wire up chat input
  document.getElementById('chat-send-btn').onclick = handleChatInput;
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleChatInput();
  });

  // Wire up gameover buttons
  document.getElementById('gameover-new-btn').onclick  = returnToSetup;
  document.getElementById('gameover-review-btn').onclick = reviewLog;
}

// ── MODE ──────────────────────────────────────
export function setMode(mode) {
  currentMode = mode;
  activeSeries = 'all';
  document.getElementById('free-battle-section').style.display = mode === 'free' ? '' : 'none';
  document.getElementById('team-battle-section').style.display = mode === 'team' ? '' : 'none';
  document.getElementById('mode-free-btn').className = 'mode-btn' + (mode === 'free' ? ' active' : '');
  document.getElementById('mode-team-btn').className = 'mode-btn' + (mode === 'team' ? ' active team' : '');
  buildSeriesTabs();
  buildCharGrid();
  // Reset banner to ALL
  updateSeriesBanner(SERIES_CONFIG[0]);
}

// ── CHARACTER GRID ────────────────────────────
export function buildCharGrid() {
  const grid = document.getElementById('char-grid');
  if (!grid) return;
  grid.innerHTML = '';
  let pool = currentMode === 'team' ? heroChars() : CHARACTERS;

  // Filter by active series tab
  if (activeSeries !== 'all') {
    const cfg = SERIES_CONFIG.find(s => s.key === activeSeries);
    if (cfg) pool = pool.filter(c => cfg.series.includes(c.series));
  }

  pool.forEach(c => {
    const el = document.createElement('div');
    el.className = 'char-option' + (c.id === selectedChar ? ' selected' : '');
    el.dataset.id = c.id;
    el.innerHTML = `<span class="char-option-name">${c.name}</span><span class="char-option-series">${c.series}</span>`;
    el.onclick = () => {
      selectedChar = c.id;
      grid.querySelectorAll('.char-option').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
    };
    grid.appendChild(el);
  });
}

// ── ARENA GRID ────────────────────────────────
export function buildArenaGrid() {
  const grid = document.getElementById('arena-grid');
  if (!grid) return;
  grid.innerHTML = '';
  ARENAS.forEach(a => {
    const el = document.createElement('div');
    el.className = 'arena-option' + (a.id === selectedArena ? ' selected' : '');
    el.innerHTML = `<span class="arena-option-name">${a.name}</span><span class="arena-option-desc">${a.desc}</span>`;
    el.onclick = () => {
      selectedArena = a.id;
      grid.querySelectorAll('.arena-option').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
    };
    grid.appendChild(el);
  });
}

// ── AI SLOTS (Free Battle) ────────────────────
export function addAISlot() {
  const pool = CHARACTERS;
  const slotData = { id: Date.now() + Math.random(), char: pool[Math.floor(Math.random() * pool.length)].id, name: '' };
  aiSlots.push(slotData);
  renderAISlots();
}

function renderAISlots() {
  const container = document.getElementById('ai-slots');
  if (!container) return;
  container.innerHTML = '';
  aiSlots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'ai-slot';

    const sel = document.createElement('select');
    CHARACTERS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.series})`;
      if (c.id === slot.char) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = () => { slot.char = sel.value; };

    const nameInput = document.createElement('input');
    nameInput.type = 'text'; nameInput.placeholder = 'AI name'; nameInput.maxLength = 16;
    nameInput.value = slot.name;
    nameInput.oninput = () => { slot.name = nameInput.value; };

    const rem = document.createElement('button');
    rem.className = 'remove-ai'; rem.textContent = '✕';
    rem.onclick = () => { aiSlots = aiSlots.filter(s => s.id !== slot.id); renderAISlots(); };

    div.appendChild(sel); div.appendChild(nameInput); div.appendChild(rem);
    container.appendChild(div);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'slot-add-btn'; addBtn.textContent = '+ Add AI Fighter';
  addBtn.style.display = aiSlots.length >= 5 ? 'none' : '';
  addBtn.onclick = addAISlot;
  container.appendChild(addBtn);
}

// ── ALLY SLOTS (Team Battle) ──────────────────
export function addAllySlot() {
  const pool = heroChars();
  allySlots.push({ id: Date.now() + Math.random(), char: pool[Math.floor(Math.random() * pool.length)].id, name: '' });
  renderAllySlots();
}

function renderAllySlots() {
  const container = document.getElementById('ally-slots');
  if (!container) return;
  container.innerHTML = '';
  allySlots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'ai-slot';
    const sel = document.createElement('select');
    heroChars().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id; opt.textContent = `${c.name} (${c.series})`;
      if (c.id === slot.char) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = () => { slot.char = sel.value; };
    const nameInput = document.createElement('input');
    nameInput.type = 'text'; nameInput.placeholder = 'Ally name'; nameInput.maxLength = 16;
    nameInput.value = slot.name;
    nameInput.oninput = () => { slot.name = nameInput.value; };
    const rem = document.createElement('button');
    rem.className = 'remove-ai'; rem.textContent = '✕';
    rem.onclick = () => { allySlots = allySlots.filter(s => s.id !== slot.id); renderAllySlots(); };
    div.appendChild(sel); div.appendChild(nameInput); div.appendChild(rem);
    container.appendChild(div);
  });
  const addBtn = document.createElement('button');
  addBtn.className = 'slot-add-btn'; addBtn.textContent = '+ Add Ally';
  addBtn.style.display = allySlots.length >= 4 ? 'none' : '';
  addBtn.onclick = addAllySlot;
  container.appendChild(addBtn);
}

// ── ENEMY SLOTS (Team Battle) ─────────────────
export function addEnemySlot() {
  const pool = villainChars();
  enemySlots.push({ id: Date.now() + Math.random(), char: pool[Math.floor(Math.random() * pool.length)].id, name: '' });
  renderEnemySlots();
}

function renderEnemySlots() {
  const container = document.getElementById('enemy-slots');
  if (!container) return;
  container.innerHTML = '';
  enemySlots.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'ai-slot';
    const sel = document.createElement('select');
    villainChars().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id; opt.textContent = `${c.name} (${c.series})`;
      if (c.id === slot.char) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = () => { slot.char = sel.value; };
    const nameInput = document.createElement('input');
    nameInput.type = 'text'; nameInput.placeholder = 'Enemy name'; nameInput.maxLength = 16;
    nameInput.value = slot.name;
    nameInput.oninput = () => { slot.name = nameInput.value; };
    const rem = document.createElement('button');
    rem.className = 'remove-ai'; rem.textContent = '✕';
    rem.onclick = () => { enemySlots = enemySlots.filter(s => s.id !== slot.id); renderEnemySlots(); };
    div.appendChild(sel); div.appendChild(nameInput); div.appendChild(rem);
    container.appendChild(div);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'slot-add-btn'; addBtn.textContent = '+ Add Enemy';
  addBtn.style.display = enemySlots.length >= 5 ? 'none' : '';
  addBtn.onclick = addEnemySlot;
  container.appendChild(addBtn);

  // Boss mode panel
  const bossPanel = document.getElementById('boss-mode-panel');
  if (bossPanel) bossPanel.style.display = enemySlots.length === 1 ? '' : 'none';
}

// ── START BATTLE ──────────────────────────────
export function startBattle() {
  const playerName = document.getElementById('player-name').value.trim() || 'Warrior';
  const playerChar = CHARACTERS.find(c => c.id === selectedChar) || heroChars()[0];
  const arena      = ARENAS.find(a => a.id === selectedArena) || ARENAS[0];
  const fighters   = [];
  let idx = 0;

  // Player fighter
  const pf = makeFighter(playerChar, playerName, true, idx++);
  state.player = pf;
  fighters.push(pf);
  state.currentMode = currentMode;

  if (currentMode === 'free') {
    aiSlots.forEach(slot => {
      const c = CHARACTERS.find(x => x.id === slot.char) || CHARACTERS[0];
      const name = slot.name.trim() || c.name;
      fighters.push(makeFighter(c, name, false, idx++));
    });
  } else {
    allySlots.forEach(slot => {
      const c = CHARACTERS.find(x => x.id === slot.char) || heroChars()[0];
      const name = slot.name.trim() || c.name;
      const f = makeFighter(c, name, false, idx++);
      f.isAlly = true;
      fighters.push(f);
    });

    const bossMode = enemySlots.length === 1;
    const bossMult = bossMode ? parseInt(document.getElementById('boss-difficulty')?.value || '3') : 1;

    enemySlots.forEach(slot => {
      const c = CHARACTERS.find(x => x.id === slot.char) || villainChars()[0];
      const name = slot.name.trim() || c.name;
      const f = makeFighter(c, name, false, idx++);
      f.isEnemy = true;
      if (bossMode) {
        f.maxHP = Math.round(f.maxHP * bossMult);
        f.currentHP = f.maxHP;
        f.isBoss = true;
        f.bossMult = bossMult;
      }
      fighters.push(f);
    });
  }

  state.fighters = fighters;
  state.arena    = arena;
  state.round    = 1;
  state.battleOver = false;
  state.spaCharge  = 0;
  state.currentItem = null;

  // Apply arena stat boosts (Danger Room training bonus)
  if (arena.effect?.physStr || arena.effect?.magStr) {
    const physMult = arena.effect.physStr || 1;
    const magMult  = arena.effect.magStr  || 1;
    state.fighters.forEach(f => {
      if (physMult !== 1) f.physStr = Math.round(f.physStr * physMult);
      if (magMult  !== 1) f.magStr  = Math.round(f.magStr  * magMult);
    });
  }

  // Switch screens
  document.getElementById('setup-screen').style.display  = 'none';
  document.getElementById('battle-screen').style.display = '';

  buildBattleUI();

  // Init chat log
  chatMsg('system', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  chatMsg('system', `◈ ChiBot Ultra Battle — Multi-File Edition`);
  chatMsg('arena',  `◈ Arena: ${arena.name} — ${arena.desc}`);
  if (currentMode === 'team') chatMsg('status', `◈ MODE: TEAM BATTLE`);
  chatMsg('system', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  fighters.forEach(f => {
    const tag = f.isPlayer ? ' [YOU]' : f.isAlly ? ' [ALLY]' : f.isBoss ? ` [BOSS ×${f.bossMult} HP]` : f.isEnemy ? ' [ENEMY]' : '';
    chatMsg('system', `★ ${f.scrName} has joined as ${f.name}!${tag}`);
  });
  const boss = fighters.find(f => f.isBoss);
  if (boss) {
    chatMsg('super', `★★★ BOSS MODE ACTIVATED! ★★★`);
    chatMsg('super', `${boss.scrName} has ${boss.currentHP} HP — ${boss.bossMult}x normal strength!`);
  }
  chatMsg('system', ``);
  chatMsg('system', `━━ BATTLE BEGIN! ━━━━━━━━━━━━━━━━━━━━━━`);
  chatMsg('info',   `Type /help for commands.`);

  // Start loops
  clearInterval(window._aiLoopId);
  clearInterval(window._arenaLoopId);
  clearTimeout(window._itemTimerId);

  window._aiLoopId = setInterval(() => {
    aiTick();
    clearInterval(window._aiLoopId);
    window._aiLoopId = setInterval(aiTick, 15000 + Math.random() * 3000);
  }, 15000 + Math.random() * 3000);

  window._arenaLoopId = setInterval(arenaTick, 20000);

  window._itemTimerId = setTimeout(() => {
    if (state.battleOver) return;
    const item = pickRandomItem();
    state.currentItem = item;
    chatMsg('item', `━━ ITEM APPEARED! ━━━━━━━━━━━━━━━━━━━━━━`);
    chatMsg('item', `✦ ${item.appear}`);
    chatMsg('item', `✦ Type /get to grab the ${item.name}!`);
    chatMsg('item', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }, 20000 + Math.random() * 40000);
}

// ── RETURN TO SETUP ───────────────────────────
export function returnToSetup() {
  clearInterval(window._aiLoopId);
  clearInterval(window._arenaLoopId);
  clearTimeout(window._itemTimerId);

  resetState();
  aiSlots = []; allySlots = []; enemySlots = [];

  document.getElementById('gameover-overlay').classList.remove('show');
  document.getElementById('battle-screen').style.display = 'none';
  document.getElementById('setup-screen').style.display  = '';
  document.getElementById('ai-slots').innerHTML    = '';
  document.getElementById('ally-slots').innerHTML  = '';
  document.getElementById('enemy-slots').innerHTML = '';
  document.getElementById('chat-log').innerHTML    = '';

  addAISlot(); addAISlot();
  addAllySlot(); addEnemySlot();
  buildCharGrid();
}

export function reviewLog() {
  document.getElementById('gameover-overlay').classList.remove('show');
  chatMsg('system', '--- BATTLE ENDED --- Scroll up to review the log.');
}
