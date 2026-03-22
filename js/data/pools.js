// ── CHARACTER POOLS ───────────────────────────
import { CHARACTERS } from './characters.js';
import { CHARACTERS_EXTENDED } from './characters-extended.js';

export const ALL_CHARACTERS = [...CHARACTERS, ...CHARACTERS_EXTENDED];

export const VILLAIN_SERIES = ['Villain','BlackMoon','Galactica','Youma','90sChaos','StarWars_Villain'];
export const HERO_SERIES    = ['SMEB','OC','XFiles','TenchiMuyo','DBZ','Pokemon','FF7','MvC','XMen','Zelda64','SMRPG','TNG','StarWars'];

export function heroChars()    { return ALL_CHARACTERS.filter(c => HERO_SERIES.includes(c.series)); }
export function villainChars() { return ALL_CHARACTERS.filter(c => VILLAIN_SERIES.includes(c.series)); }
export function playerChars()  { return ALL_CHARACTERS.filter(c => HERO_SERIES.includes(c.series)); }
