const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'src');

function walk(dir) {
  const results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else if (stat.isFile() && full.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

function toAbsoluteImport(filePath, importPath) {
  const fileDir = path.dirname(filePath);
  // relative imports: ./ or ../
  if (importPath.startsWith('.')) {
    const resolved = path.resolve(fileDir, importPath);
    if (!resolved.startsWith(SRC_DIR)) return null; // outside src, leave
    const relToSrc = path.relative(SRC_DIR, resolved).split(path.sep).join('/');
    // map top-level folders to specific aliases
    if (relToSrc.startsWith('feature/')) return '@feature/' + relToSrc.replace(/^feature\//, '');
    if (relToSrc.startsWith('models/')) return '@models/' + relToSrc.replace(/^models\//, '');
    if (relToSrc.startsWith('route/')) return '@route/' + relToSrc.replace(/^route\//, '');
    return '@src/' + relToSrc;
  }
  // handle already-prefixed imports
  if (importPath.startsWith('@src')) return null; // already using @src prefix
  if (importPath.startsWith('@feature') || importPath.startsWith('@models') || importPath.startsWith('@route')) return null; // already aliased
  if (importPath.startsWith('@/')) return importPath.replace(/^@\//, '@src/');
  if (importPath.startsWith('@')) return null; // other @ scoped imports leave
  const candidates = [
    path.join(SRC_DIR, importPath + '.ts'),
    path.join(SRC_DIR, importPath + '.tsx'),
    path.join(SRC_DIR, importPath, 'index.ts'),
    path.join(SRC_DIR, importPath, 'index.tsx'),
    path.join(SRC_DIR, importPath)
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      const relToSrc = path.relative(SRC_DIR, cand).split(path.sep).join('/');
      // if candidate pointed at index.ts, map to folder path
      const final = relToSrc.replace(/(^|\/)index\.(ts|tsx)$/, '').replace(/\.(ts|tsx)$/, '');
      const cleaned = final.replace(/(^\/|\/$)/g, '');
      if (cleaned.startsWith('feature/')) return '@feature/' + cleaned.replace(/^feature\//, '');
      if (cleaned.startsWith('models/')) return '@models/' + cleaned.replace(/^models\//, '');
      if (cleaned.startsWith('route/')) return '@route/' + cleaned.replace(/^route\//, '');
      return '@src/' + cleaned;
    }
  }
  return null;
}

const files = walk(SRC_DIR);
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  // regex for import / export / require / from '...'
  content = content.replace(/(from\s+['"])([^'"\)]+)(['"])/g, (m, p1, p2, p3) => {
    const target = p2.trim();
    const abs = toAbsoluteImport(file, target);
    if (!abs) return m;
    return p1 + abs + p3;
  });
  // import '...' side-effect
  content = content.replace(/(import\s+['"])([^'\"]+)(['"])/g, (m, p1, p2, p3) => {
    const target = p2.trim();
    const abs = toAbsoluteImport(file, target);
    if (!abs) return m;
    return p1 + abs + p3;
  });
  // require('...')
  content = content.replace(/(require\(\s*['"])([^'\"]+)(['"]\s*\))/g, (m, p1, p2, p3) => {
    const target = p2.trim();
    const abs = toAbsoluteImport(file, target);
    if (!abs) return m;
    return p1 + abs + p3;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
    console.log('Updated:', file);
  }
}
console.log('Done. Files changed:', changed);
process.exit(0);
