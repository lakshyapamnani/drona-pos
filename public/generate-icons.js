// Simple icon generator script
// Run this in your browser console or create actual PNG files using online tools

const sizes = [192, 512, 180, 32];
const names = ['pwa-192x192.png', 'pwa-512x512.png', 'apple-touch-icon.png', 'favicon.ico'];

console.log('To generate icons:');
console.log('1. Use https://realfavicongenerator.net/');
console.log('2. Use https://www.pwabuilder.com/imageGenerator');
console.log('3. Or open generate-icons.html in your browser');
console.log('');
console.log('Required files in /public folder:');
names.forEach(name => console.log(`  - ${name}`));
