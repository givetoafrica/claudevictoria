// THEMES: the look of an explainer. A script picks one with "theme": "<name>".
// colors: bg (light scenes), bgDark (dark scenes), ink / onDark (text), a1-a4 (accents, in order of use),
// card (panel fill), soft (quiet fill), floor (ground strip), ok, muted. fonts: head (titles), body (labels).
// style: the engine's look pack: paper | flat | chalk | neon | watercolor | pixel.
// host: the character who lip-syncs the narration (see engine/video/chars.js for every option); false hides them.
(function () {
  const THEMES = {
    // the fun hand-drawn look of the first Nonprofits Daily explainer: great for training and how-tos
    fun: {
      style: 'paper',
      colors: { bg: '#F6EEDC', bgDark: '#2A2320', ink: '#2A2320', onDark: '#FFFBF2', a1: '#D9663B', a2: '#1F7A74', a3: '#F2B84B', a4: '#E0708A', card: '#FFFBF2', soft: '#EADBB9', floor: '#EADBB9', ok: '#2E9E6B', muted: '#7A6F66', onA3: '#2A2320' },
      fonts: { head: 'Bungee', headW: 400, body: 'Patrick Hand', bodyW: 400 },
      host: { outfit: 'hoodie', shirt: '#1F7A74', hairStyle: 'curly', hair: '#2A1E1A', skin: '#A86E4B', bottoms: 'pants', pants: '#27305C', glasses: 'round', build: 'regular' },
      music: { genre: 'lofi', gain: 0.55 },
    },
    // Nonprofitsdaily brand: plum #3B0B45, ivory #FAF7F2, near-black #1C1421, violet #6C1FE0, gold #E8B547, lavender #D9C8F5
    nonprofitsdaily: {
      style: 'paper',
      colors: { bg: '#FAF7F2', bgDark: '#3B0B45', ink: '#1C1421', onDark: '#FAF7F2', a1: '#6C1FE0', a2: '#3B0B45', a3: '#E8B547', a4: '#D9C8F5', card: '#FFFFFF', soft: '#EFE7F7', floor: '#E8DFF0', ok: '#2E9E6B', muted: '#6E6378', onA3: '#1C1421' },
      fonts: { head: 'Georgia, "Liberation Serif", serif', headW: 700, body: 'Arial, "Liberation Sans", sans-serif', bodyW: 700 },
      host: { outfit: 'hoodie', shirt: '#6C1FE0', hairStyle: 'curly', hair: '#2A1E1A', skin: '#A86E4B', bottoms: 'pants', pants: '#1C1421', glasses: 'round', build: 'regular' },
      music: { genre: 'lofi', gain: 0.5 },
    },
    // newsroom: a calm, mature broadcast look. Deep plum, ivory cards, gold accents, serif headlines, a ticker. No character.
    newsroom: {
      style: 'flat', newsroom: true,
      colors: { bg: '#FAF7F2', bgDark: '#2E0836', ink: '#1C1421', onDark: '#FAF7F2', a1: '#6C1FE0', a2: '#3B0B45', a3: '#E8B547', a4: '#D9C8F5', card: '#FAF7F2', soft: '#EFE7F7', floor: '#1C1421', ok: '#2E9E6B', muted: '#9C92A3', onA3: '#1C1421' },
      fonts: { head: 'Georgia, "Liberation Serif", serif', headW: 700, body: 'Arial, "Liberation Sans", sans-serif', bodyW: 700 },
      host: null,
      music: { genre: 'lofi', gain: 0.4 },
    },
  };
  if (typeof module !== 'undefined') module.exports = THEMES; else globalThis.THEMES = THEMES;
})();
