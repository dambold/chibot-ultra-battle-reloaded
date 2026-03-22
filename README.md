# ⚡ ChiBot Ultra Battle ⚡
### AOL Chat Room Battle Engine — RELOADED

```
  ██████╗██╗  ██╗██╗██████╗  ██████╗ ████████╗
 ██╔════╝██║  ██║██║██╔══██╗██╔═══██╗╚══██╔══╝
 ██║     ███████║██║██████╔╝██║   ██║   ██║   
 ██║     ██╔══██║██║██╔══██╗██║   ██║   ██║   
 ╚██████╗██║  ██║██║██████╔╝╚██████╔╝   ██║   
  ╚═════╝╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝   ╚═╝   
        U L T R A   B A T T L E
```

> *It's the year 1999. You're on AOL Instant Messenger. Someone just typed `/scream` and Banshee dealt 219 damage to Barney the Dinosaur. This is peak human achievement.*

---

## 🕹️ What Is This?

ChiBot Ultra Battle is a recreation of an original AOL chat room battle bot — built in Visual Basic 6 sometime in the late 90s — where you typed slash commands to fight other users with anime and pop culture characters.

The original bot lived in AOL chat rooms and ran on someone's family computer. It had Sailor Moon characters, a handful of Dragon Ball Z fighters, and the kind of unhinged energy that only exists when you're 14 years old on a 56k modem at midnight.

This is that bot. Rebuilt from scratch. With 150+ characters, 23 arenas, a Winamp-style MIDI player, and Boss Mode.

---

## 🌟 Features

- **150+ playable characters** across Sailor Moon, Dragon Ball Z, X-Men, Final Fantasy VII, Pokémon, Star Wars, Star Trek TNG, Zelda 64, Mario RPG, Tenchi Muyo, and more
- **23 arenas** including Blockbuster Video, The Rave, Casa Bonita, Galaxia's Throne Room, and the Danger Room — each with 90s Easter egg hazards
- **Free Battle, Team Battle, and Boss Mode** (2x / 3x / 5x / 8x HP)
- **Winamp-style MIDI player** with 23 tracks including Lavos Theme, Magus Theme, Rainbow Road, and the Macarena
- **Status effects** — STOP, CHAOS, BLIND, MUTE, POISON
- **Special mechanics** — Silver Crystal Sacrifice, Coordinated Sailor Planet Attack, Star Seed Convergence, Banshee's permanent MP cap, Obi-Wan becoming more powerful than you can possibly imagine
- **90s Easter eggs** everywhere — Tamagotchis, Furbies, JNCO jeans, dial-up modems, $47 in Blockbuster late fees

---

## 🎮 How to Play

### Running Locally

You need a local web server because ES modules won't load from `file://`. Python makes this easy:

```bash
cd chibot-ultra-battle
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`

### Battle Commands

```
/help          — show all available commands
/scream        — use a move (replace with any move command)
/block         — block incoming attack
/rest          — quick rest to recover
/taunt         — taunt your opponent
/flee          — attempt to flee
/scan          — scan your target
/get           — pick up an item
/super1-3      — power up a move
```

Type `/help` in battle to see your character's full move list.

---

## 📼 The Roster

| Series | Characters |
|--------|-----------|
| **Sailor Moon** | Eternal Sailor Moon, Inner Senshi, Outer Senshi, Starlights, Sailor V, Chibi-Moon, Tuxedo Kamen |
| **Dragon Ball Z** | Goku, Vegeta, Gohan, Trunks, Piccolo, Krillin, Yamcha, Tien, Cell, Freeza, Broly, Gogeta, Raditz, Majin Buu |
| **X-Men** | Wolverine, Storm, Cyclops, Jean Grey, Beast, Iceman, Angel, Gambit, Psylocke, Jubilee, Banshee, Havok, Polaris, Mystique |
| **Pokémon** | Pikachu, Charizard, Blastoise, Venusaur, Mewtwo, Mew, Eevee + all Gen 1/2 evolutions, Rattata, Arbok, Raichu, Nidoking, Pidgeot, and more |
| **Final Fantasy VII** | Cloud, Tifa, Aeris, Safer•Sephiroth |
| **Star Wars** | Luke, Leia, Han, Chewie, Obi-Wan, Yoda, Darth Vader, Emperor Palpatine |
| **Star Trek TNG** | Picard, Riker, Data, Worf, Troi, Crusher, Geordi, Wesley |
| **Zelda 64** | Link, Zelda, Ganondorf, Sheik |
| **Mario RPG** | Mario, Bowser, Geno, Smithy |
| **Marvel vs Capcom** | Ryu, Venom, Morrigan |
| **Tenchi Muyo** | Tenchi, Ryoko, Ayeka |
| **Villains** | Sailor Galaxia, Queen Nehelenia, Zirconia, the Animamates, Black Moon Clan, Sailor Youma, Queen Beryl, and more |
| **90s Chaos** | Barney the Dinosaur, Tickle Me Elmo, Carrot Top, Dennis Rodman, Jerry Springer, Ross Perot, and more |
| **Original Characters** | Miv, Manini, Niko (from the original AOL bot crew) |

---

## 🏟️ The Arenas

Every arena has location-specific hazards and **90s Easter egg events** that fire mid-battle.

Notable arenas include:

- **Blockbuster Video** — every copy of Space Jam is gone. You owe $47 in late fees.
- **The Rave** — fog machines, JNCO jeans, and no escape from the Macarena
- **Casa Bonita** — cliff divers, fake volcano, sopapillas to the face
- **Galaxia's Throne Room** — passive HP drain every tick. Your star seed belongs to her.
- **The Danger Room** — passive stat boost. Wolverine left his adamantium claws on the floor again.
- **Central Perk** — Ross explains something. Joey takes your food.
- **Suncoast Video** — a dubbed vs subbed argument you cannot escape
- **Cassidy's Barn** — a Furby activates in the dark. The mutual screaming is paralyzing.

---

## 🎵 The Soundtrack

Winamp-style MIDI player with 23 tracks. Press play and fight.

Playlist includes Final Fantasy Tactics battle themes, Chrono Trigger (Lavos, Magus), Rainbow Road, Beat It, Another One Bites the Dust, Disco Inferno, and the Macarena.

---

## 🖥️ Tech

- Vanilla JavaScript (ES Modules)
- No framework, no build step
- Multi-file architecture: characters, arenas, items, engine, UI all separated
- MIDI playback via MidiPlayerJS + Soundfont-player
- Runs on any local web server or GitHub Pages

---

## 📡 Origin Story

Somewhere around 1998-1999, a teenager built a battle bot in Visual Basic 6 that lived in AOL chat rooms. You'd type `/moon` and Sailor Moon would fire the Moon Spiral Heart Attack. You'd type `/kamehameha` and Goku would obliterate whoever had the misfortune of being in the room.

The original `.ch2` character files still exist. This project reads from them.

ChiBot Ultra Battle is a love letter to that era — to AOL chat rooms, to 56k modems, to Sailor Moon fansites, to renting anime on VHS from Suncoast Video, and to the specific kind of chaos that only happened online in the late 90s.

---

## 🔗 Links

- **Live Game:** [dambold.github.io/chibot-ultra-battle](https://dambold.github.io/chibot-ultra-battle)
- **Portfolio:** [michaeldambold.com](https://michaeldambold.com)

---

*◈ ChiBot Ultra Battle — AOL Chat Room Battle Engine — RELOADED ◈*
