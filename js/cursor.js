/*
 * LA CLOCHE — Anise signature cursor
 * A gold hotspot dot (the exact click point) with Anise's dark-chocolate bow and golden gem
 * riding just below-right of it, so it never covers what you are pointing at.
 *
 * States: default · hover (links/buttons: ring + sparkle) · text (slim caret) ·
 *         gallery (loupe badge) · dessert (canelé badge) · click burst.
 * Furry Form adds two tiny wing flicks to the bow.
 * Only runs on devices with a fine, hovering pointer; the native cursor is hidden only after this runs.
 */
(function () {
  'use strict';

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches) return;

  const BOW = `
    <svg viewBox="-6 -4 60 40" aria-hidden="true">
      <g class="ac__wings" fill="#56281c">
        <path d="M5 8C0 4-4 6-5 1c3 1 6 0 8 3Z"/>
        <path d="M43 8c5-4 9-2 10-7-3 1-6 0-8 3Z"/>
      </g>
      <use href="#i-bow" width="48" height="32"/>
      <g class="ac__spark" fill="#edc693">
        <path d="M37 0l1.4 3.6L42 5l-3.6 1.4L37 10l-1.4-3.6L32 5l3.6-1.4Z"/>
      </g>
    </svg>`;

  const LOUPE = '<svg class="ac__icon ac__icon--loupe" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const CANELE = '<svg class="ac__icon ac__icon--canele" viewBox="0 0 64 64"><use href="#i-canele"/></svg>';

  const root = document.createElement('div');
  root.className = 'ac';
  root.setAttribute('aria-hidden', 'true');
  root.dataset.state = 'default';
  root.innerHTML =
    '<div class="ac__ring"><div class="ac__ring-inner"></div></div>' +
    '<div class="ac__badge"><div class="ac__badge-inner">' + LOUPE + CANELE + '</div></div>' +
    '<div class="ac__bow"><div class="ac__bow-inner">' + BOW + '</div></div>' +
    '<div class="ac__beam"></div>' +
    '<div class="ac__dot"></div>';
  document.body.appendChild(root);

  const dot = root.querySelector('.ac__dot');
  const bow = root.querySelector('.ac__bow');
  const ring = root.querySelector('.ac__ring');
  const beam = root.querySelector('.ac__beam');
  const badge = root.querySelector('.ac__badge');

  const INTERACTIVE = 'a[href], button, [role="tab"], [role="radio"], label, select, summary, input[type="range"], input[type="checkbox"], input[type="radio"], [tabindex]:not([tabindex="-1"]):not([role="tabpanel"])';
  const NATIVE = 'input[type="text"], input[type="search"], input[type="email"], textarea, [contenteditable="true"]';
  const TEXT = 'p, li, dd, dt, h1, h2, h3, h4, blockquote, figcaption, mark';

  let x = -100, y = -100, bx = -100, by = -100, rx = -100, ry = -100;
  let raf = 0, active = false;

  function stateFor(el) {
    if (!el || !el.closest) return 'default';
    if (el.closest(NATIVE)) return 'native';
    const special = el.closest('[data-cursor]');
    if (special) return special.dataset.cursor;
    if (el.closest(INTERACTIVE)) return 'hover';
    if (el.closest(TEXT)) return 'text';
    return 'default';
  }

  function setState(s) {
    if (s === 'native') { root.classList.remove('is-visible'); return; }
    root.classList.add('is-visible');
    if (root.dataset.state !== s) root.dataset.state = s;
  }

  function place(el, px, py) { el.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)'; }

  function frame() {
    raf = 0;
    const k1 = reduce.matches ? 1 : 0.32, k2 = reduce.matches ? 1 : 0.2;
    bx += (x - bx) * k1; by += (y - by) * k1;
    rx += (x - rx) * k2; ry += (y - ry) * k2;
    place(dot, x, y); place(beam, x, y);
    place(bow, bx, by);
    place(ring, rx, ry); place(badge, rx, ry);
    if (Math.abs(x - rx) > 0.3 || Math.abs(y - ry) > 0.3) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  function activate() {
    if (active) return;
    active = true;
    bx = rx = x; by = ry = y;
    document.documentElement.classList.add('has-ac');
  }
  function deactivate() {
    active = false;
    root.classList.remove('is-visible');
    document.documentElement.classList.remove('has-ac');
  }

  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') { if (active) deactivate(); return; }
    x = e.clientX; y = e.clientY;
    activate();
    kick();
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    if (!active) return;
    setState(stateFor(e.target));
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => root.classList.remove('is-visible'));
  window.addEventListener('blur', () => root.classList.remove('is-visible'));

  document.addEventListener('pointerdown', (e) => {
    if (!active || e.pointerType !== 'mouse') return;
    root.classList.add('is-down');
    if (!reduce.matches) burst(e.clientX, e.clientY);
  }, { passive: true });
  document.addEventListener('pointerup', () => root.classList.remove('is-down'), { passive: true });

  // caramel ring + golden sparks on click (capped so rapid clicking stays light)
  let bursts = 0;
  function burst(px, py) {
    if (bursts > 3) return;
    bursts += 1;
    const b = document.createElement('div');
    b.className = 'ac-burst';
    b.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
    let html = '<span class="ac-burst__ring"></span>';
    for (let i = 0; i < 5; i++) html += '<span class="ac-burst__spark" style="--a:' + (i * 72 + Math.random() * 20 - 10) + 'deg"></span>';
    b.innerHTML = html;
    document.body.appendChild(b);
    setTimeout(() => { b.remove(); bursts -= 1; }, 700);
  }

  // re-evaluate the state when content under a still pointer changes (tabs, lightbox, form switch)
  window.AniseCursor = {
    refresh() {
      if (!active) return;
      setState(stateFor(document.elementFromPoint(x, y)));
    }
  };

  fine.addEventListener && fine.addEventListener('change', () => { if (!fine.matches) deactivate(); });
})();
