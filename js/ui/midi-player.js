// ══════════════════════════════════════════════
//   CHIBOT ULTRA BATTLE — midi-player.js
//   Retro Winamp-style MIDI player widget
//   Uses MidiPlayerJS + Soundfont via CDN
// ══════════════════════════════════════════════

const PLAYLIST = [
  { title: 'Pokemon Battle',          file: 'audio/pokebattle.mid' },
  { title: 'Pokemon Orchestra',       file: 'audio/pokeorch.mid' },
  { title: 'FFT Battle 1',            file: 'audio/FFTBATT1.MID' },
  { title: 'FFT Battle 3',            file: 'audio/FFTBATT3.MID' },
  { title: 'FFT Battle 4',            file: 'audio/FFTBATT4.MID' },
  { title: 'FFT Battle 7',            file: 'audio/FFTBATT7.MID' },
  { title: 'FFT Battle 8',            file: 'audio/FFTBATT8.MID' },
  { title: 'FFT Battle 9',            file: 'audio/FFTBATT9.MID' },
  { title: 'Lavos Theme',             file: 'audio/LAVOS2.MID' },
  { title: 'Lavos (Alt)',             file: 'audio/ctlavos2.mid' },
  { title: 'Magus Theme',             file: 'audio/ctmagus.mid' },
  { title: 'CT Boss 2',               file: 'audio/Ctboss2.mid' },
  { title: 'RPG Fight',               file: 'audio/RPGFIGH2.MID' },
  { title: 'RPG Boss',                file: 'audio/rpgboss2.mid' },
  { title: 'Big Boss',                file: 'audio/bigboss.mid' },
  { title: 'Smithy Battle',           file: 'audio/Smithyb2.mid' },
  { title: 'Magitek',                 file: 'audio/magitek.mid' },
  { title: 'Casino',                  file: 'audio/casino.mid' },
  { title: 'Rainbow Road',            file: 'audio/Rainbow_Road_Theme_(Extended_Version).mid' },
  { title: 'Beat It',                 file: 'audio/beatit.mid' },
  { title: 'Another One Bites Dust',  file: 'audio/Another_One_Bites_The_Dust.mid' },
  { title: 'Disco Inferno',           file: 'audio/disco_infernal.mid' },
  { title: 'Macarena',                file: 'audio/MACACHOC.mid' },
];

let player = null;
let audioContext = null;
let isPlaying = false;
let currentIdx = -1;
let instrument = null;
let libsLoaded = false;

function pickRandom() {
  return Math.floor(Math.random() * PLAYLIST.length);
}

function getVolume() {
  const vol = document.getElementById('midi-volume');
  return vol ? parseFloat(vol.value) : 0.7;
}

function updateDisplay(title) {
  const el = document.getElementById('midi-track-name');
  if (el) el.textContent = title;
}

function updateButtons() {
  const play  = document.getElementById('midi-play-btn');
  const pause = document.getElementById('midi-pause-btn');
  if (play)  play.style.display  = isPlaying ? 'none' : '';
  if (pause) pause.style.display = isPlaying ? '' : 'none';
}

async function loadLibs() {
  if (libsLoaded) return true;
  try {
    // Load MidiPlayerJS
    await loadScript('https://cdn.jsdelivr.net/npm/midi-player-js@2.0.16/browser/midiplayer.min.js');
    // Load Soundfont-player
    await loadScript('https://cdn.jsdelivr.net/npm/soundfont-player@0.12.0/dist/soundfont-player.min.js');
    libsLoaded = true;
    return true;
  } catch(e) {
    updateDisplay('⚠ MIDI libs unavailable');
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function playMidi(idx) {
  currentIdx = idx;
  const track = PLAYLIST[idx];
  updateDisplay('Loading: ' + track.title);

  const ok = await loadLibs();
  if (!ok) return;

  // Stop existing player
  if (player) { try { player.stop(); } catch(e){} }

  try {
    // Create AudioContext on user gesture
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') await audioContext.resume();

    // Load soundfont instrument
    if (!instrument) {
      updateDisplay('Loading soundfont...');
      instrument = await Soundfont.instrument(audioContext, 'acoustic_grand_piano', {
        soundfont: 'MusyngKite'
      });
    }

    // Fetch and play MIDI
    const response = await fetch(track.file);
    const arrayBuffer = await response.arrayBuffer();

    player = new MidiPlayer.Player((event) => {
      if (instrument && event.name === 'Note on' && event.velocity > 0) {
        instrument.play(event.noteName, audioContext.currentTime, {
          gain: getVolume() * (event.velocity / 127)
        });
      }
    });

    player.on('endOfFile', () => {
      isPlaying = false;
      updateButtons();
      // Auto advance
      setTimeout(() => {
        if (isPlaying === false) {
          playMidi(pickRandom());
        }
      }, 500);
    });

    player.loadArrayBuffer(arrayBuffer);
    player.play();
    isPlaying = true;
    updateDisplay(track.title);
    updateButtons();

  } catch(e) {
    console.warn('MIDI playback error:', e);
    updateDisplay('⚠ ' + track.title);
    isPlaying = false;
    updateButtons();
  }
}

function pauseMidi() {
  if (player) {
    try {
      if (isPlaying) { player.pause(); isPlaying = false; }
      else { player.play(); isPlaying = true; }
    } catch(e) {}
  }
  updateButtons();
}

// ── PUBLIC API ────────────────────────────────
export function initMidiPlayer() {
  const playBtn   = document.getElementById('midi-play-btn');
  const pauseBtn  = document.getElementById('midi-pause-btn');
  const nextBtn   = document.getElementById('midi-next-btn');
  const volSlider = document.getElementById('midi-volume');

  if (!playBtn) return;

  playBtn.onclick = () => {
    playMidi(currentIdx < 0 ? pickRandom() : currentIdx);
  };

  pauseBtn.onclick = () => pauseMidi();

  nextBtn.onclick = () => {
    playMidi(pickRandom());
  };

  volSlider?.addEventListener('input', () => {
    // Volume is applied per-note via getVolume()
  });

  updateButtons();
  updateDisplay('— press play —');
}

export function stopMidi() {
  if (player) {
    try { player.stop(); } catch(e) {}
    player = null;
  }
  isPlaying = false;
  updateButtons();
  updateDisplay('— press play —');
}
