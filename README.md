# La Cloche — Anise · Character Showcase

เว็บไซต์แนะนำตัวละคร **Anise (อมลรดา มิตสึโอะ โบดุแอง)** — "สัจจะ แห่งขนมหวานและจิตวิญญาณ"
Website Development: **TST Project**

Static site (HTML / CSS / JavaScript). No build step, no dependencies, no backend, no API keys.

## Structure

```
index.html               Page markup and website labels only
css/anise.css            Visual system, layout, responsive rules, reduced motion, cursor
js/character-data.js     OFFICIAL character data (verbatim from the owner, deep-frozen)
js/media-data.js         Artwork list per form (Original / Furry)
js/audio.js              Synthesized music + sound effects (Web Audio API)
js/cursor.js             Anise signature cursor (fine pointers only)
js/main.js               Rendering and interactions
assets/images/           original/ · furry/ · palette/  (full files + -960.webp display copies)
assets/favicon.svg
```

## Editing rules

- Character text lives only in `js/character-data.js`. Change it only when the character owner asks.
- Furry Form fields (`furry` in `character-data.js`) are `null` until the owner sends them; the page shows them as empty.
- Artwork files are the originals as received (watermarks untouched). `-960.webp` files are resized copies for display.

### Add an image

1. Put the file in `assets/images/original/` or `assets/images/furry/` (optional: a ~960px `-960.webp` copy).
2. Add one entry to the matching `gallery` list in `js/media-data.js`:
   `{ src, thumb, w, h, title, kind, credit: 'original' | 'furry' }`
3. Never put an image of one form in the other form's list.

## Preview locally

```bash
python -m http.server 8080
```

Open <http://localhost:8080/>.

## Sound, cursor, accessibility

- Sound is OFF until the visitor chooses "Entrer avec le son" or presses Music / Effects (bottom-right). Volume is remembered; music never auto-starts on a return visit.
- All music and effects are generated in the browser — no audio files, no copyrighted music.
- The custom cursor runs only with a mouse/trackpad; touch devices keep normal touch. Text fields keep the native caret.
- `prefers-reduced-motion` turns off parallax, particles, cursor trails and long animations.

## Credits

- Original Form — Adopt Design: Kitty Catty · Adopt Owner: Jwala DuHin · https://www.facebook.com/kitty.catty.510641
- Furry Form — Adopt Design: roro090(TH) · Adopt Owner: Jwala DuHin (as written on the artwork)
- Website Development — TST Project
- Fonts — Bodoni Moda, Jost, Noto Serif Thai, Shippori Mincho (Google Fonts, SIL OFL)
