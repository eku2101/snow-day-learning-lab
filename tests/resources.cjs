const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
for (const name of ['watch-videos.js', 'resource-library.js']) vm.runInNewContext(fs.readFileSync('dist/' + name, 'utf8'), context);
const { WatchVideos: videos, ResourceLibrary: library } = context.window;
const filter = (changes) => videos.filter(v => library.matches(v, {age:'all',kind:'all',length:'all',query:'',...changes}));
assert.equal(filter({}).length, 9);
assert.equal(filter({age:'high',kind:'calm',length:'medium'})[0].id, 'cmi-high-relaxation');
assert.equal(filter({age:'middle',kind:'move'}).length, 0);
assert.equal(filter({query:'  GoNoodle  '}).length, 2);
assert.equal(filter({age:'adult'}).length, 2);
assert.equal(filter({length:'long'}).length, 3);
assert.ok(filter({length:'medium'}).every(v => Number.isFinite(v.seconds) && v.seconds > 180 && v.seconds <= 360));
assert.ok(!filter({length:'short'}).some(v => v.seconds === null), 'Unknown durations must not be offered as short videos');
assert.equal(new Set(videos.map(v => v.youtubeId)).size, videos.length);
for (const v of videos) {
  assert.match(v.youtubeId, /^[\w-]{11}$/);
  assert.ok(['sesameworkshop.org', 'www.gonoodle.com', 'childmind.org', 'schoolguide.casel.org'].includes(new URL(v.source).hostname));
  assert.ok(v.audience && v.creator && v.review && v.captions && v.followup);
  assert.ok(v.ages.every(id => library.ages.some(([a]) => id === a)));
  assert.ok(v.kinds.every(id => library.kinds.some(([k]) => id === k)));
}
const manifest = JSON.parse(fs.readFileSync('dist/printables/manifest.json', 'utf8'));
assert.equal(manifest.length, 3);
for (const kit of manifest) {
  assert.equal(kit.pages, 4);
  const pdf = fs.readFileSync('dist/' + kit.pdf);
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  const png = fs.readFileSync('dist/' + kit.preview);
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.ok(library.kits.some(k => k.file === kit.id));
}
console.log('Passed video filters, official source metadata, exact video IDs, and three downloadable PDF/preview asset contracts.');
