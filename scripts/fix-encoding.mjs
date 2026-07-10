import fs from 'fs';

const origLines = fs.readFileSync('.original-App.tsx', 'utf8').split('\n');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

const bad = (s) =>
  s.includes('\uFFFD') ||
  /[\x80-\x9f]/.test(s) ||
  s.includes('ðŸ') ||
  s.includes('â€') ||
  s.includes('⬢');

const asciiPrefix = (s) => {
  let out = '';
  for (const ch of s) {
    if (ch.charCodeAt(0) < 128) out += ch;
    else break;
  }
  return out.trimEnd();
};

const origByPrefix = new Map();
for (const line of origLines) {
  if (bad(line)) continue;
  for (const len of [80, 60, 40, 20, 12, 8, 4]) {
    const p = asciiPrefix(line).slice(0, len);
    if (p.length >= 4 && !origByPrefix.has(p)) origByPrefix.set(p, line);
  }
}

let fixed = 0;
lines = lines.map((line) => {
  if (!bad(line)) return line;
  const full = asciiPrefix(line);
  for (const len of [80, 60, 40, 20, 12, 8, 4]) {
    const p = full.slice(0, len);
    if (p.length >= 4 && origByPrefix.has(p)) {
      fixed++;
      return origByPrefix.get(p);
    }
  }
  return line;
});

let text = lines.join('\n');
text = text.replace(/^\uFEFF/, '').replace(/^./, (c) => (c === '\uFFFD' ? '' : c));
text = text.replace(/Didn.t/g, "Didn't").replace(/we.ll/g, "we'll").replace(/you.ll/g, "you'll").replace(/you.d/g, "you'd").replace(/restaurant.s/g, "restaurant's");
fs.writeFileSync('src/App.tsx', text, 'utf8');
console.log('pass2 fixed:', fixed, 'remaining bad:', text.split('\n').filter(bad).length);
