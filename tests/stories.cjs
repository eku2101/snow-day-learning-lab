const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('dist/buddy-stories.js','utf8'), context);
const { stories, topics } = context.window.BuddyStories;
const ids = new Set();
const poses = new Set(['ask-friend','listen-helper','blocks','ask','share','build','pause','listen','wave','notice','shadow','breathe','stretch']);
for (const story of stories) {
  assert.ok(!ids.has(story.id)); ids.add(story.id);
  assert.ok(topics.some(topic => topic[0] === story.topic));
  assert.equal(story.scenes.length, 4, 'Movie export expects four pages');
  assert.equal(story.poses.length, story.scenes.length);
  assert.ok(story.poses.every(pose => poses.has(pose)));
  for (const scene of story.scenes) {
    assert.equal(scene.length, 3); assert.ok(scene.every(line => typeof line === 'string' && line.length));
    assert.ok(scene[1].includes('{name}'), 'Each page models the action with the child’s buddy');
    assert.ok(scene[1].split(/\s+/).length <= 32, 'Short read-along pages must fit video captions');
  }
}
for (const [topic] of topics.filter(t => t[0] !== 'all')) assert.ok(stories.some(s => s.topic === topic));
assert.ok(stories.some(s => s.id === 'safe-hands'));
assert.ok(stories.some(s => s.id === 'ask-help'));
console.log(`Passed: ${stories.length} complete stories, topics, personalized captions, illustration poses, and video page lengths.`);
