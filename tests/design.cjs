const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/studio-art.js','utf8'), context);
vm.runInNewContext(fs.readFileSync('dist/learner-nav.js','utf8'), context);
const art = context.window.StudioArt;
const images = [art.welcome(), ...['habitats','sensory','shields'].map(art.lesson), ...['sharing','space','change','belonging'].map(id => art.scene(id))];
for (const svg of images) {
  assert.match(svg, /role="img" aria-label="[^"]+"/);
  assert.match(svg, /viewBox="0 0 720 440"/);
  assert.doesNotMatch(svg, /<script|<foreignObject|<animate|https?:\/\/(?!www.w3.org\/2000\/svg)/);
}
assert.equal(art.scene('invalid'), ''); assert.equal(art.lesson('invalid'), '');
const named = art.scene('sharing', {buddySvg:'<svg data-test-buddy="true"></svg>',name:'<img onerror="bad">'});
assert.ok(named.includes('&lt;img onerror=&quot;bad&quot;&gt;'));
assert.ok(!named.includes('<img'));
assert.ok(named.includes('data-test-buddy="true"'));
for (const current of ['make','stories','together']) {
  const nav = context.window.LearnerNav.markup(current);
  assert.equal((nav.match(/<a /g)||[]).length,3);
  assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
  assert.ok(nav.includes('view=stories') && nav.includes('mode=learner'));
}
const font = fs.readFileSync('dist/fonts/AtkinsonHyperlegibleNext.ttf');
assert.equal(font.readUInt32BE(0), 0x00010000, 'Downloaded asset is a TrueType font, not an error document');
assert.match(fs.readFileSync('dist/fonts/OFL.txt','utf8'), /SIL OPEN FONT LICENSE/);
console.log('Passed accessible artwork, escaped character names, three learner destinations, and locally licensed font asset.');
