/*
 * LA CLOCHE — audio
 * Everything is synthesized live with the Web Audio API: no audio files, no third-party music.
 * Nothing is created or played until the visitor presses a button (browser autoplay policy).
 *
 *   AniseAudio.enable({ music, sfx })   call from a click handler
 *   AniseAudio.setMusic(bool) / setSfx(bool) / setVolume(0..1)
 *   AniseAudio.play(name)               click | menu | paper | section | dessert | gallery | form | door | close
 */
(function () {
  'use strict';

  const AC = window.AudioContext || window.webkitAudioContext;
  const STORE = 'anise-audio';

  let ctx = null, master, comp, musicBus, sfxBus, verb, verbSend;
  let musicOn = false, sfxOn = false, volume = 0.6;
  let timer = null, nextBar = 0, bar = 0, lastNote = 79;
  let voices = 0;
  const lastPlayed = Object.create(null);
  const listeners = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
    if (typeof saved.volume === 'number') volume = Math.min(1, Math.max(0, saved.volume));
  } catch (e) { /* storage blocked: defaults */ }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ volume })); } catch (e) { /* ignore */ }
  }
  function emit() { listeners.forEach((fn) => fn({ musicOn, sfxOn, volume, supported: !!AC })); }

  /* ---------- graph ---------- */
  function impulse(seconds, decay) {
    const rate = ctx.sampleRate, len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function ensure() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 18; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.3;
      master = ctx.createGain(); master.gain.value = volume * volume;
      musicBus = ctx.createGain(); musicBus.gain.value = 0;
      sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55;
      verb = ctx.createConvolver(); verb.buffer = impulse(3.2, 2.6);
      verbSend = ctx.createGain(); verbSend.gain.value = 0.32;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7200;
      musicBus.connect(lp); sfxBus.connect(lp);
      musicBus.connect(verbSend); sfxBus.connect(verbSend);
      verbSend.connect(verb); verb.connect(lp);
      lp.connect(comp); comp.connect(master); master.connect(ctx.destination);
      document.addEventListener('visibilitychange', () => {
        if (!ctx) return;
        if (document.hidden) ctx.suspend();
        else if (musicOn || sfxOn) ctx.resume();
      });
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  /* ---------- instruments ---------- */
  // soft felt piano: a few partials, a filter that darkens as the note decays
  function piano(t, midi, vel, dest) {
    const f = mtof(midi);
    const len = 2.2 + (84 - midi) * 0.05;
    const out = ctx.createGain();
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.4;
    lp.frequency.setValueAtTime(Math.min(5200, f * 7), t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(380, f * 1.6), t + len * 0.7);
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(vel, t + 0.012);
    out.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.4);
    out.gain.exponentialRampToValueAtTime(0.0001, t + len);
    [[1, 1, 'triangle'], [2, 0.28, 'sine'], [3, 0.08, 'sine'], [4.01, 0.04, 'sine']].forEach(([h, g, type], i) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.value = f * h; o.detune.value = (i % 2 ? 3 : -2);
      const og = ctx.createGain(); og.gain.value = g;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + len + 0.05);
    });
    lp.connect(out); out.connect(dest);
  }

  // music box: bright, short, slightly inharmonic tine
  function musicBox(t, midi, vel, dest) {
    const f = mtof(midi);
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(vel, t + 0.004);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    [[1, 1], [2.0, 0.18], [5.43, 0.05], [8.8, 0.02]].forEach(([h, g]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f * h;
      const og = ctx.createGain(); og.gain.value = g;
      o.connect(og); og.connect(out); o.start(t); o.stop(t + 1.7);
    });
    out.connect(dest);
  }

  // small bell (cloche): inharmonic partials with long decay
  function bell(t, f, vel, dest, len) {
    len = len || 2.4;
    [[1, 1, 1], [2.0, 0.5, 0.8], [2.76, 0.35, 0.6], [5.4, 0.16, 0.35], [8.93, 0.06, 0.2]].forEach(([h, g, d]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f * h;
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(vel * g, t + 0.003);
      og.gain.exponentialRampToValueAtTime(0.0001, t + len * d);
      o.connect(og); og.connect(dest); o.start(t); o.stop(t + len * d + 0.05);
    });
  }

  // warm pad: detuned triangles through a low filter, slow swell
  function pad(t, midis, dur, dest) {
    const out = ctx.createGain();
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.3;
    out.gain.setValueAtTime(0.0001, t);
    out.gain.linearRampToValueAtTime(0.028, t + dur * 0.35);
    out.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    midis.forEach((m) => {
      [-6, 6].forEach((det) => {
        const o = ctx.createOscillator(); o.type = 'triangle';
        o.frequency.value = mtof(m); o.detune.value = det;
        o.connect(lp); o.start(t); o.stop(t + dur + 0.7);
      });
    });
    lp.connect(out); out.connect(dest);
  }

  function noiseBuffer() {
    if (noiseBuffer.buf) return noiseBuffer.buf;
    const len = ctx.sampleRate;
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuffer.buf = b;
    return b;
  }
  function noise(t, dur, type, freq, q, peak, dest, attack) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer();
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + (attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
    return f;
  }

  /* ---------- background music (generative, calm, loops seamlessly) ---------- */
  const BPM = 64, BEAT = 60 / BPM, BAR = BEAT * 4;
  // F major colour: Fmaj9 · Dm9 · B♭maj7 · Csus · Am7 · Dm7 · Gm9 · C7sus4
  const PROG = [
    { bass: 41, chord: [57, 60, 64, 67] },
    { bass: 38, chord: [53, 57, 60, 64] },
    { bass: 34, chord: [57, 62, 65, 69] },
    { bass: 36, chord: [55, 57, 62, 64] },
    { bass: 33, chord: [55, 60, 64, 67] },
    { bass: 38, chord: [53, 57, 60, 65] },
    { bass: 31, chord: [53, 58, 62, 69] },
    { bass: 36, chord: [58, 60, 65, 67] }
  ];
  const SCALE = [65, 67, 69, 72, 74, 76, 77, 79, 81, 84, 86]; // F pentatonic-ish, upper register

  function scheduleBar(t, n) {
    const step = PROG[n % PROG.length];
    const phrase = Math.floor(n / PROG.length);
    // bass + rolled chord on beat 1
    piano(t, step.bass + 12, 0.11, musicBus);
    step.chord.forEach((m, i) => piano(t + 0.05 + i * 0.07, m, 0.05, musicBus));
    // light re-voicing on beat 3
    if (n % 2 === 1 || Math.random() < 0.4) {
      piano(t + BEAT * 2, step.chord[1], 0.035, musicBus);
      piano(t + BEAT * 2 + 0.08, step.chord[3], 0.03, musicBus);
    }
    pad(t, step.chord.slice(0, 3).map((m) => m - 12), BAR, musicBus);

    // music-box melody: sparse, stepwise, from chord tones + scale
    const density = phrase % 2 ? 0.55 : 0.38;
    for (let e = 0; e < 8; e++) {
      if (e === 0 && n % 8 === 0) continue;
      if (Math.random() > density * (e % 2 ? 0.6 : 1)) continue;
      const pool = SCALE.filter((m) => Math.abs(m - lastNote) <= 5);
      let note = pool[Math.floor(Math.random() * pool.length)] || 77;
      const tones = step.chord.map((m) => m + 12);
      if (e % 2 === 0 && Math.random() < 0.6) {
        note = tones.reduce((a, b) => (Math.abs(b - lastNote) < Math.abs(a - lastNote) ? b : a));
      }
      lastNote = note;
      musicBox(t + e * (BEAT / 2) + (Math.random() * 0.02), note, 0.05 + Math.random() * 0.02, musicBus);
    }
    // the shop bell, softly, at the top of every other phrase
    if (n % 16 === 0) bell(t + 0.02, mtof(84), 0.03, musicBus, 3.2);
  }

  function tick() {
    if (!ctx || !musicOn) return;
    while (nextBar < ctx.currentTime + 1.2) {
      scheduleBar(nextBar, bar);
      nextBar += BAR; bar += 1;
    }
  }

  function startMusic() {
    if (!ensure()) return;
    const now = ctx.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setValueAtTime(musicBus.gain.value, now);
    musicBus.gain.linearRampToValueAtTime(0.9, now + 2.5);
    if (!timer) {
      nextBar = now + 0.15; bar = 0;
      timer = setInterval(tick, 250);
      tick();
    }
  }
  function stopMusic() {
    if (!ctx) return;
    const now = ctx.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setValueAtTime(musicBus.gain.value, now);
    musicBus.gain.linearRampToValueAtTime(0, now + 0.35);
    clearInterval(timer); timer = null;
  }

  /* ---------- sound effects ---------- */
  const SFX = {
    click(t, d) { // soft tick
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.05);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.09);
      noise(t, 0.03, 'highpass', 4000, 0.7, 0.025, d);
      return 0.1;
    },
    menu(t, d) { // glass
      [[2093, 0.05], [3136, 0.035], [4699, 0.012]].forEach(([f, v], i) => bell(t + i * 0.012, f, v, d, 1.2));
      return 1.3;
    },
    paper(t, d) { // envelope / paper rustle
      for (let i = 0; i < 5; i++) {
        noise(t + i * 0.055 + Math.random() * 0.02, 0.08 + Math.random() * 0.05, 'bandpass', 2200 + Math.random() * 2600, 0.9, 0.05, d, 0.012);
      }
      noise(t, 0.35, 'lowpass', 900, 0.5, 0.03, d, 0.05);
      return 0.45;
    },
    section(t, d) { bell(t, 1318.5, 0.05, d, 1.4); return 1.4; },
    dessert(t, d) { // soft, pillowy touch
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(150, t + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.25);
      noise(t, 0.12, 'lowpass', 700, 0.5, 0.04, d, 0.01);
      bell(t + 0.08, 2637, 0.012, d, 0.8);
      return 0.3;
    },
    gallery(t, d) { // airy shimmer
      noise(t, 0.5, 'bandpass', 6500, 1.4, 0.022, d, 0.14);
      [1568, 2349].forEach((f, i) => bell(t + 0.06 + i * 0.07, f, 0.014, d, 1));
      return 0.6;
    },
    form(t, d) { // two-note chime
      musicBox(t, 76, 0.07, d); musicBox(t + 0.11, 81, 0.06, d);
      return 0.8;
    },
    door(t, d) { // shop-door bell: a couple of jingles
      bell(t, 1760, 0.06, d, 1.8); bell(t + 0.13, 1975.5, 0.045, d, 1.6); bell(t + 0.3, 1760, 0.03, d, 1.4);
      return 1.8;
    },
    close(t, d) {
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(420, t + 0.08);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g); g.connect(d); o.start(t); o.stop(t + 0.14);
      return 0.15;
    }
  };
  const GAP = { click: 0.05, menu: 0.2, paper: 0.25, section: 0.35, dessert: 0.12, gallery: 0.3, form: 0.25, door: 0.6, close: 0.08 };

  function play(name) {
    if (!sfxOn || !ctx || !SFX[name] || document.hidden) return;
    if (ctx.state !== 'running') ctx.resume();
    const now = ctx.currentTime;
    if (lastPlayed[name] && now - lastPlayed[name] < (GAP[name] || 0.08)) return;
    if (voices >= 6) return;
    lastPlayed[name] = now;
    voices += 1;
    const len = SFX[name](now + 0.005, sfxBus);
    setTimeout(() => { voices = Math.max(0, voices - 1); }, (len + 0.1) * 1000);
  }

  /* ---------- public API ---------- */
  window.AniseAudio = {
    supported: !!AC,
    get state() { return { musicOn, sfxOn, volume, supported: !!AC }; },
    onChange(fn) { listeners.add(fn); fn(this.state); },
    enable(opts) {
      if (!ensure()) { emit(); return; }
      if (opts.sfx != null) sfxOn = !!opts.sfx;
      if (opts.music != null) { musicOn = !!opts.music; musicOn ? startMusic() : stopMusic(); }
      emit();
    },
    setMusic(on) { this.enable({ music: on }); },
    setSfx(on) { this.enable({ sfx: on }); },
    setVolume(v) {
      volume = Math.min(1, Math.max(0, v));
      if (ctx) master.gain.setTargetAtTime(volume * volume, ctx.currentTime, 0.05);
      save(); emit();
    },
    play
  };
})();
