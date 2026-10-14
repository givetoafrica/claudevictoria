// YEAR-END APPEAL IN 30 DAYS (16:9, ~2:27): a Nonprofits Daily explainer.
// The narration is real recorded speech (assets/narration/seg1-6.mp3). Every scene cut sits on a bar line,
// and the four week scenes each chime a rising note, so the music and the "Week 1 -> 4" picture share one score.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, makeChords } = MU;

  const FPS = 30;
  const FORMAT = '16:9';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: 96, offset: 0 }); // one bar = 2.5 s
  const { T, BEAT } = clock;
  const DURATION = T(59);

  // scene boundaries (all on bar lines)
  const S = {
    title: [0, T(1)], hook: [T(1), T(9)], w1: [T(9), T(20)], w2: [T(20), T(31)], w3: [T(31), T(40)], w4: [T(40), T(51)], close: [T(51), DURATION],
  };
  const ev = { title: 0.4, hook: S.hook[0], w1: S.w1[0], w2: S.w2[0], w3: S.w3[0], w4: S.w4[0], close: S.close[0] };

  const loop = ['C', 'G', 'Am', 'F'];
  const { chords, chordAt } = makeChords(clock, {
    C: { notes: ['E3', 'G3', 'C4'], bass: 'C2' }, G: { notes: ['D3', 'G3', 'B3'], bass: 'G1' }, Am: { notes: ['E3', 'A3', 'C4'], bass: 'A1' }, F: { notes: ['F3', 'A3', 'C4'], bass: 'F1' },
  }, [...Array.from({ length: 59 }, (_, b) => [b, 0, 4, loop[b % 4]])]);

  // the narration: six clips, each starting on a bar line (durations measured from the mp3s)
  const NARR = [
    { file: 'assets/narration/seg1.mp3', at: T(1), text: "Roughly a third of annual giving happens in December. It's October 14th. If your year-end appeal isn't written yet, you are not behind. You have exactly enough time, if you follow a plan. Here's your year-end appeal in 30 days, one week at a time." },
    { file: 'assets/narration/seg2.mp3', at: T(9), text: "Week one is decisions, not writing. Set one goal: a dollar amount and a donor count. Pick one story, one need, one ask. Pull your list and split it three ways: current donors, lapsed donors, and warm prospects. Finally, choose your channels: letter, email, social, and one personal call list. Don't try everything. Pick what your team can finish." },
    { file: 'assets/narration/seg3.mp3', at: T(20), text: "Week two, write once, adapt everywhere. Lead with a person, not your organization. Name one real outcome, say what a gift does, and make one clear ask with one clear link. Thank donors before you ask again. Write the letter first, then trim it into your email, your social posts, and your call script. Get one person outside your team to read it." },
    { file: 'assets/narration/seg4.mp3', at: T(31), text: "Week three, send. Mail the letter so it lands before Giving Tuesday, which is December 1st this year, and send your first email the same week. Make personal calls and handwritten notes to your top donors. Post your story on social with your donation link. Check that the donation page works on a phone, and that receipts send automatically." },
    { file: 'assets/narration/seg5.mp3', at: T(40), text: "Week four is where most appeals are won. Most people don't give on the first message. Send a reminder to everyone who hasn't responded, and a different message to those who have. Thank every donor within 48 hours, and tell them what their gift will do. As December ends, send a deadline email on December 30th and 31st. Then track results: gifts, donors, and which channel worked." },
    { file: 'assets/narration/seg6.mp3', at: T(51), text: "That's the whole plan. Today, do one thing: write down your goal and your story. If you want the checklist, grab it in the description. And tell us in the comments: how much of your appeal is done? I'm Nonprofits Daily, and we'll see you tomorrow." },
  ];

  // each scene's entrance gets a rising chime: the week number is also the note
  const chime = { w1: 'C5', w2: 'E5', w3: 'G5', w4: 'C6' };
  const markers = {
    hook: { t: ev.hook, sync: 'av' }, w1: { t: ev.w1, sync: 'av' }, w2: { t: ev.w2, sync: 'av' }, w3: { t: ev.w3, sync: 'av' }, w4: { t: ev.w4, sync: 'av' }, close: { t: ev.close, sync: 'av' },
  };

  const SCORE = { FPS, FORMAT, W, H, SAFE, DURATION, clock, T, BEAT, S, m, chords, chordAt, NARR, chime, ev, markers };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
