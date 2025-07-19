// Skript för att skapa ICO-fil från PNG-filer
// För att köra detta skript, installera först:
// npm install png-to-ico fs-extra

import fs from 'fs-extra';
import pngToIco from 'png-to-ico';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Få sökvägen till aktuell mapp
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createIcoFile() {
  try {
    console.log('Skapar ICO-fil från PNG-filer...');
    
    // Sökvägar till PNG-filer
    const pngFiles = [
      join(__dirname, 'temp', 'favicon-16.png'),
      join(__dirname, 'temp', 'favicon-32.png'),
      join(__dirname, 'temp', 'favicon-48.png'),
      join(__dirname, 'temp', 'favicon-64.png')
    ];
    
    // Kontrollera att alla filer finns
    for (const file of pngFiles) {
      if (!fs.existsSync(file)) {
        console.error(`Filen ${file} hittades inte. Kör convert-svg-to-ico.js först.`);
        return;
      }
    }
    
    // Skapa ICO-fil
    const buffer = await pngToIco(pngFiles);
    
    // Spara ICO-filen
    fs.writeFileSync(join(__dirname, 'public', 'favicon.ico'), buffer);
    
    console.log('ICO-fil skapad och sparad som public/favicon.ico');
  } catch (error) {
    console.error('Ett fel uppstod:', error);
  }
}

createIcoFile(); 