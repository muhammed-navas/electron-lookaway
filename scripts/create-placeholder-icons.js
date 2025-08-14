#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Creating placeholder icons...');

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple SVG icon
const createSVG = (size, text) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#667eea"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" 
        fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>
`;

// Create PNG placeholder (simple colored square with text)
const createPNGPlaceholder = (size, text) => {
  // This is a very basic PNG creation - in a real scenario you'd use a proper image library
  // For now, we'll create a simple text file that can be converted
  const svg = createSVG(size, text);
  return svg;
};

// Create the icons
const icons = [
  { name: 'icon.png', size: 256, text: 'LA' },
  { name: 'tray-icon.png', size: 32, text: 'LA' }
];

icons.forEach(icon => {
  const filePath = path.join(assetsDir, icon.name);
  if (!fs.existsSync(filePath)) {
    const svg = createPNGPlaceholder(icon.size, icon.text);
    // Save as SVG for now - user can convert to PNG
    const svgPath = filePath.replace('.png', '.svg');
    fs.writeFileSync(svgPath, svg);
    console.log(`✅ Created ${icon.name.replace('.png', '.svg')}`);
    console.log(`   Convert to PNG: ${svgPath} -> ${filePath}`);
  } else {
    console.log(`✅ ${icon.name} already exists`);
  }
});

// Create a simple ICO file placeholder
const icoPath = path.join(assetsDir, 'icon.ico');
if (!fs.existsSync(icoPath)) {
  console.log('⚠️  icon.ico not found');
  console.log('   Please create an ICO file manually or use an online converter');
  console.log('   You can convert the generated SVG to ICO using:');
  console.log('   - https://convertio.co/svg-ico/');
  console.log('   - https://www.icoconverter.com/');
} else {
  console.log('✅ icon.ico already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Convert the generated SVG files to PNG using an online converter');
console.log('2. Create an ICO file from one of the PNG files');
console.log('3. Run: npm run build');
console.log('4. Run: npm run dev'); 