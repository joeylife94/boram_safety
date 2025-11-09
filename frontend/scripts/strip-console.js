const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '.next');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else if (stat.isFile() && full.endsWith('.js')) files.push(full);
  }
  return files;
}

function processFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('console.')) return false;

  // Backup original (only once)
  const bak = file + '.bak';
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, content, 'utf8');

  // Insert a no-op console replacement at top and replace console. -> __c.
  const noop = "var __c={error:function(){},warn:function(){},log:function(){},info:function(){},debug:function(){}};\n";

  // If file already has __c defined, skip insertion
  let out = content;
  if (!content.includes('var __c=')) {
    out = noop + content.replace(/\bconsole\./g, '__c.');
  } else {
    out = content.replace(/\bconsole\./g, '__c.');
  }

  fs.writeFileSync(file, out, 'utf8');
  return true;
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('.next directory not found:', ROOT);
    process.exit(1);
  }
  const files = walk(ROOT);
  const modified = [];
  for (const f of files) {
    try {
      if (processFile(f)) modified.push(f);
    } catch (e) {
      console.error('Failed to process', f, e && e.message);
    }
  }

  console.log('Processed files count:', files.length);
  console.log('Modified files count:', modified.length);
  if (modified.length) console.log('Modified files:\n' + modified.join('\n'));
}

main();
