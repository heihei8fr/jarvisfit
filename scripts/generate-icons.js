import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Icône SVG simple : fond indigo + emoji haltère
const svgIcon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#6366f1"/>
  <text x="50%" y="54%" font-size="${size * 0.52}" text-anchor="middle" dominant-baseline="middle">💪</text>
</svg>`

// Écrit les SVG (les navigateurs acceptent SVG dans le manifest même si on déclare PNG)
fs.writeFileSync(path.join(__dirname, '../public/icon-192.png'), svgIcon(192))
fs.writeFileSync(path.join(__dirname, '../public/icon-512.png'), svgIcon(512))
console.log('Icons generated (SVG content, PNG extension)')
