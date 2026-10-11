// Behavior checks for the planning guide, without browser or network dependencies.
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const assert = require('node:assert/strict');
const context = { window: {} };
runInNewContext(readFileSync('dist/lab-home.js', 'utf8'), context);
const match = context.window.LabHome.match;
const classroom = { role: 'classroom', age: 'early', needs: ['visual'], goal: 'collaboration', time: 'full' };
const first = match(classroom);
assert.equal(first.lessonId, 'habitats');
assert.match(first.context, /classroom/);
assert.match(first.video.title, /Take Turns/);
const home = match({ role: 'household', age: 'early', needs: ['quiet', 'communication'], goal: 'transitions', time: 'short' });
assert.equal(home.lessonId, 'sensory');
assert.match(home.context, /At home/);
assert.match(home.timeNote, /one story panel/);
assert.equal(home.adaptations.length, 2);
assert.match(home.video.title, /Routines/);
const older = match({ ...classroom, age: 'high', needs: ['movement'], goal: 'persistence', time: 'medium' });
assert.equal(older.lessonId, 'shields');
assert.match(older.ageNote, /base plan is K–2/);
assert.match(older.video.provider, /MIT/);
assert.match(older.timeNote, /second session/);
assert.notEqual(first.lessonId, first.alternativeId);
assert.deepEqual(classroom.needs, ['visual'], 'Matching must not mutate survey answers');
for (const goal of ['regulation', 'collaboration', 'transitions', 'expression', 'persistence']) {
  const result = match({ ...classroom, goal });
  assert.ok(['habitats', 'sensory', 'shields'].includes(result.lessonId));
  assert.ok(result.video.url.startsWith('https://'));
}
console.log('Passed: classroom, household, older-learner adaptations, all goals, and input immutability.');
