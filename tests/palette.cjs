// Verify actual CSS token pairs using WCAG's relative-luminance formula.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const css = fs.readFileSync('dist/design-system.css', 'utf8');
function declarations(selector) {
  const start = css.indexOf(selector + ' {');
  assert.ok(start >= 0, `Missing theme ${selector}`);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
function resolve(tokens, key) {
  const value = tokens[key];
  assert.ok(value, `Unknown token ${key}`);
  return value.startsWith('var(') ? resolve(tokens, value.slice(4, -1)) : value;
}
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(a, b) {
  const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (bright + .05) / (dark + .05);
}
const base = declarations(':root');
const requested = { '--bg-primary':'#F8F9FA', '--bg-surface':'#FFFFFF', '--text-primary':'#2B303A', '--text-muted':'#5A6578', '--brand-teal':'#2C6E63', '--accent-lavender':'#6C5CE7', '--soft-mint':'#E8F1EE', '--soft-amber':'#D97706', '--border-subtle':'#E2E8F0' };
for (const [key, value] of Object.entries(requested)) assert.equal(base[key], value);
let count = 0, min = Infinity;
for (const mode of ['light', 'dark', 'neutral']) {
  const tokens = { ...base, ...(mode === 'light' ? {} : declarations(`:root[data-theme="${mode}"]`)) };
  function check(fg, bg) {
    const ratio = contrast(resolve(tokens, fg), resolve(tokens, bg));
    assert.ok(ratio >= 4.5, `${mode}: ${fg} on ${bg} is ${ratio.toFixed(3)}:1`);
    count++; min = Math.min(min, ratio);
  }
  for (const fg of ['--text-primary', '--text-muted', '--text-heading', '--text-link'])
    for (const bg of ['--bg-primary', '--bg-surface', '--soft-mint', '--surface-lavender', '--surface-nudge']) check(fg, bg);
  check('--text-on-accent', '--brand-teal');
  check('--text-on-accent', '--accent-lavender');
  check('--reading-ink', '--reading-highlight');
}
for (const name of fs.readdirSync('dist').filter(n => n.endsWith('.css') && n !== 'design-system.css')) {
  const component = fs.readFileSync('dist/' + name, 'utf8');
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(component), `Hard-coded component color in ${name}`);
  assert.ok(!/(?:color|background):\s*(?:white|black)\s*;/i.test(component), `Non-token color in ${name}`);
}
console.log(`Passed ${count} theme/text pairs; minimum ${min.toFixed(2)}:1. All component CSS colors use tokens.`);
