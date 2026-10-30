/*
 * LA CLOCHE — Anise character showcase
 * Renders the official character data (character-data.js) and artwork list (media-data.js)
 * into the page, and runs the gate, navigation, form switch, tabs, letters, pâtisserie,
 * scent particles, gallery/lightbox and audio controls.
 * This file never changes character text: it only places strings from ANISE_CHARACTER.
 */
(function () {
  'use strict';

  const C = window.ANISE_CHARACTER;
  const M = window.ANISE_MEDIA;
  const Audio = window.AniseAudio;
  const root = document.documentElement;
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceMQ.matches;

  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  function h(tag, attrs, kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'html') el.innerHTML = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    (kids || []).forEach((c) => { if (c != null) el.append(c); });
    return el;
  }

  const announcer = $('[data-announcer]');
  function announce(msg) { announcer.textContent = ''; setTimeout(() => { announcer.textContent = msg; }, 30); }

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  const sfx = (name) => Audio && Audio.play(name);

  /* =========================================================
     RENDER OFFICIAL DATA
     ========================================================= */
  $$('[data-bind]').forEach((el) => { el.textContent = C[el.dataset.bind]; });

  // Profile carte (order = source order)
  const profileList = $('[data-profile-list]');
  C.profile.forEach((row) => {
    profileList.append(h('div', { class: 'carte__row' + (row.wide ? ' carte__row--wide' : '') }, [
      h('dt', null, [h('b', { text: row.label }), h('small', { lang: 'en', text: row.en })]),
      h('span', { class: 'dots', 'aria-hidden': 'true' }),
      h('dd', { text: row.value })
    ]));
  });

  // Names & identity
  const namesList = $('[data-names-list]');
  C.names.forEach((n, i) => {
    const feature = i === C.names.length - 1;
    namesList.append(h('div', { class: 'names__item' + (feature ? ' names__item--feature' : '') }, [
      h('dt', { text: n.label }),
      h('dd', { lang: n.lang || null, text: n.value })
    ]));
  });

  // Palette
  function swatches(list, target) {
    list.forEach((c) => {
      target.append(h('li', { class: 'swatch' }, [
        h('span', { class: 'swatch__chip', style: 'background:' + c.hex }),
        h('span', { class: 'swatch__name', lang: 'en', text: c.name }),
        h('span', { class: 'swatch__hex', text: c.hex })
      ]));
    });
  }
  swatches(C.palette.main, $('[data-palette-main]'));
  swatches(C.palette.extra, $('[data-palette-extra]'));

  // Furry-only fields (null = not received yet)
  const furryList = $('[data-furry-list]');
  C.furry.forEach((f) => {
    furryList.append(h('div', null, [
      h('dt', { lang: 'en', text: f.label }),
      f.value ? h('dd', { text: f.value }) : h('dd', { class: 'is-empty', 'aria-label': 'ยังไม่ได้รับข้อมูล', text: '—' })
    ]));
  });

  // Story (background) — two paragraphs, verbatim, with drawn ornaments beside them
  const ART_CANELE = '<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#i-canele"/></svg>';
  const ART_LOTUS = '<svg viewBox="0 0 64 48" aria-hidden="true"><use href="#i-lotus"/></svg>';
  const story = $('[data-story]');
  C.background.forEach((para, i) => {
    story.append(h('section', { class: 'chapter reveal' }, [
      h('div', null, [
        h('span', { class: 'chapter__num', lang: 'fr', 'aria-hidden': 'true', text: 'Chapitre ' + (i === 0 ? 'I' : 'II') }),
        h('p', { class: 'chapter__text', text: para })
      ]),
      h('div', { class: 'chapter__art' + (i ? ' chapter__art--lotus' : ''), html: i ? ART_LOTUS : ART_CANELE })
    ]));
  });

  // Personality
  const traits = $('[data-personality]');
  C.personality.forEach((p) => traits.append(h('li', null, [h('p', { text: p })])));

  // Abilities as sealed letters
  const letters = $('[data-abilities]');
  C.abilities.forEach((a, i) => {
    const id = 'letter-' + i;
    letters.append(h('div', { class: 'letter' }, [
      h('button', { class: 'letter__env', type: 'button', 'aria-expanded': 'false', 'aria-controls': id, 'data-sfx': 'paper' }, [
        h('span', { class: 'letter__pocket', 'aria-hidden': 'true' }),
        h('span', { class: 'letter__flap', 'aria-hidden': 'true' }),
        h('span', { class: 'letter__seal', 'aria-hidden': 'true', html: '<svg viewBox="0 0 64 64"><use href="#i-bell"/></svg>' }),
        h('span', { class: 'letter__label' }, [h('small', { text: 'ความสามารถ ' + (i + 1) }), document.createTextNode(a.title)])
      ]),
      h('div', { class: 'letter__paper', id }, [
        h('h4', null, [h('em', { lang: 'fr', 'aria-hidden': 'true', text: (i + 1) + '.' }), document.createTextNode(a.title)]),
        h('p', { text: a.text })
      ])
    ]));
  });
  letters.addEventListener('click', (e) => {
    const btn = e.target.closest('.letter__env');
    if (!btn) return;
    const letter = btn.parentElement;
    const open = !letter.classList.contains('is-open');
    letter.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // Voice
  $('[data-voice]').textContent = C.voice;

  // Likes / dislikes
  const likes = $('[data-likes]');
  C.likes.forEach((l) => likes.append(h('li', { text: l })));
  $('[data-likes-tail]').textContent = C.likesTail;
  const dislikes = $('[data-dislikes]');
  C.dislikes.forEach((l) => dislikes.append(h('li', { text: l })));

  // Credits
  function creditRows(list, target) {
    list.forEach((c) => {
      const dd = h('dd');
      if (c.href) dd.append(h('a', { href: c.href, target: '_blank', rel: 'noopener noreferrer', text: c.value }));
      else dd.textContent = c.value;
      target.append(h('div', null, [h('dt', { text: c.label }), dd]));
    });
  }
  creditRows(C.credits.original, $('[data-credits-original]'));
  creditRows(C.credits.furry, $('[data-credits-furry]'));
  $('[data-credit-site]').textContent = C.credits.website;
  const usage = $('[data-usage]');
  C.credits.usage.forEach((u) => usage.append(h('li', { lang: 'en', text: u })));

  const CREDIT_LINE = {
    original: C.credits.original.slice(0, 2).map((c) => c.label + ': ' + c.value).join(' · '),
    furry: C.credits.furry.map((c) => c.label + ': ' + c.value).join(' · '),
    palette: 'ภาพพาเลทสีประจำตัว · Original Form'
  };

  /* =========================================================
     FORM SWITCH (Original / Furry)
     ========================================================= */
  let form = store.get('anise-form') === 'furry' ? 'furry' : 'original';
  const switches = [];

  function buildSwitch(slot) {
    const compact = slot.dataset.formSwitchSlot === 'nav';
    const group = h('div', { class: 'form-switch' + (compact ? ' form-switch--compact' : ''), role: 'radiogroup', 'aria-label': 'เลือกรูปแบบตัวละคร' }, [
      h('span', { class: 'form-switch__thumb', 'aria-hidden': 'true' })
    ]);
    [['original', 'Forme I', 'Original'], ['furry', 'Forme II', 'Furry']].forEach(([key, fr, label]) => {
      group.append(h('button', { class: 'form-switch__opt', type: 'button', role: 'radio', 'data-form-opt': key, 'data-sfx': 'form' }, [
        h('em', { lang: 'fr', text: fr }), h('span', { lang: 'en', text: label })
      ]));
    });
    group.addEventListener('click', (e) => {
      const opt = e.target.closest('[data-form-opt]');
      if (opt) setForm(opt.dataset.formOpt, true);
    });
    group.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const next = form === 'original' ? 'furry' : 'original';
      setForm(next, true);
      sfx('form');
      $('[data-form-opt="' + next + '"]', group).focus();
    });
    slot.append(group);
    switches.push(group);
  }
  $$('[data-form-switch-slot]').forEach(buildSwitch);

  function swapImg(img, src, alt, w, ht) {
    if (img.getAttribute('src') === src) return;
    const apply = () => {
      img.src = src; img.alt = alt;
      if (w) { img.width = w; img.height = ht; }
      const done = () => img.classList.remove('is-swapping');
      if (img.complete) requestAnimationFrame(done); else img.addEventListener('load', done, { once: true });
    };
    if (reduced()) { apply(); return; }
    img.classList.add('is-swapping');
    const pre = new Image();
    pre.src = src;
    const go = () => setTimeout(apply, 260);
    pre.decode ? pre.decode().then(go, go) : (pre.onload = go);
  }

  function setForm(next, user) {
    form = next === 'furry' ? 'furry' : 'original';
    const media = M[form];
    root.dataset.form = form;
    store.set('anise-form', form);
    switches.forEach((g) => $$('[data-form-opt]', g).forEach((b) => {
      const on = b.dataset.formOpt === form;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    }));
    $$('[data-form-badge]').forEach((b) => { b.textContent = media.label; });

    const heroImg = $('[data-hero-img]');
    heroImg.style.objectPosition = media.hero.focus;
    swapImg(heroImg, media.hero.src, media.hero.alt, media.hero.w, media.hero.h);
    swapImg($('[data-portrait-img]'), media.portrait.src, media.portrait.alt, media.portrait.w, media.portrait.h);
    $('[data-portrait-credit]').textContent = CREDIT_LINE[form];
    $('[data-furry-card]').hidden = form !== 'furry';

    renderGallery();
    if (user) announce('แสดง ' + media.label);
    if (window.AniseCursor) window.AniseCursor.refresh();
  }

  /* =========================================================
     GALLERY + LIGHTBOX
     ========================================================= */
  const galleryEl = $('[data-gallery]');
  function renderGallery() {
    const media = M[form];
    galleryEl.textContent = '';
    media.gallery.forEach((item, i) => {
      const wide = item.w > item.h * 1.2;
      galleryEl.append(h('li', { class: wide ? 'is-wide' : null }, [
        h('figure', { class: 'gcard' }, [
          h('button', { class: 'gcard__btn', type: 'button', 'data-cursor': 'gallery', 'data-sfx': 'gallery', 'data-lb-index': i, 'aria-label': 'ดูภาพขนาดใหญ่: ' + item.title + ' (' + media.label + ')' }, [
            h('span', { class: 'gcard__img' }, [
              h('img', { src: item.thumb || item.src, width: item.w, height: item.h, alt: 'Anise ' + media.label + ' — ' + item.title, loading: 'lazy', decoding: 'async' })
            ])
          ]),
          h('figcaption', null, [
            h('span', { class: 'gcard__title', lang: 'en', text: item.title }),
            h('span', { class: 'gcard__kind', text: item.kind }),
            h('span', { class: 'badge', text: media.label })
          ])
        ])
      ]));
    });
    $('[data-gallery-count]').textContent = media.label + ' · ' + media.gallery.length + ' ภาพ';
    const more = $('[data-gallery-more]');
    more.hidden = form !== 'furry';
    more.textContent = 'ภาพเต็มตัว ภาพ Chibi และภาพรายละเอียดของ Furry Form จะแสดงที่นี่เมื่อได้รับจากเจ้าของตัวละคร';
  }
  galleryEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lb-index]');
    if (btn) openLightbox(+btn.dataset.lbIndex, btn);
  });

  const lb = $('[data-lightbox]');
  const lbImg = $('[data-lb-img]');
  let lbIndex = 0, lbOpener = null;
  const outside = () => [$('.topbar'), $('#main'), $('.footer'), $('[data-audio-dock]')];

  function showArt(i) {
    const list = M[form].gallery;
    lbIndex = (i + list.length) % list.length;
    const item = list[lbIndex];
    lbImg.classList.add('is-loading');
    lbImg.onload = () => lbImg.classList.remove('is-loading');
    lbImg.src = item.src;
    lbImg.alt = 'Anise ' + M[form].label + ' — ' + item.title;
    lbImg.width = item.w; lbImg.height = item.h;
    $('[data-lb-title]').textContent = item.title;
    $('[data-lb-kind]').textContent = item.kind;
    $('[data-lb-badge]').textContent = M[form].label;
    $('[data-lb-credit]').textContent = CREDIT_LINE[item.credit] || '';
    $('[data-lb-full]').href = item.src;
    const single = list.length < 2;
    $('[data-lb-prev]').hidden = single;
    $('[data-lb-next]').hidden = single;
  }
  function openLightbox(i, opener) {
    lbOpener = opener || document.activeElement;
    showArt(i);
    lb.hidden = false;
    outside().forEach((el) => el && (el.inert = true));
    document.body.style.overflow = 'hidden';
    $('.lightbox__close', lb).focus();
    if (window.AniseCursor) window.AniseCursor.refresh();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    outside().forEach((el) => el && (el.inert = false));
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (lbOpener && lbOpener.focus) lbOpener.focus();
  }
  $$('[data-lb-close]', lb).forEach((b) => b.addEventListener('click', closeLightbox));
  $('.lightbox__close', lb).dataset.sfx = 'close';
  $('[data-lb-prev]').addEventListener('click', () => showArt(lbIndex - 1));
  $('[data-lb-next]').addEventListener('click', () => showArt(lbIndex + 1));
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showArt(lbIndex - 1);
    else if (e.key === 'ArrowRight') showArt(lbIndex + 1);
    else if (e.key === 'Tab') {
      const f = $$('button:not([hidden]), a[href]', lb);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  let swipeX = null;
  $('[data-lb-frame]').addEventListener('pointerdown', (e) => { swipeX = e.clientX; });
  $('[data-lb-frame]').addEventListener('pointerup', (e) => {
    if (swipeX == null) return;
    const dx = e.clientX - swipeX; swipeX = null;
    if (Math.abs(dx) > 50 && M[form].gallery.length > 1) showArt(lbIndex + (dx < 0 ? 1 : -1));
  });

  function openBySrc(src, opener) {
    const i = M[form].gallery.findIndex((g) => g.src === src);
    openLightbox(Math.max(0, i), opener);
  }
  const heroBtn = $('[data-open-hero]');
  heroBtn.dataset.sfx = 'gallery';
  heroBtn.addEventListener('click', () => openBySrc(M[form].hero.src, heroBtn));
  const portraitBtn = $('[data-open-portrait]');
  portraitBtn.dataset.sfx = 'gallery';
  portraitBtn.addEventListener('click', () => openBySrc(M[form].portrait.full, portraitBtn));

  /* =========================================================
     TABS (Caractère)
     ========================================================= */
  const tabs = $$('[role="tab"]', $('[data-tabs]'));
  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    if (window.AniseCursor) window.AniseCursor.refresh();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j == null) return;
      e.preventDefault();
      selectTab(tabs[j], true);
      sfx('click');
    });
  });

  /* =========================================================
     PÂTISSERIE — desserts tied to the character data
     ========================================================= */
  // a verbatim excerpt of an official sentence, marked with … where cut
  function excerpt(text, from, to) {
    const a = text.indexOf(from);
    const b = text.indexOf(to, a);
    if (a < 0 || b < 0) return text;
    const end = b + to.length;
    return (a > 0 ? '…' : '') + text.slice(a, end) + (end < text.length ? '…' : '');
  }
  const liked = (item) => (C.likes.includes(item) ? item : null);
  const profileValue = (label) => (C.profile.find((r) => r.label === label) || {}).value;
  let uid = 0;

  const ART = {
    canele() {
      const id = 'cl' + (uid++);
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <defs><clipPath id="${id}"><path d="M30 90c-2-16-1-34 6-50 8-6 40-6 48 0 7 16 8 34 6 50-8 5-52 5-60 0Z"/></clipPath></defs>
        <ellipse cx="60" cy="92" rx="34" ry="5" fill="#220a00" opacity=".16"/>
        <path d="M30 90c-2-16-1-34 6-50 8-6 40-6 48 0 7 16 8 34 6 50-8 5-52 5-60 0Z" fill="url(#g-canele)"/>
        <g fill="none" stroke="#1c0700" stroke-opacity=".5" stroke-width="1.4"><path d="M40 41c-3 15-4 32-3 50"/><path d="M50 39c-1.5 16-2 34-1.5 53"/><path d="M60 38.5v54"/><path d="M70 39c1.5 16 2 34 1.5 53"/><path d="M80 41c3 15 4 32 3 50"/></g>
        <g clip-path="url(#${id})"><rect class="shine" x="52" y="30" width="10" height="70" fill="#fff" opacity=".35" transform="skewX(-12)"/></g>
        <ellipse cx="60" cy="40" rx="24" ry="6.5" fill="#2a0e04"/><ellipse cx="60" cy="39" rx="13" ry="3.4" fill="#8a4420"/><ellipse cx="60" cy="38.6" rx="5" ry="1.4" fill="#2a0e04"/>
        <path d="M43 47c-2 12-2.5 26-2 40" stroke="#edc693" stroke-opacity=".7" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      </svg>`;
    },
    flan() {
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="88" rx="46" ry="7" fill="#fffaf2" stroke="#c99d60"/>
        <path d="M24 86c6 3 66 3 72 0-4-4-9-6-12-6H36c-3 0-8 2-12 6Z" fill="#8a3d12" opacity=".85"/>
        <path d="M34 82 40 46c8-4 32-4 40 0l6 36c-10 4-42 4-52 0Z" fill="#f3d39b"/>
        <path d="M37 64c10 3 36 3 46 0" stroke="#e5b56c" fill="none"/>
        <ellipse cx="60" cy="46" rx="20" ry="5" fill="#9a4614"/>
        <path d="M44 48c0 5 1 9 2 10 1-1 1-6 1-9ZM62 50c0 6 1 11 2 12 1-1 1-7 1-11ZM74 48c0 4 .5 7 1.5 8 1-1 1-5 1-7.5Z" fill="#9a4614"/>
        <path d="M42 52l-4 26" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    },
    crepe() {
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="88" rx="46" ry="7" fill="#fffaf2" stroke="#c99d60"/>
        <path d="M22 58 44 70v18L22 76Z" fill="#e9c38e"/>
        <path d="M44 70 100 56v18L44 88Z" fill="#f7e2c2"/>
        <g stroke="#e3b779" stroke-width="1"><path d="M44 73.5 100 59.5M44 77 100 63M44 80.5 100 66.5M44 84 100 70"/></g>
        <path d="M22 58 78 44l22 12-56 14Z" fill="#fdf0dc"/>
        <ellipse cx="62" cy="54" rx="9" ry="4" fill="#fff"/>
        <path d="M62 40c-6 0-9 5-7 10 2 4 5 6 7 7 2-1 5-3 7-7 2-5-1-10-7-10Z" fill="#c8505a"/>
        <g fill="#ffd4d9"><circle cx="59" cy="46" r=".8"/><circle cx="64" cy="45" r=".8"/><circle cx="61" cy="51" r=".8"/><circle cx="65" cy="50" r=".8"/></g>
        <path d="M57 41c2-3 8-3 10 0-2 1-3 1-5 0-2 1-3 1-5 0Z" fill="#597641"/>
        <path d="M30 70l-4-2" stroke="#fff" stroke-opacity=".6" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    },
    laddu() {
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="88" rx="46" ry="7" fill="#fffaf2" stroke="#c99d60"/>
        <circle cx="42" cy="70" r="16" fill="#e8a43a"/>
        <g fill="#f8cf78"><circle cx="35" cy="64" r="1.6"/><circle cx="44" cy="61" r="1.4"/><circle cx="50" cy="68" r="1.6"/><circle cx="38" cy="74" r="1.4"/><circle cx="46" cy="78" r="1.5"/><circle cx="31" cy="71" r="1.2"/><circle cx="52" cy="76" r="1.2"/></g>
        <circle cx="36" cy="63" r="3" fill="#fff" opacity=".35"/>
        <path d="M80 86c-14 0-20-8-18-16 2-9 12-16 18-32 6 16 16 23 18 32 2 8-4 16-18 16Z" fill="#f6e2c0"/>
        <g fill="none" stroke="#d9b98a" stroke-width="1.2"><path d="M80 40c-3 14-9 30-11 45"/><path d="M80 40c-1 15-2 31-2 46"/><path d="M80 40c2 15 4 31 5 46"/><path d="M80 40c4 14 10 30 12 43"/></g>
        <circle cx="80" cy="37" r="2" fill="#e09b05"/>
      </svg>`;
    },
    tea() {
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="88" rx="42" ry="6.5" fill="#fffaf2" stroke="#c99d60"/>
        <path class="steam" d="M52 44c-4-6 4-8 0-14M66 42c-4-6 4-8 0-14" stroke="#cfbeb6" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M88 60c11 0 12 13 0 15" fill="none" stroke="#c99d60" stroke-width="3"/>
        <path d="M32 56h56c0 18-12 30-28 30S32 74 32 56Z" fill="#fffaf2" stroke="#c99d60" stroke-width="1.2"/>
        <path d="M35 63h50" stroke="#e09b05" stroke-width=".8" opacity=".6"/>
        <ellipse cx="60" cy="56" rx="28" ry="5" fill="#d89a48"/>
        <g transform="translate(62 55.5)" fill="#ffd4d9"><ellipse rx="5" ry="2" transform="rotate(0)"/><ellipse rx="5" ry="2" transform="rotate(72)"/><ellipse rx="5" ry="2" transform="rotate(144)"/><ellipse rx="5" ry="2" transform="rotate(216)"/><ellipse rx="5" ry="2" transform="rotate(288)"/><circle r="1.6" fill="#e09b05"/></g>
      </svg>`;
    },
    honey() {
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="88" rx="44" ry="6.5" fill="#fffaf2" stroke="#c99d60"/>
        <path d="M76 44 100 20" stroke="#905e4f" stroke-width="3" stroke-linecap="round"/>
        <g fill="#c99d60"><ellipse cx="74" cy="47" rx="4" ry="6" transform="rotate(45 74 47)"/></g>
        <path d="M36 46h40v4c5 2 7 6 7 11v19c0 6-4 8-10 8H39c-6 0-10-2-10-8V61c0-5 2-9 7-11Z" fill="#fff" fill-opacity=".6" stroke="#c99d60"/>
        <path d="M30 64h52v16c0 6-4 7-9 7H39c-5 0-9-1-9-7Z" fill="#e09b05" opacity=".85"/>
        <path d="M33 40h46l-4 8H37Z" fill="#ffd4d9"/>
        <path d="M35 46h42" stroke="#56281c" stroke-width="1.6"/>
        <path d="M36 66v14" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    },
    box() {
      return `<svg viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="88" rx="40" ry="5" fill="#220a00" opacity=".12"/>
        <path d="M32 52h56v34H32Z" fill="#e6d8cf"/>
        <path d="M28 44h64v10H28Z" fill="#cfbeb6"/>
        <path d="M57 44h6v42h-6ZM32 66h56v5H32Z" fill="#56281c" opacity=".85"/>
        <path d="M60 44c-8-10-18-8-16-2 2 5 10 4 16 2Zm0 0c8-10 18-8 16-2-2 5-10 4-16 2Z" fill="#56281c"/>
        <text x="60" y="81" text-anchor="middle" font-family="Bodoni Moda, serif" font-style="italic" font-size="7" fill="#905e4f">La Cloche</text>
      </svg>`;
    }
  };

  const DESSERTS = [
    {
      id: 'canele', fr: 'Canelé', th: 'ขนมคานาเล่', art: 'canele',
      refs: () => [
        ['ความสามารถ · ' + C.abilities[0].title, C.abilities[0].text],
        ['ภูมิหลัง', excerpt(C.background[0], 'เธอช่วยงานพ่อแม่', 'จนเชี่ยวชาญ')],
        liked('ขนมคานาเล่') && ['สิ่งที่ชอบ', liked('ขนมคานาเล่')],
        ['กลิ่นกาย', C.scent.title]
      ]
    },
    {
      id: 'flan', fr: 'Crème Caramel', th: 'ครีมคาราเมล', art: 'flan',
      refs: () => [
        ['สีประจำตัว', profileValue('สีประจำตัว')],
        ['decor', 'ขนมชิ้นนี้เป็นแรงบันดาลใจทางภาพจากชื่อสีประจำตัวเท่านั้น ข้อมูลตัวละครไม่ได้ระบุว่าเป็นขนมที่ชอบ']
      ]
    },
    { id: 'crepe', fr: 'Crêpe froide aux fraises', th: 'เครปเย็นสตรอเบอร์รี่', art: 'crepe', refs: () => [liked('เครปเย็นสตรอเบอร์รี่') && ['สิ่งที่ชอบ', liked('เครปเย็นสตรอเบอร์รี่')]] },
    { id: 'laddu', fr: 'Laddu & Modak', th: 'ขนมลาดู-โมทกะ', art: 'laddu', refs: () => [liked('ขนมลาดู-โมทกะ') && ['สิ่งที่ชอบ', liked('ขนมลาดู-โมทกะ')]] },
    { id: 'tea', fr: 'Thé aux fleurs', th: 'ชาดอกไม้', art: 'tea', refs: () => [liked('ชาดอกไม้') && ['สิ่งที่ชอบ', liked('ชาดอกไม้')]] },
    { id: 'honey', fr: 'Miel', th: 'น้ำผึ้ง', art: 'honey', refs: () => [liked('น้ำผึ้ง') && ['สิ่งที่ชอบ', liked('น้ำผึ้ง')]] },
    {
      id: 'out', fr: 'Hors vitrine', th: 'ไม่จัดวางในตู้', art: 'box', out: true,
      refs: () => [
        ['สิ่งที่ไม่ชอบ', ['ช็อกโกแลต', 'ขนมไส้ถั่ว'].filter((d) => C.dislikes.includes(d)).join(' · ')],
        ['decor', 'ตู้กระจกของเว็บไซต์จึงไม่จัดวางขนมสองอย่างนี้ (การจัดวางของเว็บไซต์ ไม่ใช่ข้อมูลตัวละคร)']
      ]
    }
  ];

  const dessertList = $('[data-desserts]');
  DESSERTS.forEach((d) => {
    dessertList.append(h('li', null, [
      h('button', { class: 'dessert' + (d.out ? ' dessert--out' : ''), type: 'button', 'aria-pressed': 'false', 'data-dessert': d.id, 'data-cursor': 'dessert', 'data-sfx': 'dessert' }, [
        h('span', { class: 'dessert__art', html: ART[d.art]() }),
        h('span', { class: 'dessert__fr', lang: 'fr', text: d.fr }),
        h('span', { class: 'dessert__th', text: d.th })
      ])
    ]));
  });

  const stage = $('.stage');
  const stageDessert = $('[data-stage-dessert]');
  let liftTimer = 0;
  function showDessert(id, user) {
    const d = DESSERTS.find((x) => x.id === id) || DESSERTS[0];
    $$('[data-dessert]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dessert === d.id)));
    const name = $('[data-stage-name]');
    name.textContent = '';
    name.append(h('span', { lang: 'fr', text: d.fr }), h('small', { text: d.th }));
    const refs = $('[data-stage-refs]');
    refs.textContent = '';
    d.refs().filter(Boolean).forEach(([label, text]) => {
      if (!text) return;
      const decor = label === 'decor';
      refs.append(h('p', { class: 'ref' + (decor ? ' ref--decor' : '') }, [
        h('b', { text: decor ? 'หมายเหตุของเว็บไซต์' : 'ข้อมูลตัวละคร · ' + label }),
        document.createTextNode(text)
      ]));
    });

    const put = () => { stageDessert.innerHTML = ART[d.art](); stageDessert.classList.remove('is-swapping'); };
    if (!user || reduced()) { put(); stage.classList.add('is-lifted'); return; }
    // close the cloche, swap the dessert underneath, lift again
    clearTimeout(liftTimer);
    stage.classList.remove('is-lifted');
    stageDessert.classList.add('is-swapping');
    liftTimer = setTimeout(() => { put(); stage.classList.add('is-lifted'); }, 520);
  }
  dessertList.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dessert]');
    if (b) showDessert(b.dataset.dessert, true);
  });
  showDessert('canele', false);

  const sign = $('[data-shop-sign]');
  $('[data-ring-bell]').dataset.sfx = 'door';
  $('[data-ring-bell]').addEventListener('click', () => {
    sign.classList.remove('is-ringing'); void sign.offsetWidth; sign.classList.add('is-ringing');
  });

  /* =========================================================
     PARFUM — notes + petals
     ========================================================= */
  const NOTE_STYLE = {
    'ดอกปีบ': { fr: 'Fleur de Millingtonia', orb: '#f6f1e8', kind: 'petal', icon: '<svg viewBox="0 0 40 40"><g fill="#fff" stroke="#cfbeb6" stroke-width=".6"><path d="M20 20 20 6c3 3 3 9 0 14Z"/><path d="M20 20 33 15c-2 4-8 6-13 5Z"/><path d="M20 20 28 32c-4-1-8-6-8-12Z"/><path d="M20 20 12 32c0-6 4-11 8-12Z"/><path d="M20 20 7 15c5-1 11 1 13 5Z"/></g><path d="M20 20v16" stroke="#cfbeb6" stroke-width="1.4"/><circle cx="20" cy="20" r="1.8" fill="#edc693"/></svg>' },
    'วานิลลา': { fr: 'Vanille', orb: '#f1dfb8', kind: 'cream', icon: '<svg viewBox="0 0 40 40"><path d="M9 33c8-6 15-15 21-27" stroke="#56281c" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M13 31c7-6 12-13 17-22" stroke="#905e4f" stroke-width="1" fill="none"/><g fill="#fffaf2" stroke="#e0c690" stroke-width=".6"><path d="M28 14c-6-1-8-6-5-8 3 0 5 4 5 8Z"/><path d="M28 14c1-6 6-8 8-5 0 3-4 5-8 5Z"/><path d="M28 14c5 2 6 6 3 7-3 0-4-3-3-7Z"/></g></svg>' },
    'แป้งอบ': { fr: 'Pâte dorée', orb: '#e2b878', kind: 'flour', icon: '<svg viewBox="0 0 40 40"><path d="M7 26c0-8 6-13 13-13s13 5 13 13c0 3-3 5-13 5S7 29 7 26Z" fill="#d9a35a"/><path d="M12 20c2 2 4 2 6 0M19 18c2 2 4 2 6 0M24 21c2 2 3 2 5 0" stroke="#fbe6c1" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M11 24c4 3 14 3 18 0" stroke="#a8692a" stroke-width="1" fill="none"/></svg>' },
    'คาราเมล': { fr: 'Caramel', orb: '#c4772a', kind: 'drop', icon: '<svg viewBox="0 0 40 40"><path d="M20 6c6 9 10 14 10 19a10 10 0 0 1-20 0c0-5 4-10 10-19Z" fill="#8a3d12"/><path d="M16 24c0 3 2 5 4 6" stroke="#edc693" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>' }
  };

  // full verbatim description, with the four note words marked (text itself is unchanged)
  const scentText = $('[data-scent-text]');
  $('[data-scent-title]').textContent = C.scent.title;
  (function markNotes() {
    const words = C.scent.notes;
    const re = new RegExp('(' + words.join('|') + ')', 'g');
    C.scent.full.split(re).forEach((part) => {
      if (words.includes(part)) scentText.append(h('mark', { 'data-note': part, text: part }));
      else if (part) scentText.append(document.createTextNode(part));
    });
  })();

  const notesEl = $('[data-scent-notes]');
  let activeNote = null;
  C.scent.notes.forEach((n) => {
    const st = NOTE_STYLE[n];
    notesEl.append(h('button', { class: 'note', type: 'button', 'aria-pressed': 'false', 'data-note-btn': n, style: '--orb:' + st.orb, 'data-sfx': 'click' }, [
      h('span', { class: 'note__orb', html: st.icon }),
      h('span', { class: 'note__name', text: n }),
      h('span', { class: 'note__fr', lang: 'fr', 'aria-hidden': 'true', text: st.fr })
    ]));
  });
  function setNote(n) {
    activeNote = n;
    $$('[data-note-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.noteBtn === n)));
    $$('mark[data-note]', scentText).forEach((m) => m.classList.toggle('is-on', m.dataset.note === n));
  }
  notesEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-note-btn]');
    if (b) setNote(activeNote === b.dataset.noteBtn ? null : b.dataset.noteBtn);
  });
  notesEl.addEventListener('pointerover', (e) => {
    const b = e.target.closest('[data-note-btn]');
    if (b && e.pointerType === 'mouse') $$('mark[data-note]', scentText).forEach((m) => m.classList.toggle('is-on', m.dataset.note === b.dataset.noteBtn || m.dataset.note === activeNote));
  });
  notesEl.addEventListener('pointerleave', () => setNote(activeNote));

  // particles
  (function scentParticles() {
    const canvas = $('[data-scent-canvas]');
    const section = $('#parfum');
    const cx = canvas.getContext && canvas.getContext('2d');
    if (!cx) return;
    const COLORS = { petal: '#ffffff', cream: '#f6e7c6', flour: '#f3d9a9', drop: '#d48a3a', dust: '#edc693' };
    const sprites = {};
    function sprite(kind) {
      if (sprites[kind]) return sprites[kind];
      const s = document.createElement('canvas'); s.width = s.height = 32;
      const g = s.getContext('2d');
      g.translate(16, 16);
      if (kind === 'petal') {
        g.fillStyle = '#fffdf8';
        for (let i = 0; i < 5; i++) { g.rotate(Math.PI * 2 / 5); g.beginPath(); g.ellipse(0, -6, 2.6, 6, 0, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#edc693'; g.beginPath(); g.arc(0, 0, 1.6, 0, Math.PI * 2); g.fill();
      } else {
        const r = kind === 'drop' ? 5 : kind === 'dust' ? 3 : 4;
        const grd = g.createRadialGradient(0, 0, 0, 0, 0, r * 2.4);
        grd.addColorStop(0, COLORS[kind]); grd.addColorStop(.4, COLORS[kind] + 'aa'); grd.addColorStop(1, COLORS[kind] + '00');
        g.fillStyle = grd; g.beginPath(); g.arc(0, 0, r * 2.4, 0, Math.PI * 2); g.fill();
      }
      return (sprites[kind] = s);
    }
    const KIND_OF = { 'ดอกปีบ': 'petal', 'วานิลลา': 'cream', 'แป้งอบ': 'flour', 'คาราเมล': 'drop' };
    let W = 0, H = 0, dpr = 1, parts = [], running = false, visible = false, raf = 0, last = 0;

    function pickKind() {
      if (activeNote && Math.random() < 0.7) return KIND_OF[activeNote];
      const r = Math.random();
      return r < 0.34 ? 'petal' : r < 0.55 ? 'dust' : r < 0.72 ? 'cream' : r < 0.86 ? 'flour' : 'drop';
    }
    function spawn(p, anywhere) {
      p.kind = pickKind();
      p.x = Math.random() * W;
      p.y = anywhere ? Math.random() * H : -20;
      p.s = (p.kind === 'petal' ? 0.6 : 0.35) + Math.random() * 0.5;
      p.vy = 12 + Math.random() * 22;
      p.vx = -6 + Math.random() * 12;
      p.rot = Math.random() * 6.28; p.vr = -0.6 + Math.random() * 1.2;
      p.a = 0.35 + Math.random() * 0.5;
      p.ph = Math.random() * 6.28;
      return p;
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = section.clientWidth; H = section.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(56, Math.max(20, W * H / 26000)));
      parts = Array.from({ length: n }, () => spawn({}, true));
      if (reduced()) draw(0);
    }
    function draw(dt) {
      cx.clearRect(0, 0, W, H);
      for (const p of parts) {
        if (dt) {
          p.ph += dt * 0.8;
          p.x += (p.vx + Math.sin(p.ph) * 10) * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
          if (p.y > H + 20 || p.x < -30 || p.x > W + 30) spawn(p, false);
        }
        const img = sprite(p.kind);
        cx.globalAlpha = p.a;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.scale(p.s, p.s);
        cx.drawImage(img, -16, -16);
        cx.restore();
      }
      cx.globalAlpha = 1;
    }
    function loop(t) {
      const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
      draw(dt);
      raf = running ? requestAnimationFrame(loop) : 0;
    }
    function update() {
      const should = visible && !document.hidden && !reduced();
      if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(loop); }
      else if (!should && running) { running = false; cancelAnimationFrame(raf); raf = 0; }
    }
    resize();
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); }, { passive: true });
    document.addEventListener('visibilitychange', update);
    reduceMQ.addEventListener && reduceMQ.addEventListener('change', () => { update(); draw(0); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; update(); }).observe(section);
    } else { visible = true; update(); }
  })();

  /* =========================================================
     NAVIGATION, DRAWER, TOP BAR
     ========================================================= */
  const topbar = $('[data-topbar]');
  const drawer = $('[data-drawer]');
  const menuBtn = $('[data-menu-btn]');
  menuBtn.dataset.sfx = 'menu';

  function openDrawer() {
    drawer.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    [$('#main'), $('.footer')].forEach((el) => (el.inert = true));
    document.body.style.overflow = 'hidden';
    $('.drawer__list a', drawer).focus();
  }
  function closeDrawer(focusBack) {
    if (drawer.hidden) return;
    drawer.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    [$('#main'), $('.footer')].forEach((el) => (el.inert = false));
    document.body.style.overflow = '';
    if (focusBack) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => (drawer.hidden ? openDrawer() : closeDrawer(true)));
  $$('[data-drawer-close]', drawer).forEach((b) => { b.dataset.sfx = 'close'; b.addEventListener('click', () => closeDrawer(true)); });
  drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button', $('.drawer__sheet'));
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  $$('[data-nav]').forEach((a) => { a.dataset.sfx = 'section'; });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-nav]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id && $(id);
    if (!target) return;
    e.preventDefault();
    closeDrawer(false);
    target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
    // move focus for keyboard and screen-reader users without a second jump
    const head = $('h1, h2', target) || target;
    head.tabIndex = -1;
    head.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!lb.hidden) { closeLightbox(); sfx('close'); }
    else if (!drawer.hidden) { closeDrawer(true); sfx('close'); }
  });

  let solid = false;
  function onScrollBar() {
    const s = window.scrollY > 24;
    if (s !== solid) { solid = s; topbar.classList.toggle('is-solid', s); }
  }
  window.addEventListener('scroll', onScrollBar, { passive: true });
  onScrollBar();

  // current section highlight
  const navLinks = $$('.navlist a');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((l) => l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + en.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section').forEach((s) => io.observe(s));
  }

  /* =========================================================
     REVEAL + PARALLAX
     ========================================================= */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced()) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((r) => rio.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('is-in'));
  }

  (function parallax() {
    const layers = $$('[data-parallax]');
    const hero = $('#accueil');
    let ticking = false, heroVisible = true;
    function apply() {
      ticking = false;
      if (reduced() || !heroVisible) return;
      const y = window.scrollY;
      layers.forEach((l) => { l.style.transform = 'translate3d(0,' + (y * parseFloat(l.dataset.parallax)).toFixed(1) + 'px,0)'; });
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; }).observe(hero);
  })();

  /* =========================================================
     AUDIO CONTROLS + INTERACTION SOUNDS
     ========================================================= */
  const dock = $('[data-audio-dock]');
  const musicBtn = $('[data-audio="music"]', dock);
  const sfxBtn = $('[data-audio="sfx"]', dock);
  const vol = $('[data-audio="volume"]', dock);
  musicBtn.dataset.sfx = 'none'; sfxBtn.dataset.sfx = 'none';

  if (!Audio || !Audio.supported) {
    dock.hidden = true;
  } else {
    Audio.onChange((st) => {
      musicBtn.setAttribute('aria-pressed', String(st.musicOn));
      $('[data-state]', musicBtn).textContent = st.musicOn ? 'ON' : 'OFF';
      sfxBtn.setAttribute('aria-pressed', String(st.sfxOn));
      $('[data-state]', sfxBtn).textContent = st.sfxOn ? 'ON' : 'OFF';
      dock.classList.toggle('is-playing', st.musicOn);
      const pct = Math.round(st.volume * 100);
      if (+vol.value !== pct) vol.value = pct;
      vol.setAttribute('aria-valuetext', pct + '%');
      store.set('anise-sfx', st.sfxOn ? '1' : '0');
    });
    musicBtn.addEventListener('click', () => {
      Audio.setMusic(!Audio.state.musicOn);
      announce(Audio.state.musicOn ? 'เปิดดนตรีประกอบ' : 'ปิดดนตรีประกอบ');
    });
    sfxBtn.addEventListener('click', () => {
      const on = !Audio.state.sfxOn;
      Audio.setSfx(on);
      if (on) Audio.play('click');
      announce(on ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์');
    });
    vol.addEventListener('input', () => Audio.setVolume(vol.value / 100));
    // returning in the same session: effects stay as chosen (they only play on clicks); music waits for a press
    if (store.get('anise-sfx') === '1') {
      const resume = () => { Audio.setSfx(true); };
      document.addEventListener('pointerdown', resume, { once: true, capture: true });
    }
  }

  // one place that maps clicks to sounds: data-sfx="name" or a soft click for other buttons/links
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a[href], [role="tab"]');
    if (!el) return;
    const name = el.dataset.sfx || 'click';
    if (name !== 'none') sfx(name);
  });

  /* =========================================================
     GATE (loading + entrance, sound permission)
     ========================================================= */
  const gate = $('#gate');
  const shut = [$('.topbar'), $('#main'), $('.footer'), dock, $('.skip-link')];

  function entered() {
    root.classList.add('is-entered');
    store.set('anise-entered', '1');
  }

  if (store.get('anise-entered') === '1') {
    entered();
  } else {
    gate.hidden = false;
    shut.forEach((el) => el && (el.inert = true));
    document.body.style.overflow = 'hidden';
    const bar = $('[data-gate-bar]');
    const actions = $('[data-gate-actions]');
    const loading = $('[data-gate-loading]');
    actions.hidden = true;

    // wait for the opening artwork and fonts (with a time limit so the gate never blocks)
    let progress = 12;
    bar.style.width = progress + '%';
    const creep = setInterval(() => { progress = Math.min(88, progress + 9); bar.style.width = progress + '%'; }, 220);
    const heroImg = new Image();
    heroImg.src = M[form].hero.src;
    const waits = [
      heroImg.decode ? heroImg.decode().catch(() => {}) : new Promise((r) => { heroImg.onload = heroImg.onerror = r; }),
      document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve()
    ];
    let ready = false;
    const showActions = () => {
      if (ready) return;
      ready = true;
      clearInterval(creep);
      bar.style.width = '100%';
      setTimeout(() => {
        loading.hidden = true;
        actions.hidden = false;
        actions.classList.add('is-ready');
        $('button', actions).focus();
      }, reduced() ? 0 : 350);
    };
    Promise.all(waits).then(showActions);
    setTimeout(showActions, 4000);

    actions.addEventListener('click', (e) => {
      const b = e.target.closest('[data-enter]');
      if (!b) return;
      const withSound = b.dataset.enter === 'sound';
      if (Audio && Audio.supported) {
        if (withSound) { Audio.enable({ music: true, sfx: true }); Audio.play('door'); }
        else Audio.enable({ music: false, sfx: false });
      }
      gate.classList.add('is-ringing');
      setTimeout(() => {
        gate.classList.add('is-opening');
        entered();
        shut.forEach((el) => el && (el.inert = false));
        document.body.style.overflow = '';
        setTimeout(() => {
          gate.hidden = true;
          const title = $('#hero-title');
          title.tabIndex = -1;
          title.focus({ preventScroll: true });
          if (window.AniseCursor) window.AniseCursor.refresh();
        }, reduced() ? 300 : 1500);
      }, reduced() ? 0 : 450);
      announce(withSound ? 'ยินดีต้อนรับสู่ La Cloche · เปิดเสียงแล้ว' : 'ยินดีต้อนรับสู่ La Cloche');
    });
    $$('[data-enter]', actions).forEach((b) => { b.dataset.sfx = 'none'; });
  }

  /* ---------- go ---------- */
  setForm(form, false);
})();
