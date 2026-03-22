// ══════════════════════════════════════════════
//   CHIBOT ULTRA BATTLE — ui/battle.js
//   Battle screen UI — DOM rendering & loops
// ══════════════════════════════════════════════

import { VILLAIN_SERIES } from '../data/pools.js';
import {
  state, parse, calcDamage, calcHeal,
  applyMoveStatus, tickStatuses, aiChooseAction,
  applyItemEffect, pickRandomItem, getBattleResult,
} from '../engine/engine.js';

// ── CHAT LOG ──────────────────────────────────
export function chatMsg(type, text) {
  const log = document.getElementById('chat-log');
  if (!log) return;
  const div = document.createElement('div');
  div.className = `msg msg-${type}`;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// ── ATTACK GIF PANEL ─────────────────────────
let gifTimer = null;
export function showAttackGif(attacker, move) {
  if (!move.gifUrl) return;
  const panel  = document.getElementById('attack-gif-panel');
  const img    = document.getElementById('attack-gif-img');
  const header = document.getElementById('attack-gif-header');
  const label  = document.getElementById('attack-gif-move');
  if (!panel) return;

  const isVillain = attacker && VILLAIN_SERIES.includes(attacker.series);
  panel.className = 'show' + (isVillain ? ' villain' : '');
  header.textContent = `◈ ${attacker ? attacker.scrName : 'ATTACK'}`;
  label.textContent  = move.name;
  img.src = move.gifUrl;

  if (gifTimer) clearTimeout(gifTimer);
  gifTimer = setTimeout(() => {
    panel.className = panel.className.replace('show','').trim();
    setTimeout(() => { img.src = ''; }, 300);
  }, 4500);
}

// ── FIGHTER CARDS ─────────────────────────────
export function buildBattleUI() {
  const mode = state.currentMode;
  document.getElementById('left-panel-header').textContent  = mode === 'team' ? '◈ YOUR TEAM'  : '◈ YOUR FIGHTER';
  document.getElementById('right-panel').querySelector('.panel-header').textContent = mode === 'team' ? '◈ ENEMIES' : '◈ OPPONENTS';
  renderPlayerCards();
  renderAICards();
  renderMoveGrid();
  renderTargetSelect();
  setSuperPips(0);
}

export function renderPlayerCards() {
  const container = document.getElementById('player-cards');
  container.innerHTML = '';
  container.appendChild(makeCombatantCard(state.player));
  if (state.currentMode === 'team') {
    state.fighters.filter(f => f.isAlly && !f.isPlayer)
      .forEach(f => container.appendChild(makeCombatantCard(f)));
  }
}

export function renderAICards() {
  const container = document.getElementById('ai-cards');
  container.innerHTML = '';
  const cards = state.currentMode === 'team'
    ? state.fighters.filter(f => f.isEnemy)
    : state.fighters.filter(f => !f.isPlayer);
  cards.forEach(f => container.appendChild(makeCombatantCard(f)));
}

export function makeCombatantCard(f) {
  const card = document.createElement('div');
  card.className = 'combatant-card' + (f.isPlayer ? ' player-card' : '') + (f.isDead ? ' dead' : '') + (f.isBoss ? ' boss-card' : '');
  card.id = `card-${f.idx}`;

  const hpPct = Math.max(0, Math.min(100, (f.currentHP / f.maxHP) * 100));
  const mpPct = Math.max(0, Math.min(100, (f.currentMP / f.maxMP) * 100));
  const spPct = Math.max(0, Math.min(100, (f.currentSP / f.maxSP) * 100));
  const hpLow = hpPct < 25;
  const statuses = Object.entries(f.statuses || {}).filter(([,v]) => v)
    .map(([k]) => `<span class="status-badge ${k}">${k.toUpperCase()}</span>`).join('');

  card.innerHTML = `
    <div class="char-name ${f.isPlayer ? 'player-name' : ''}">${f.scrName}${f.isBoss ? ` <span class="boss-tag">👑×${f.bossMult}</span>` : ''}</div>
    <div class="char-fullname">${f.name} [${f.series}]</div>
    <div class="stat-bars">
      <div class="bar-row">
        <span class="bar-label">HP</span>
        <div class="bar-track"><div class="bar-fill hp${hpLow?' low':''}" style="width:${hpPct}%"></div></div>
        <span class="bar-val">${f.currentHP}/${f.maxHP}</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">MP</span>
        <div class="bar-track"><div class="bar-fill mp" style="width:${mpPct}%"></div></div>
        <span class="bar-val">${f.currentMP}/${f.maxMP}</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">SP</span>
        <div class="bar-track"><div class="bar-fill sp" style="width:${spPct}%"></div></div>
        <span class="bar-val">${f.currentSP}/${f.maxSP}</span>
      </div>
    </div>
    ${statuses ? `<div class="status-badges">${statuses}</div>` : ''}
    ${f.currentAction ? `<div class="current-action">${f.currentAction}</div>` : ''}
    ${f.isDead ? '<div class="dead-overlay">☠ DEFEATED</div>' : ''}
  `;
  return card;
}

export function updateCard(f) {
  const existing = document.getElementById(`card-${f.idx}`);
  if (!existing) return;
  existing.replaceWith(makeCombatantCard(f));
}

export function flashCard(idx, type) {
  const card = document.getElementById(`card-${idx}`);
  if (!card) return;
  card.classList.remove('hit-flash','heal-flash');
  void card.offsetWidth;
  card.classList.add(type === 'hit' ? 'hit-flash' : 'heal-flash');
  setTimeout(() => card.classList.remove('hit-flash','heal-flash'), 400);
}

// ── MOVE GRID / CMD STRIP ─────────────────────
export function renderMoveGrid() { renderCmdStrip(); }

export function renderCmdStrip() {
  const strip = document.getElementById('cmd-strip');
  if (!strip) return;
  strip.innerHTML = '';
  const p = state.player;
  if (!p) return;

  p.moves.forEach(mv => {
    const chip = document.createElement('button');
    chip.className = `cmd-chip ${mv.type}${mv.isSuper?' super':''}${mv.isSPA?' spa':''}`;
    chip.title = `${mv.name} — MP: ${mv.mpCost || 'Free'} | ${mv.type.toUpperCase()}`;
    chip.textContent = `/${mv.cmd}${mv.isSuper?' ★':''}${mv.isSPA?` [${state.spaCharge}/5]`:''}`;
    chip.onclick = () => {
      document.getElementById('chat-input').value = `/${mv.cmd}`;
      document.getElementById('chat-input').focus();
    };
    strip.appendChild(chip);
  });

  [['rest','💤 /rest'],['block','🛡 /block'],['flee','🏃 /flee'],
   ['taunt','💬 /taunt'],['get','📦 /get'],['help','❓ /help']].forEach(([cmd,label]) => {
    const chip = document.createElement('button');
    chip.className = 'cmd-chip sys';
    chip.textContent = label;
    chip.onclick = () => {
      document.getElementById('chat-input').value = `/${cmd}`;
      document.getElementById('chat-input').focus();
    };
    strip.appendChild(chip);
  });
}

// ── TARGET SELECT ─────────────────────────────
export function renderTargetSelect() {
  const sel = document.getElementById('target-select');
  if (!sel) return;
  sel.innerHTML = '';
  const targets = state.currentMode === 'team'
    ? state.fighters.filter(f => f.isEnemy && !f.isDead)
    : state.fighters.filter(f => !f.isPlayer && !f.isDead);

  targets.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.idx;
    const bossTag = f.isBoss ? ` 👑${f.bossMult}x` : '';
    opt.textContent = `${f.scrName} [${f.currentHP}HP]${bossTag}`;
    sel.appendChild(opt);
  });

  if (!sel.options.length) {
    const opt = document.createElement('option');
    opt.textContent = '— no targets —';
    sel.appendChild(opt);
  }
}

export function getSelectedTarget() {
  const sel = document.getElementById('target-select');
  const idx = parseInt(sel?.value);
  return state.fighters.find(f => f.idx === idx && !f.isDead) || null;
}

// ── SUPER PIPS ────────────────────────────────
export function setSuperPips(n) {
  state.superLevel = n;
  const pips = document.querySelectorAll('.super-pip');
  pips.forEach((pip, i) => pip.classList.toggle('active', i < n));
}

// ── INPUT LOCK ────────────────────────────────
export function setInputDisabled(disabled) {
  const inp = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send-btn');
  if (inp) inp.disabled = disabled;
  if (btn) btn.disabled = disabled;
  if (inp) inp.placeholder = disabled
    ? '⏳ Waiting for result...'
    : '/ss  /fsoul  /rest  /block  /flee  /taunt  /help';
}

// ── APPLY MOVE ────────────────────────────────
export function applyMove(attacker, targetFighter, moveIdx, superLevel) {
  const move = attacker.moves[moveIdx];
  if (!move) return;

  attacker.currentMP = Math.max(0, attacker.currentMP - move.mpCost);
  updateCard(attacker);

  chatMsg(attacker.isPlayer ? 'player' : 'ai',
    `${attacker.scrName}: ${parse(move.pre, attacker, targetFighter)}`);

  showAttackGif(attacker, move);

  if (attacker.isPlayer) setInputDisabled(true);

  setTimeout(() => {
    const prefix = superLevel > 0 ? `[SUPER Lv${superLevel}] ` : '';

    // ── SCAN ──
    if (move.isScan && targetFighter) {
      if (Math.random() * 100 < (move.hitRate || 90)) {
        chatMsg('info', parse(move.hit, attacker, targetFighter));
        const sl = Object.keys(targetFighter.statuses).filter(s => targetFighter.statuses[s]);
        chatMsg('system', `━━ SCAN: ${targetFighter.scrName} (${targetFighter.name}) ━━━━━━━━━━━`);
        chatMsg('info',   `  HP: ${targetFighter.currentHP} / ${targetFighter.maxHP}`);
        chatMsg('info',   `  MP: ${targetFighter.currentMP} / ${targetFighter.maxMP}`);
        chatMsg('info',   `  SP: ${targetFighter.currentSP} / ${targetFighter.maxSP}`);
        chatMsg('info',   `  Statuses: ${sl.length ? sl.join(', ').toUpperCase() : 'None'}`);
        chatMsg('system', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      } else {
        chatMsg('info', parse(move.miss, attacker, targetFighter));
      }
    }
    // ── BARRIER ──
    else if (move.isBarrier) {
      attacker.statuses.barrier = true;
      chatMsg('status', `  ✦ ${attacker.scrName} is shielded! Incoming damage halved.`);
      // Some barriers freeze the user momentarily as they form
      if (move.selfStop && Math.random() < (move.selfStopChance || 0.3)) {
        attacker.statuses.stop = true;
        chatMsg('status', `  ✦ ${attacker.scrName} is momentarily frozen as the temporal shield forms around them!!`);
      }
      updateCard(attacker);
    }
    // ── SAILOR PLANET ATTACK ──
    else if (move.isSPA) {
      state.spaCharge++;
      chatMsg('super', `  ✦ Sailor Planet Attack charging... [${state.spaCharge}/5]`);
      renderCmdStrip();

      // ── COORDINATE INNER SENSHI ALLIES ──────────
      // If player fired /spa, queue all alive Inner Senshi allies to charge next turn
      if (attacker.isPlayer && state.currentMode === 'team') {
        const INNER_SENSHI_IDS = ['moon','mars','mercury','jupiter','venus'];
        const INNER_LINES = {
          moon:    'Everyone! Let\'s do it together!! Moon Crystal Power!!',
          mercury: 'Calculating optimal trajectory — Mercury Crystal Power!!',
          mars:    'The fire of Mars burns with you — Mars Crystal Power!!',
          jupiter: 'Jupiter\'s thunder answers the call — Jupiter Crystal Power!!',
          venus:   'Love and beauty unite — Venus Crystal Power!!',
        };
        const senshi = state.fighters.filter(f =>
          f.isAlly && !f.isDead && !f.isPlayer &&
          INNER_SENSHI_IDS.includes(f.id) &&
          !f.statuses?.mute
        );
        if (senshi.length > 0) {
          setTimeout(() => {
            senshi.forEach(ally => {
              const spaMove = ally.moves?.find(m => m.isSPA);
              if (!spaMove) return;
              if (ally.currentMP < spaMove.mpCost) {
                chatMsg('status', `  ✦ ${ally.scrName}: Not enough MP to charge the Sailor Planet Attack!`);
                return;
              }
              const line = INNER_LINES[ally.id] || 'Crystal Power!!';
              chatMsg('super', `  ✦ ${ally.scrName}: "${line}"`);
              ally.currentMP = Math.max(0, ally.currentMP - spaMove.mpCost);
              state.spaCharge++;
              chatMsg('super', `  ✦ Sailor Planet Attack charging... [${state.spaCharge}/5]`);
              renderCmdStrip();
              updateCard(ally);

              if (state.spaCharge >= 5) {
                state.spaCharge = 0;
                renderCmdStrip();
                setTimeout(() => {
                  chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                  chatMsg('super', `★★★ SAILOR PLANET ATTACK!!! ★★★`);
                  chatMsg('super', `The Inner Senshi unleash a massive blast of cosmic power!`);
                  chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                  const aliveEnemies = state.fighters.filter(f =>
                    !f.isPlayer && !f.isDead && (state.currentMode === 'team' ? f.isEnemy : true));
                  aliveEnemies.forEach(enemy => {
                    const dmg = Math.round((attacker.magStr * 300) / (0.01 * (enemy.magDef + 50)));
                    enemy.currentHP = Math.max(0, enemy.currentHP - dmg);
                    enemy.isDead = enemy.currentHP <= 0;
                    chatMsg('super', `  → ${enemy.scrName} takes ${dmg} DMG from the cosmic blast!!`);
                    if (enemy.isDead) chatMsg('death', `  ☠ ${enemy.scrName} has been DEFEATED!`);
                    updateCard(enemy);
                    flashCard(enemy.idx, 'hit');
                  });
                  checkBattleEnd();
                }, 2000);
              }
            });
          }, 1500);
        }
      }

      if (state.spaCharge >= 5 && !attacker.isPlayer) {
        // Non-player triggered the 5th charge (solo mode)
        state.spaCharge = 0;
        renderCmdStrip();
        setTimeout(() => {
          chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          chatMsg('super', `★★★ SAILOR PLANET ATTACK!!! ★★★`);
          chatMsg('super', `The Sailor Senshi unleash a massive blast of cosmic power!`);
          chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          const aliveEnemies = state.fighters.filter(f =>
            !f.isPlayer && !f.isDead && (state.currentMode === 'team' ? f.isEnemy : true));
          aliveEnemies.forEach(enemy => {
            const dmg = Math.round((attacker.magStr * 300) / (0.01 * (enemy.magDef + 50)));
            enemy.currentHP = Math.max(0, enemy.currentHP - dmg);
            enemy.isDead = enemy.currentHP <= 0;
            chatMsg('super', `  → ${enemy.scrName} takes ${dmg} DMG from the cosmic blast!!`);
            if (enemy.isDead) chatMsg('death', `  ☠ ${enemy.scrName} has been DEFEATED!`);
            updateCard(enemy);
            flashCard(enemy.idx, 'hit');
          });
          checkBattleEnd();
        }, 5000);
      } else if (state.spaCharge >= 5) {
        // Player triggered 5th charge without allies (free mode or no senshi alive)
        state.spaCharge = 0;
        renderCmdStrip();
        setTimeout(() => {
          chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          chatMsg('super', `★★★ SAILOR PLANET ATTACK!!! ★★★`);
          chatMsg('super', `The Sailor Senshi unleash a massive blast of cosmic power!`);
          chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          const aliveEnemies = state.fighters.filter(f =>
            !f.isPlayer && !f.isDead && (state.currentMode === 'team' ? f.isEnemy : true));
          aliveEnemies.forEach(enemy => {
            const dmg = Math.round((attacker.magStr * 300) / (0.01 * (enemy.magDef + 50)));
            enemy.currentHP = Math.max(0, enemy.currentHP - dmg);
            enemy.isDead = enemy.currentHP <= 0;
            chatMsg('super', `  → ${enemy.scrName} takes ${dmg} DMG from the cosmic blast!!`);
            if (enemy.isDead) chatMsg('death', `  ☠ ${enemy.scrName} has been DEFEATED!`);
            updateCard(enemy);
            flashCard(enemy.idx, 'hit');
          });
          checkBattleEnd();
        }, 5000);
      }
    }
    // ── HEAL ──
    else if (move.type === 'heal') {
      const delay = move.restDelay || 5000;
      const t = move.target === 'self' ? attacker : (targetFighter || attacker);
      chatMsg('heal', `  → ${prefix}${parse(move.pre, attacker, t)}`);
      setInputDisabled(true);
      setTimeout(() => {
        const healAmt = calcHeal(attacker, move, superLevel);
        t.currentHP = Math.min(t.maxHP, t.currentHP + healAmt);
        attacker.currentSP = Math.min(attacker.maxSP, attacker.currentSP + 80);
        chatMsg('heal', `  → ${parse(move.hit, attacker, t, healAmt)}`);
        updateCard(t);
        updateCard(attacker);
        flashCard(t.idx, 'heal');
        setInputDisabled(false);
      }, delay);
    }
    // ── OFFENSIVE ──
    else {
      if (!targetFighter || targetFighter.isDead) {
        chatMsg('info', `  → No valid target!`);
      } else {
        const miss = Math.random() * 100 >= (move.hitRate || 90);
        if (miss) {
          chatMsg('info', `  → ${prefix}${parse(move.miss, attacker, targetFighter)}`);
        } else {
          const dmg = calcDamage(attacker, targetFighter, move, superLevel);
          targetFighter.currentHP = Math.max(0, targetFighter.currentHP - dmg);
          targetFighter.isDead = targetFighter.currentHP <= 0;

          const tag = superLevel > 0 ? 'super' : 'damage';
          chatMsg(tag, `  → ${prefix}${parse(move.hit, attacker, targetFighter, dmg)} [${dmg} DMG]`);

          // SP gains
          attacker.currentSP     = Math.min(attacker.maxSP, attacker.currentSP + Math.round(dmg * 0.15));
          targetFighter.currentSP = Math.min(targetFighter.maxSP, targetFighter.currentSP + Math.round(dmg * 0.08));
          attacker.cheese = (attacker.cheese || 0) + dmg;

          // Critical hit
          if (Math.random() < 0.08) chatMsg('super', `  ★ CRITICAL HIT on ${targetFighter.scrName}!`);

          // Status effects
          applyMoveStatus(move, targetFighter, chatMsg);

          // MP drain moves — burns all remaining MP after firing
          if (move.drainMP) {
            attacker.currentMP = 0;
            chatMsg('status', `  ✦ ${attacker.scrName}'s MP is completely burned out!!`);
            updateCard(attacker);
          }

          // Half MP drain moves
          if (move.drainMPHalf) {
            attacker.currentMP = Math.floor(attacker.currentMP * 0.50);
            chatMsg('status', `  ✦ ${attacker.scrName}'s MP is halved from the exertion!!`);
            updateCard(attacker);
          }

          if (targetFighter.isDead) {
            chatMsg('death', `  ☠ ${targetFighter.scrName} has been DEFEATED!`);
            chatMsg('death', `    (${attacker.scrName} delivered the killing blow with ${move.name}!)`);
          }

          updateCard(targetFighter);
          flashCard(targetFighter.idx, 'hit');
        }
      }
    }

    // Clean up attacker state
    attacker.isBlocking = false;
    attacker.currentAction = '';
    updateCard(attacker);

    // Reset super level
    state.superLevel = 0;
    setSuperPips(0);

    renderTargetSelect();
    if (attacker.isPlayer) setInputDisabled(false);

    checkBattleEnd();
    state.round++;
  }, 5000);
}

// ── AI TICK ───────────────────────────────────
export function aiTick() {
  if (state.battleOver || state.paused) return;

  const aliveAIs = state.fighters.filter(f => !f.isPlayer && !f.isDead);
  if (!aliveAIs.length) return;

  const ai = aliveAIs[Math.floor(Math.random() * aliveAIs.length)];

  // Skip if stopped
  if (ai.statuses.stop) {
    delete ai.statuses.stop;
    chatMsg('status', `  ✦ ${ai.scrName} is held in place and loses their turn!`);
    updateCard(ai);
    return;
  }

  if (ai.statuses.sleep) {
    chatMsg('status', `  ✦ ${ai.scrName} is fast asleep and cannot attack!`);
    if (Math.random() < 0.25) { delete ai.statuses.sleep; updateCard(ai); }
    return;
  }

  tickStatuses(ai, chatMsg);
  updateCard(ai);

  const { chosenMoveIdx, target } = aiChooseAction(ai);

  if (chosenMoveIdx < 0 || !target) {
    const restHP = Math.round(ai.maxHP * 0.12);
    const restMP = Math.round(ai.maxMP * 0.12);
    chatMsg('ai', parse(ai.rest, ai, null));
    chatMsg('ai', `  → ${ai.scrName} recovers ${restHP} HP and ${restMP} MP.`);
    ai.currentHP = Math.min(ai.maxHP, ai.currentHP + restHP);
    ai.currentMP = Math.min(ai.maxMP, ai.currentMP + restMP);
    updateCard(ai);
  } else {
    applyMove(ai, target, chosenMoveIdx, 0);
  }
}

// ── ARENA TICK ────────────────────────────────
export function arenaTick() {
  if (state.battleOver || state.paused || !state.arena) return;

  if (state.arena.effect?.mpRegen) {
    const regen = state.arena.effect.mpRegen;
    state.fighters.filter(f => !f.isDead).forEach(f => {
      f.currentMP = Math.min(f.maxMP, f.currentMP + regen);
      updateCard(f);
    });
    chatMsg('arena', `✦ The calm of ${state.arena.name} restores ${regen} MP to all fighters.`);
  }

  // HP drain — Galaxia's Throne Room star seed effect
  if (state.arena.effect?.hpDrain) {
    const drain = state.arena.effect.hpDrain;
    state.fighters.filter(f => !f.isDead).forEach(f => {
      f.currentHP = Math.max(1, f.currentHP - drain);
      updateCard(f);
    });
    chatMsg('arena', `✦ The star seeds in Galaxia's Throne Room pulse — all fighters lose ${drain} HP.`);
    checkBattleEnd();
  }

  const events = state.arena.happening || [];
  events.forEach(ev => {
    if (Math.random() > ev.chance) return;
    const alive = state.fighters.filter(f => !f.isDead);
    if (!alive.length) return;
    const target = alive[Math.floor(Math.random() * alive.length)];

    if (ev.skipTurn) {
      target.statuses.stop = true;
      const dmg = ev.dmg > 0 ? ev.dmg + Math.round(Math.random() * 10) : 0;
      if (dmg > 0) target.currentHP = Math.max(0, target.currentHP - dmg);
      if (ev.statusEffect && Math.random() < (ev.statusChance || 0.5)) {
        target.statuses[ev.statusEffect] = true;
        chatMsg('status', `  ✦ ${target.scrName} is afflicted with ${ev.statusEffect.toUpperCase()}!`);
      }
      chatMsg('arena', parse(ev.msg, target, target) + (dmg > 0 ? ` [${dmg} DMG]` : ''));
      chatMsg('status', `  ✦ ${target.scrName} loses their next turn!`);
      flashCard(target.idx, 'hit');
    } else {
      const dmg = ev.dmg > 0 ? ev.dmg + Math.round(Math.random() * 20) : 0;
      if (dmg > 0) {
        target.currentHP = Math.max(0, target.currentHP - dmg);
        flashCard(target.idx, 'hit');
      }
      if (ev.statusEffect && Math.random() < (ev.statusChance || 0.5)) {
        target.statuses[ev.statusEffect] = true;
        chatMsg('status', `  ✦ ${target.scrName} is afflicted with ${ev.statusEffect.toUpperCase()}!`);
      }
      chatMsg('arena', parse(ev.msg, null, target) + (dmg > 0 ? ` [${dmg} DMG]` : ''));
    }
    updateCard(target);
    checkBattleEnd();
  });
}

// ── BATTLE END ────────────────────────────────
export function checkBattleEnd() {
  const result = getBattleResult();
  if (!result) return;

  state.battleOver = true;
  clearInterval(window._aiLoopId);
  clearInterval(window._arenaLoopId);
  clearTimeout(window._itemTimerId);

  chatMsg('separator', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (result === 'defeat') {
    const boss = state.fighters.find(f => !f.isPlayer && !f.isDead);
    if (boss) {
      chatMsg('death', `${boss.scrName}: ${parse(boss.fatality || '%SN defeats %T.', boss, state.player)}`);
    }
    chatMsg('death', `GAME OVER — ${state.player.scrName} has been defeated!`);
  } else {
    chatMsg('win', `VICTORY!! ${state.player.scrName} wins the battle!`);
    if (state.currentMode === 'team') {
      const aliveAllies = state.fighters.filter(f => f.isAlly && !f.isDead);
      chatMsg('win', `The team emerges victorious! ${aliveAllies.length} allies remain standing.`);
    }
  }
  chatMsg('separator', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  setTimeout(() => {
    const overlay = document.getElementById('gameover-overlay');
    const title   = document.getElementById('gameover-title');
    const sub     = document.getElementById('gameover-sub');
    if (overlay) {
      title.textContent = result === 'victory' ? '★ VICTORY ★'  : '✕ DEFEATED ✕';
      sub.textContent   = result === 'victory' ? 'You won the battle!' : 'You have been defeated!';
      overlay.classList.add('show');
    }
  }, 1000);
}
