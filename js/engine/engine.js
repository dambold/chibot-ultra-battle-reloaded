// ══════════════════════════════════════════════
//   CHIBOT ULTRA BATTLE — engine.js
//   Pure game logic — no DOM dependencies
// ══════════════════════════════════════════════

import { ITEMS } from '../data/items.js';
import { VILLAIN_SERIES } from '../data/pools.js';

// ── STATE ─────────────────────────────────────
export let state = {
  player: null,
  fighters: [],
  arena: null,
  round: 0,
  battleOver: false,
  superLevel: 0,
  paused: false,
  currentItem: null,
  spaCharge: 0,
  currentMode: 'free',
};

export let aiLoopId = null;
export let arenaLoopId = null;
export let itemTimerId = null;

export function resetState() {
  state = {
    player: null, fighters: [], arena: null, round: 0,
    battleOver: false, superLevel: 0, paused: false,
    currentItem: null, spaCharge: 0, currentMode: 'free',
  };
}

// ── FIGHTER FACTORY ───────────────────────────
export function makeFighter(char, scrName, isPlayer, idx) {
  return {
    ...JSON.parse(JSON.stringify(char)),
    scrName, isPlayer, idx,
    currentHP: char.hp, maxHP: char.hp,
    currentMP: char.mp, maxMP: char.mp,
    currentSP: 0, maxSP: 1000,
    statuses: {}, cheese: 0,
    isBlocking: false, isDead: false,
    currentAction: '',
    isAlly: false, isEnemy: false,
    isBoss: false, bossMult: 1,
  };
}

// ── PARSE ─────────────────────────────────────
export function parse(template, fighter, target, dmg) {
  return (template || '')
    .replace(/%SN/g, fighter ? fighter.scrName : '')
    .replace(/%T/g,  target  ? target.scrName  : '')
    .replace(/%DMG/g, dmg !== undefined ? dmg : '');
}

// ── DAMAGE / HEAL ─────────────────────────────
export function calcDamage(attacker, defender, move, superLevel = 0) {
  const isPhys = move.type === 'phys';
  const atk = isPhys ? attacker.physStr : attacker.magStr;
  const def = isPhys ? defender.physDef  : defender.magDef;
  const base = (move.str * atk / 45) / (0.01 * (def + 50));
  const variance = base * 0.1 * (Math.random() * 2 - 1);
  let dmg = Math.max(1, Math.round(base + variance));
  if (superLevel > 0) dmg = Math.round(dmg * (1 + superLevel * 0.5));
  if (defender.isBlocking)        dmg = Math.round(dmg * 0.5);
  if (defender.statuses?.barrier) dmg = Math.round(dmg * 0.5);
  if (attacker._atkMult)          dmg = Math.round(dmg * attacker._atkMult);
  return dmg;
}

export function calcHeal(attacker, move, superLevel = 0) {
  let amt = Math.round(move.str * (0.9 + Math.random() * 0.2));
  if (superLevel > 0) amt = Math.round(amt * (1 + superLevel * 0.3));
  return amt;
}

// ── STATUS EFFECTS ────────────────────────────
export function applyMoveStatus(move, target, onMsg) {
  if (move.statusEffect && Math.random() < (move.statusChance || 0.3)) {
    if (!target.statuses[move.statusEffect]) {
      target.statuses[move.statusEffect] = true;
      onMsg('status', `  ✦ ${target.scrName} is afflicted with ${move.statusEffect.toUpperCase()}!`);
    }
    return;
  }
  if (move.type === 'magic' && !move.statusEffect && Math.random() < 0.15) {
    const pool = ['slow','blind','mute','chaos'];
    const s = pool[Math.floor(Math.random() * pool.length)];
    if (!target.statuses[s]) {
      target.statuses[s] = true;
      onMsg('status', `  ✦ ${target.scrName} is afflicted with ${s.toUpperCase()}!`);
    }
  }
}

export function tickStatuses(fighter, onMsg) {
  if (fighter.statuses.poison) {
    const dmg = Math.round(fighter.maxHP * 0.03);
    fighter.currentHP = Math.max(1, fighter.currentHP - dmg);
    onMsg('status', `  ✦ ${fighter.scrName} is poisoned! [${dmg} DMG]`);
  }
  if (fighter.statuses.regen) {
    const heal = Math.round(fighter.maxHP * 0.04);
    fighter.currentHP = Math.min(fighter.maxHP, fighter.currentHP + heal);
  }
  Object.keys(fighter.statuses).forEach(s => {
    if (fighter.statuses[s] && Math.random() < 0.12) delete fighter.statuses[s];
  });
}

// ── AI BEHAVIOR ───────────────────────────────
export function aiChooseAction(ai) {
  ai.currentMP = Math.min(ai.maxMP, ai.currentMP + Math.round(ai.maxMP * 0.04));

  let attackTargets = [];
  if (state.currentMode === 'team') {
    if (ai.isAlly)        attackTargets = state.fighters.filter(f => f.isEnemy && !f.isDead);
    else if (ai.isEnemy)  attackTargets = state.fighters.filter(f => (f.isPlayer || f.isAlly) && !f.isDead);
    else                  attackTargets = state.fighters.filter(f => f.isPlayer && !f.isDead);
  } else {
    attackTargets = state.fighters.filter(f => f.isPlayer && !f.isDead);
  }

  const hpPct = ai.currentHP / ai.maxHP;
  let chosenMoveIdx = -1, target = null;

  if (hpPct < 0.3) {
    const hi = ai.moves.findIndex(m => m.type === 'heal');
    if (hi >= 0 && ai.currentMP >= ai.moves[hi].mpCost) { chosenMoveIdx = hi; target = ai; }
  }

  if (chosenMoveIdx < 0 && attackTargets.length > 0) {
    target = attackTargets[Math.floor(Math.random() * attackTargets.length)];
    const viable = ai.moves
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.type !== 'heal' && !m.isScan && !m.isBarrier && !m.isSPA && ai.currentMP >= m.mpCost);
    if (viable.length > 0) {
      const useSuper = ai.currentSP >= 200 && Math.random() < 0.3;
      const supers  = viable.filter(({ m }) =>  m.isSuper);
      const normals = viable.filter(({ m }) => !m.isSuper);
      if (useSuper && supers.length)  chosenMoveIdx = supers[Math.floor(Math.random()*supers.length)].i;
      else if (normals.length)        chosenMoveIdx = normals[Math.floor(Math.random()*normals.length)].i;
      else                            chosenMoveIdx = viable[0].i;
    }
  }
  return { chosenMoveIdx, target };
}

// ── ITEM APPLICATION ──────────────────────────
export function applyItemEffect(item, player, onMsg) {
  const e = item.effect || {};
  const updates = {};

  if (e.hp) {
    if (e.hp === 9999) {
      updates.currentHP = player.maxHP;
      onMsg('item', `  → ${player.scrName} is fully restored!!`);
    } else if (e.hp > 0) {
      updates.currentHP = Math.min(player.maxHP, player.currentHP + e.hp);
      onMsg('item', `  → ${player.scrName} gained ${e.hp} HP!`);
    } else {
      const loss = Math.min(player.currentHP - 1, Math.abs(e.hp));
      updates.currentHP = Math.max(1, player.currentHP - loss);
      onMsg('item', `  → ${player.scrName} lost ${loss} HP!`);
    }
  }
  if (e.mp) {
    updates.currentMP = e.mp > 0
      ? Math.min(player.maxMP, player.currentMP + e.mp)
      : Math.max(0, player.currentMP + e.mp);
    onMsg('item', `  → ${player.scrName} ${e.mp > 0 ? 'gained' : 'lost'} ${Math.abs(e.mp)} MP!`);
  }
  if (e.status) {
    updates.statuses = { ...player.statuses, [e.status]: true };
    onMsg('status', `  ✦ ${player.scrName} is now affected by ${e.status.toUpperCase()}!`);
  }
  if (e.atkUp && !e.atkMult) {
    updates.physStr = Math.round(player.physStr * 1.15);
    updates.magStr  = Math.round(player.magStr  * 1.15);
    onMsg('item', `  → ${player.scrName}'s attack power increased!`);
  }
  if (e.atkMult) {
    updates._atkMult = e.atkMult;
    onMsg('item', `  → ${player.scrName}'s attacks are ×${e.atkMult} for the next hit!!`);
  }
  return updates;
}

// ── RANDOM ITEM DROP ──────────────────────────
export function pickRandomItem() {
  return ITEMS[Math.floor(Math.random() * ITEMS.length)];
}

// ── BATTLE END CHECK ──────────────────────────
export function getBattleResult() {
  const player = state.fighters.find(f => f.isPlayer);
  if (!player) return null;
  const aliveEnemies = state.currentMode === 'team'
    ? state.fighters.filter(f => f.isEnemy && !f.isDead)
    : state.fighters.filter(f => !f.isPlayer && !f.isDead);
  if (player.isDead)            return 'defeat';
  if (aliveEnemies.length === 0) return 'victory';
  return null;
}
