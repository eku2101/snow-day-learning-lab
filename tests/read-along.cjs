const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let timers = new Map(), timerId = 0;
const context = { window: {}, setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); } };
vm.runInNewContext(fs.readFileSync('dist/read-along.js', 'utf8'), context);
const { create, words } = context.window.BuddyReadAlong;
const spoken = [], highlights = [], messages = [];
class Utterance { constructor(text) { this.text = text; } }
const synth = { cancel() {}, speak(u) { spoken.push(u); }, getVoices() { return []; } };
const reader = create({ synth, Utterance, onHighlight: (a,b) => highlights.push([a,b]), onMessage: m => messages.push(m) });
const current = () => spoken.at(-1);
reader.load('Buddy says, “My turn?”'); reader.play();
assert.equal(reader.state, 'reading'); assert.equal(current().text, 'Buddy');
current().onstart(); assert.deepEqual(highlights.at(-1), [0,0]);
current().onend(); assert.equal(current().text, 'says,');
current().onstart(); const lateEnd = current().onend, lateError = current().onerror;
reader.pause(); assert.equal(reader.state, 'paused');
const before = spoken.length; lateEnd(); lateError(); assert.equal(spoken.length, before);
reader.play(); assert.equal(current().text, 'says,', 'Resume repeats the interrupted word');
current().onstart(); current().onend(); current().onstart(); current().onend(); current().onstart(); current().onend();
assert.equal(reader.state, 'done'); assert.deepEqual(highlights.at(-1), [-1,-1]);
reader.play(); assert.equal(current().text, 'Buddy');
const staleStart = current().onstart;
reader.load('Another page.'); staleStart(); assert.equal(reader.state, 'idle'); assert.deepEqual(highlights.at(-1), [-1,-1]);
reader.load('A 🧸 says hello. Next page!', { mode: 'smooth', rate: .5 }); reader.play();
assert.equal(current().text, 'A 🧸 says hello.'); assert.equal(current().rate, .5);
current().onstart(); assert.deepEqual(highlights.at(-1), [0,3]);
current().onboundary({name:'word', charIndex:5}); assert.deepEqual(highlights.at(-1), [2,2], 'UTF-16 offsets map emoji correctly');
reader.pause(); reader.play(); assert.equal(current().text, 'says hello.');
current().onstart(); current().onend(); assert.equal(current().text, 'Next page!');
assert.ok(messages.some(m => m.includes('sentence at a time')), 'No-boundary voices explain sentence fallback');
current().onerror(); assert.equal(reader.state, 'paused'); assert.match(messages.at(-1), /not available/);
reader.stop(); assert.equal(reader.state, 'idle');
const noVoice = create({ synth: null, Utterance: null, onMessage: m => messages.push(m) });
noVoice.load('Read together.'); noVoice.play(); assert.equal(noVoice.supported, false); assert.match(messages.at(-1), /no reading voice/);
const throwing = create({ synth: { cancel() {}, speak() { throw Error('Unavailable'); } }, Utterance });
throwing.load('Hello'); throwing.play(); assert.equal(throwing.state, 'paused');
reader.load('Voice never starts'); reader.play(); for (const fn of [...timers.values()]) fn(); assert.equal(reader.state,'paused');
reader.stop(); assert.equal(timers.size, 0);
assert.equal(words('  Hello\nworld!')[1].start, 8);
console.log('Passed: actual speech highlights, pause/resume, replay, stale callback isolation, UTF-16 boundaries, no-boundary fallback, voice errors, timeout, and no-speech support.');

// Sensitive writing must never fall through to a browser's remote/default voice.
let localVoices = [{voiceURI:'remote', localService:false, lang:'en-US'}];
const privateSpoken = [], privateMessages = [];
const privateReader = create({ localOnly:true, Utterance,
  synth:{cancel(){}, getVoices(){return localVoices;}, speak(u){privateSpoken.push(u);}},
  onMessage: message => privateMessages.push(message)
});
privateReader.load('A fictional private draft.'); privateReader.play();
assert.equal(privateSpoken.length,0,'Remote-only voices must not receive writing');
assert.match(privateMessages.at(-1),/on-device/);
localVoices.push({voiceURI:'local-en',localService:true,lang:'en-US'});
privateReader.play(); assert.equal(privateSpoken.at(-1).voice.voiceURI,'local-en');
privateSpoken.at(-1).onstart();
localVoices = [{voiceURI:'remote',localService:false,lang:'en-US'}];
privateSpoken.at(-1).onend(); assert.equal(privateSpoken.length,1,'Losing a local voice must stop before sending the next word');
localVoices = [{voiceURI:'local-es',localService:true,lang:'es-ES'}, {voiceURI:'remote',localService:false,lang:'en-US'}];
privateReader.load('Mis palabras.', {voiceURI:'local-es'}); privateReader.play();
assert.equal(privateSpoken.at(-1).lang,'es-ES');
assert.equal(privateSpoken.at(-1).voice.localService,true);
privateReader.load('Another draft.', {voiceURI:'remote'}); privateReader.play();
assert.equal(privateSpoken.at(-1).voice.voiceURI,'local-es','A requested remote voice cannot bypass local-only mode');
privateReader.stop();
console.log('Passed: local-only voice privacy, voice-list refresh, mid-reading voice loss, and selected language.');
