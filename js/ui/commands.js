// ══════════════════════════════════════════════
//   CHIBOT ULTRA BATTLE — ui/commands.js
//   Player command parsing & execution
// ══════════════════════════════════════════════

import { state, parse, applyItemEffect } from '../engine/engine.js';
import {
  chatMsg, applyMove, renderTargetSelect, renderCmdStrip,
  getSelectedTarget, setSuperPips, updateCard, setInputDisabled, checkBattleEnd,
} from './battle.js';

export function handleChatInput() {
  const inp = document.getElementById('chat-input');
  const raw = inp.value.trim();
  if (!raw || state.battleOver) return;
  inp.value = '';

  const lower = raw.toLowerCase().replace(/^\//, '');
  const p = state.player;
  if (!p) return;

  // Status checks
  if (p.statuses.stop) {
    chatMsg('status', `${p.scrName} is stopped and cannot act!`);
    delete p.statuses.stop;
    updateCard(p);
    return;
  }
  if (p.statuses.sleep) {
    chatMsg('status', `${p.scrName} is asleep! zzzz...`);
    if (Math.random() < 0.3) { delete p.statuses.sleep; updateCard(p); chatMsg('status', `${p.scrName} woke up!`); }
    return;
  }
  if (p.statuses.mute && lower !== 'rest' && lower !== 'block' && lower !== 'flee' && lower !== 'help') {
    chatMsg('status', `${p.scrName} is muted and cannot use moves!`);
    return;
  }

  // System commands
  if (lower === 'rest')  { doRest();  return; }
  if (lower === 'block') { doBlock(); return; }
  if (lower === 'flee')  { doFlee();  return; }
  if (lower === 'taunt') { doTaunt(); return; }
  if (lower === 'get')   { doGetItem(); return; }
  if (lower === 'help')  { doHelp();  return; }
  if (lower === 'scan')  { doScan();  return; }

  // Super level prefix: /super1 /super2 /super3
  const superMatch = lower.match(/^super(\d)/);
  if (superMatch) {
    const n = Math.min(3, Math.max(1, parseInt(superMatch[1])));
    state.superLevel = n;
    setSuperPips(n);
    chatMsg('system', `Super level set to ${n}. Now use a move command.`);
    return;
  }

  // Move commands
  const moveIdx = p.moves.findIndex(mv => mv.cmd.toLowerCase() === lower);
  if (moveIdx >= 0) {
    doMove(moveIdx);
    return;
  }

  chatMsg('system', `Unknown command: /${lower}. Type /help for a list of commands.`);
}

export function doMove(moveIdx) {
  const p = state.player;
  const move = p?.moves[moveIdx];
  if (!move) return;

  // ── SACRIFICE MOVE ──────────────────────────
  // ── STAR SEED CONVERGENCE ───────────────────
  if (move.isSSC) {
    const SSC_IDS = ['miv', 'manini', 'niko', 'venus'];
    const SSC_LINES = {
      miv:    'My star seed burns across every dimension I\'ve ever crossed!!',
      manini: 'Don\'t get used to this. My star seed and I are doing this exactly once!!',
      niko:   'Star seed engaged!! Also I added a laser. You\'re welcome!!',
      venus:  'Love and star seeds unite — this is for everyone we\'re protecting!!',
    };

    // Check all four are alive on the team
    const sscMembers = state.fighters.filter(f =>
      SSC_IDS.includes(f.id) && !f.isDead && (f.isPlayer || f.isAlly)
    );
    const allPresent = SSC_IDS.every(id => sscMembers.find(f => f.id === id));

    if (!allPresent) {
      const missing = SSC_IDS.filter(id => !sscMembers.find(f => f.id === id && !f.isDead));
      chatMsg('status', `  ✦ The Star Seed Convergence requires all four. ${missing.join(', ')} is missing or has fallen.`);
      return;
    }

    // 10% HP cost hits ALL four members
    chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    chatMsg('super', `★ STAR SEED CONVERGENCE ★`);
    sscMembers.forEach(member => {
      const cost = Math.max(1, Math.round(member.maxHP * 0.10));
      member.currentHP = Math.max(1, member.currentHP - cost);
      const line = SSC_LINES[member.id] || 'My star seed answers the call!!';
      chatMsg('super', `  ✦ ${member.scrName}: "${line}"`);
      chatMsg('status', `  ✦ ${member.scrName} pays the price: [-${cost} HP]`);
      updateCard(member);
    });

    // Damage scales off combined current MP of all four
    const combinedMP = sscMembers.reduce((sum, f) => sum + f.currentMP, 0);
    const baseDmg = Math.round(combinedMP * 2.2);
    const variance = Math.round(baseDmg * 0.1 * (Math.random() * 2 - 1));
    const dmg = Math.max(1, baseDmg + variance);
    const hits = Math.random() * 100 < move.hitRate;

    setInputDisabled(true);
    setTimeout(() => {
      const target = getSelectedTarget();
      if (!hits || !target) {
        chatMsg('damage', `  → ${move.miss}`);
        chatMsg('status', `  ✦ The star seed energy fades. The price was paid for nothing.`);
      } else {
        chatMsg('super', `  → ${parse(move.hit, p, target, dmg)}`);
        chatMsg('super', `  → Combined star seed power: ${dmg} DMG!! [${combinedMP} combined MP]`);
        target.currentHP = Math.max(0, target.currentHP - dmg);
        target.isDead = target.currentHP <= 0;
        updateCard(target);
        flashCard(target.idx, 'hit');
        if (target.isDead) chatMsg('death', `  ☠ ${target.scrName} has been DEFEATED by the Star Seed Convergence!!`);
      }
      chatMsg('super', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      setInputDisabled(false);
      checkBattleEnd();
      state.round++;
    }, 6000);
    return;
  }

  if (move.isSacrifice) {
    const target = getSelectedTarget();
    if (!target) { chatMsg('system', 'No valid target selected!'); return; }

    // Damage scales off current HP + MP — the more you sacrifice the harder it hits
    const sacrificePool = p.currentHP + p.currentMP;
    const baseDmg = Math.round(sacrificePool * 1.8);
    const variance = Math.round(baseDmg * 0.1 * (Math.random() * 2 - 1));
    const dmg = Math.max(1, baseDmg + variance);
    const instantKill = Math.random() < 0.40;
    const hits = Math.random() * 100 < move.hitRate;

    chatMsg('player', `${p.scrName}: ${move.pre.replace(/%SN/g, p.scrName).replace(/%T/g, target.scrName)}`);

    // Player immediately drops to 1 HP and 0 MP regardless of outcome
    p.currentHP = 1;
    p.currentMP = 0;
    updateCard(p);

    setInputDisabled(true);

    setTimeout(() => {
      if (!hits) {
        chatMsg('damage', `  → ${move.miss.replace(/%SN/g, p.scrName).replace(/%T/g, target.scrName)}`);
        chatMsg('status', `  ✦ ${p.scrName} is left at 1 HP and 0 MP — completely spent.`);
      } else if (instantKill) {
        chatMsg('super', `  → ★ THE SILVER CRYSTAL RESPONDS!! INSTANT KILL!!`);
        chatMsg('super', `  → ${move.hit.replace(/%SN/g, p.scrName).replace(/%T/g, target.scrName)}`);
        target.currentHP = 0;
        target.isDead = true;
        chatMsg('death', `  ☠ ${target.scrName} has been DESTROYED by the Silver Crystal!!`);
        updateCard(target);
        flashCard(target.idx, 'hit');
      } else {
        chatMsg('super', `  → ${move.hit.replace(/%SN/g, p.scrName).replace(/%T/g, target.scrName)}`);
        chatMsg('super', `  → The sacrifice dealt ${dmg} DMG!! [Sacrificed ${sacrificePool} HP+MP]`);
        target.currentHP = Math.max(0, target.currentHP - dmg);
        target.isDead = target.currentHP <= 0;
        updateCard(target);
        flashCard(target.idx, 'hit');
        if (target.isDead) {
          chatMsg('death', `  ☠ ${target.scrName} has been DEFEATED by the Silver Crystal sacrifice!!`);
        }
      }

      chatMsg('status', `  ✦ ${p.scrName} is at 1 HP. Everything was given.`);
      updateCard(p);
      setInputDisabled(false);
      checkBattleEnd();
      state.round++;
    }, 5000);
    return;
  }

  // ── BANSHEE SAVE SUPER ──────────────────────
  if (move.isBansheeSuper) {
    const target = getSelectedTarget();
    if (!target) { chatMsg('system', 'No valid target selected!'); return; }

    // 20% HP cost regardless of outcome
    const selfDmg = Math.round(p.maxHP * 0.20);
    p.currentHP = Math.max(1, p.currentHP - selfDmg);
    chatMsg('super', `  ✦ ${p.scrName} burns his voice past every limit!! [-${selfDmg} HP]`);
    updateCard(p);

    setInputDisabled(true);
    chatMsg('super', `  ✦ ${parse(move.pre, p, target)}`);

    setTimeout(() => {
      const hits = Math.random() * 100 < move.hitRate;
      const dmg = Math.round((p.magStr * move.str) / 100);

      // MP cap applies regardless of hit or miss — voice is damaged
      p.maxMP = Math.round(p.maxMP * 0.50);
      p.currentMP = Math.min(p.currentMP, p.maxMP);
      chatMsg('status', `  ✦ ${p.scrName}'s voice is damaged — MP permanently capped at 50%!!`);
      updateCard(p);

      if (!hits) {
        chatMsg('damage', `  → ${parse(move.miss, p, target)}`);
      } else {
        chatMsg('super', `  → ${parse(move.hit, p, target)}`);
        chatMsg('super', `  → Save dealt ${dmg} DMG!!`);
        target.currentHP = Math.max(0, target.currentHP - dmg);
        target.isDead = target.currentHP <= 0;
        updateCard(target);
        flashCard(target.idx, 'hit');
        if (target.isDead) chatMsg('death', `  ☠ ${target.scrName} has been DEFEATED!!`);
      }

      setInputDisabled(false);
      checkBattleEnd();
      state.round++;
    }, 6000);
    return;
  }

  // ── FORBIDDEN TABOO MOVES ───────────────────
  if (move.isForbidden) {
    const selfDmg = Math.round(p.maxHP * (move.selfDmgPct || 0.15));
    p.currentHP = Math.max(1, p.currentHP - selfDmg);
    chatMsg('status', `  ✦ The forbidden taboo exacts its toll on ${p.scrName}!! [-${selfDmg} HP]`);
    updateCard(p);
    checkBattleEnd();
    if (state.battleOver) return;
  }

  // ── SELF-DAMAGE MOVES (non-forbidden) ───────
  if (move.selfDmgPct && !move.isForbidden && !move.isSacrifice && !move.isBansheeSuper) {
    const selfDmg = Math.round(p.maxHP * move.selfDmgPct);
    p.currentHP = Math.max(1, p.currentHP - selfDmg);
    chatMsg('status', `  ✦ ${p.scrName} pays the price — [-${selfDmg} HP]`);
    updateCard(p);
    checkBattleEnd();
    if (state.battleOver) return;
  }

  if (p.currentMP < move.mpCost) {
    chatMsg('system', `${p.scrName}: Not enough MP! (need ${move.mpCost}, have ${p.currentMP})`);
    return;
  }

  const target = getSelectedTarget();
  const actualTarget = (move.target === 'self' || move.isBarrier) ? p : target;

  if (!actualTarget && move.target !== 'self' && !move.isBarrier && !move.isSPA && !move.isScan) {
    chatMsg('system', 'No valid target selected!');
    return;
  }

  applyMove(p, actualTarget, moveIdx, state.superLevel);
}

export function doRest() {
  const p = state.player;
  if (state.battleOver) return;
  const restHP = Math.round(p.maxHP * (0.15 + Math.random() * 0.10));
  const restMP = Math.round(p.maxMP * (0.15 + Math.random() * 0.10));
  p.currentHP = Math.min(p.maxHP, p.currentHP + restHP);
  p.currentMP = Math.min(p.maxMP, p.currentMP + restMP);
  chatMsg('heal', parse(p.rest, p, null));
  chatMsg('heal', `  → ${p.scrName} recovers ${restHP} HP and ${restMP} MP.`);
  updateCard(p);
  state.round++;
}

export function doBlock() {
  const p = state.player;
  if (state.battleOver) return;
  p.isBlocking = true;
  p.currentAction = '🛡 Blocking...';
  chatMsg('info', `${p.scrName} takes a defensive stance. [Half damage on next hit]`);
  updateCard(p);
  state.round++;
}

export function doFlee() {
  const p = state.player;
  if (state.battleOver) return;
  if (Math.random() < 0.4) {
    chatMsg('info', `${p.scrName} tried to flee but couldn't escape!`);
  } else {
    chatMsg('system', `${p.scrName} fled from the battle! Coward!!`);
    state.battleOver = true;
    clearInterval(window._aiLoopId);
    clearInterval(window._arenaLoopId);
    setTimeout(() => {
      const overlay = document.getElementById('gameover-overlay');
      const title   = document.getElementById('gameover-title');
      const sub     = document.getElementById('gameover-sub');
      if (overlay) {
        title.textContent = '✕ FLED ✕';
        sub.textContent   = 'You ran away!';
        overlay.classList.add('show');
      }
    }, 500);
  }
  state.round++;
}

export function doTaunt() {
  const p = state.player;
  if (state.battleOver) return;
  const taunts = p.taunt || ['...'];
  const t = taunts[Math.floor(Math.random() * taunts.length)];
  chatMsg('player', `${p.scrName}: "${t}"`);
  p.currentSP = Math.min(p.maxSP, p.currentSP + 50);
  updateCard(p);
  state.round++;
}

export function doGetItem() {
  const p = state.player;
  if (!state.currentItem) {
    chatMsg('info', 'There is no item on the field right now!');
    return;
  }
  const item = state.currentItem;
  state.currentItem = null;
  const msg = (item.get || '').replace(/%SN/g, p.scrName);
  chatMsg('item', `✦ ${msg}`);
  const updates = applyItemEffect(item, p, chatMsg);
  Object.assign(p, updates);
  updateCard(p);
  checkBattleEnd();
}

export function doScan() {
  const target = getSelectedTarget();
  if (!target) { chatMsg('info', 'No target selected to scan!'); return; }
  const sl = Object.keys(target.statuses || {}).filter(s => target.statuses[s]);
  chatMsg('system', `━━ SCAN: ${target.scrName} (${target.name}) ━━━━━━━━━━━`);
  chatMsg('info',   `  HP: ${target.currentHP} / ${target.maxHP}`);
  chatMsg('info',   `  MP: ${target.currentMP} / ${target.maxMP}`);
  chatMsg('info',   `  SP: ${target.currentSP} / ${target.maxSP}`);
  chatMsg('info',   `  Statuses: ${sl.length ? sl.join(', ').toUpperCase() : 'None'}`);
  chatMsg('system', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

export function doHelp() {
  chatMsg('system', '━━ COMMANDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  chatMsg('info',   '  /[cmd]    — use a move (see chips below)');
  chatMsg('info',   '  /scan     — scan target stats');
  chatMsg('info',   '  /rest     — recover HP and MP');
  chatMsg('info',   '  /block    — halve incoming damage');
  chatMsg('info',   '  /taunt    — taunt enemies, gain SP');
  chatMsg('info',   '  /flee     — attempt to escape');
  chatMsg('info',   '  /get      — grab an item from the field');
  chatMsg('info',   '  /super1-3 — set super power level for next move');
  chatMsg('system', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
