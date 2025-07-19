// Skript för att konvertera SVG till PNG
// För att köra detta skript, installera först:
// npm install sharp fs-extra

import fs from 'fs-extra';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Få sökvägen till aktuell mapp
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function convertSvgToPng() {
  try {
    // Läs in SVG-filen
    const svgBuffer = fs.readFileSync(join(__dirname, 'public', 'favicon.svg'));
    
    // Konvertera till PNG med olika storlekar
    const sizes = [16, 32, 48, 64, 128, 256];
    
    console.log('Konverterar SVG till PNG...');
    
    // Skapa temp-mapp om den inte finns
    const tempDir = join(__dirname, 'temp');
    fs.ensureDirSync(tempDir);
    
    // Konvertera till olika storlekar
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(tempDir, `favicon-${size}.png`));
      
      console.log(`Skapade ${size}x${size} PNG`);
    }
    
    console.log('Konvertering klar!');
    console.log('');
    console.log('För att skapa en ICO-fil från dessa PNG-filer:');
    console.log('1. Installera png2ico: npm install -g png2ico');
    console.log('2. Kör: png2ico public/favicon.ico temp/favicon-*.png');
    console.log('');
    console.log('Eller använd ett online-verktyg:');
    console.log('1. Gå till https://www.icoconverter.com/');
    console.log('2. Ladda upp PNG-filerna från temp-mappen');
    console.log('3. Ladda ner ICO-filen och spara som public/favicon.ico');
  } catch (error) {
    console.error('Ett fel uppstod:', error);
  }
}

convertSvgToPng(); 