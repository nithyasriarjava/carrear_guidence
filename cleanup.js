const fs = require('fs');
const path = require('path');

const filesToRemove = [
  path.join(__dirname, 'src/App.tsx'),
  path.join(__dirname, 'src/data.ts'),
  path.join(__dirname, 'src/main.tsx'),
  path.join(__dirname, 'src/supabaseClient.ts'),
  path.join(__dirname, 'src/vite-env.d.ts'),
  path.join(__dirname, 'vite.config.ts')
];

console.log('Cleaning up TypeScript files...\n');

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log('✓ Removed:', file);
    } catch (error) {
      console.error('✗ Failed to remove:', file, error.message);
    }
  } else {
    console.log('ℹ Not found:', file);
  }
});

console.log('\n✓ Cleanup complete!');
console.log('\nRemaining src files:');
fs.readdirSync(path.join(__dirname, 'src')).forEach(f => {
  const filePath = path.join(__dirname, 'src', f);
  if (fs.statSync(filePath).isFile()) {
    console.log('  -', f);
  }
});
