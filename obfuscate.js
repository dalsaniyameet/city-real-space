const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const files = [
  'script.js',
  'admin/script.js',
  'admin/admin-script.js',
  'admin/login.html'
];

const options = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false
};

files.forEach(file => {
  if (!file.endsWith('.js')) return;
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) { console.log('Not found:', file); return; }
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    const result = JavaScriptObfuscator.obfuscate(code, options);
    fs.writeFileSync(filePath, result.getObfuscatedCode(), 'utf8');
    const before = (code.length / 1024).toFixed(1);
    const after = (result.getObfuscatedCode().length / 1024).toFixed(1);
    console.log(`✅ ${file} — ${before}KB → ${after}KB`);
  } catch(e) {
    console.log(`❌ ${file} — Error: ${e.message}`);
  }
});

console.log('\nDone! All JS files obfuscated.');
