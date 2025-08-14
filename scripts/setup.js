#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up LookAway for Windows...\n');

// Check if assets directory exists
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  console.log('📁 Creating assets directory...');
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Check for required assets
const requiredAssets = [
  'icon.png',
  'tray-icon.png', 
  'icon.ico'
];

const missingAssets = requiredAssets.filter(asset => {
  return !fs.existsSync(path.join(assetsDir, asset));
});

if (missingAssets.length > 0) {
  console.log('⚠️  Missing required assets:');
  missingAssets.forEach(asset => {
    console.log(`   - ${asset}`);
  });
  
  console.log('\n📋 To create placeholder assets:');
  console.log('   1. Download icons from https://favicon.io/');
  console.log('   2. Save as icon.png (256x256)');
  console.log('   3. Save as tray-icon.png (32x32)');
  console.log('   4. Convert to icon.ico using an online converter');
  console.log('   5. Place all files in the assets/ directory');
  
  console.log('\n💡 Quick solution:');
  console.log('   You can use any PNG files temporarily for development.');
  console.log('   The app will work without proper icons, but you\'ll see missing image warnings.');
} else {
  console.log('✅ All required assets found!');
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.log('\n⚠️  Warning: Node.js 18+ is required');
  console.log(`   Current version: ${nodeVersion}`);
  console.log('   Please upgrade Node.js from https://nodejs.org/');
} else {
  console.log(`✅ Node.js version: ${nodeVersion}`);
}

// Check if dependencies are installed
const nodeModulesDir = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('\n📦 Dependencies not installed');
  console.log('   Run: npm install');
} else {
  console.log('✅ Dependencies installed');
}

console.log('\n🎯 Next steps:');
console.log('   1. Install dependencies: npm install');
console.log('   2. Build the project: npm run build');
console.log('   3. Start development: npm run dev');
console.log('\n📖 For detailed instructions, see RUNNING.md');

console.log('\n✨ Setup complete!'); 