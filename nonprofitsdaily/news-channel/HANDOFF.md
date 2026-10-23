# Handoff: Nonprofitsdaily News pilot

State (branch claude/laughing-sagan-s459vs, PR #9):
- explainer-system has theme `newsroom` (light ivory/plum/gold) and scene types: source, headlines, story, take (plus the older ones).
- `node capture.js <video> <scene-id> <url> "sentence to highlight"` captures a real page for a `source` scene.
- Style spec and channel profile: nonprofitsdaily/news-channel/style-spec.md and channel-profile.yaml.
- Sample frames: nonprofitsdaily/news-style-sample/. Sample script: explainer-system/videos/news-sample/script.json.

Pilot to build (60 s): one IRS story (donor-advised funds) and one grants story.
1. Verify every fact on the real IRS.gov / Grants.gov page. Quote the date.
2. node capture.js news-pilot <id> <url> "<exact sentence>" for each source.
3. Write videos/news-pilot/script.json (headlines -> source -> story -> take), narration via ElevenLabs
   (voice Kayleigh fK3Sm9ujL18r46zw0ri0 unless Victoria chooses her own voice), one clip per scene.
4. ./build.sh news-pilot (render in background, then mux). Share a 720p preview under 30 MiB.
Needs in the session: network access to irs.gov, grants.gov, federalregister.gov, usaspending.gov; ElevenLabs connected.
Rules: not political; Give to Africa never mentioned; education only, not tax or legal advice; label unconfirmed claims.
