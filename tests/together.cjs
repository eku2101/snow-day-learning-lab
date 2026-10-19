const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sandbox = { window: {}, URLSearchParams };
vm.runInNewContext(fs.readFileSync('dist/together-data.js', 'utf8'), sandbox);
const data = sandbox.window.TogetherData;
let branches = 0;
for (const scene of data.scenes) {
  const practice = data.createSession('#together?scene=' + scene.id);
  assert.equal(practice.next(), false, 'Cannot skip choosing a plan');
  for (const plan of scene.plans) {
    assert.ok(practice.choosePlan(plan.id));
    assert.ok(practice.next());
    practice.write('line', 'My own words, in any language.');
    assert.ok(practice.next());
    practice.write('reflection', 'An everyday connection.');
    assert.equal(practice.next(), false, 'Stay inside the final step');
    practice.back(); practice.back();
    assert.equal(practice.state.line, 'My own words, in any language.');
    assert.equal(practice.state.reflection, 'An everyday connection.');
    assert.ok(data.planFor(scene.id, plan.id).outcome);
    branches++;
  }
  const previous = practice.state.plan;
  assert.equal(practice.choosePlan('invalid'), false);
  assert.equal(practice.state.plan, previous, 'Invalid choices must not replace a valid plan');
  practice.write('line', 'x'.repeat(900));
  assert.equal(practice.state.line.length, 600);
  practice.chooseScene(data.scenes.find(s => s.id !== scene.id).id);
  assert.equal(practice.state.line, ''); assert.equal(practice.state.reflection, '');
  assert.equal(practice.state.plan, null); assert.equal(practice.state.stage, 0);
  practice.write('line', 'Transient'); practice.clear();
  assert.equal(practice.state.line, ''); assert.equal(practice.state.scene, null);
}
const source = '#together?scene=sharing&band=younger&cast=buddy';
const first = data.createSession(source), second = data.createSession(source);
first.write('line', 'One session only');
assert.equal(second.state.line, '', 'Remounting does not restore private drafts');
assert.equal(second.state.band, 'younger'); assert.equal(second.state.cast, 'buddy');
const invalid = data.options('#together?scene=<script>&band=evil&cast=evil');
assert.equal(invalid.scene, null); assert.equal(invalid.band, 'older'); assert.equal(invalid.cast, 'people');
for (const id of Object.values(data.storyScenes)) assert.ok(data.sceneFor(id), 'Story bridges lead to valid scenes');
// Prevent accidental persistence or outbound transport in the new private workflow.
for (const file of ['together.js', 'together-data.js']) {
  const source = fs.readFileSync('dist/' + file, 'utf8');
  assert.ok(!/localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/.test(source), file + ' must remain transient and local');
}
console.log(`Passed ${branches} plan journeys, replay preservation, invalid choices, clear/remount privacy, and story routes.`);
