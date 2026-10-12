const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('dist/roleplay-data.js','utf8'),context);
const data = context.window.RoleplayData;
for (const scenario of data.scenarios) {
  for (const [band] of data.bands) {
    for (let step=0;step<3;step++) {
      const starters = data.starters(scenario,band,step);
      assert.equal(starters.length,3);
      assert.equal(starters[2],'','Every invitation needs an unrestricted writing option');
      assert.ok(starters[0].length && starters[1].length);
      assert.equal(data.compose(starters[0],'  '),'','A starter alone must not become a learner response');
      assert.equal(data.compose(starters[2],'  my own words  '),'my own words');
      assert.ok(scenario.ideas[step].every(idea=>typeof idea === 'string' && idea.trim()));
    }
  }
}
assert.equal(data.compose('I feel','sad and hopeful'),'I feel sad and hopeful');
assert.equal(data.compose('','Me siento triste.\nTambién tengo esperanza.'),'Me siento triste.\nTambién tengo esperanza.');
assert.match(data.scenarios.find(s=>s.id==='family').reminder,/not your job to fix/);
assert.ok(data.scenarios.some(s=>s.id==='own'));
console.log('Passed: six scenarios across three grade bands, all invitations, free-writing options, empty drafts, and multilingual text.');
