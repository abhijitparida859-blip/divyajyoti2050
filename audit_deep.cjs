const fs = require('fs');
const path = require('path');

function searchFiles(dir, exts) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        results = results.concat(searchFiles(fullPath, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = searchFiles('src', ['.ts', '.tsx']);
const suspicious = [];
const patterns = [
  { name: 'TODO_FIXME', regex: /(TODO|FIXME|TBD|HACK)/i },
  { name: 'Placeholder_Mock', regex: /(placeholder|dummy|sample_data|mock_data)/i },
  { name: 'Hardcoded_Date', regex: /['"][0-9]{4}-[0-9]{2}-[0-9]{2}['"]/ },
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    patterns.forEach(p => {
      if (p.regex.test(line)) {
        suspicious.push({ file: f, line: idx + 1, type: p.name, text: line.trim() });
      }
    });
  });
});

console.log('Total suspicious patterns found:', suspicious.length);
suspicious.forEach(s => console.log(`[${s.type}] ${s.file}:${s.line} -> ${s.text.slice(0, 110)}`));
