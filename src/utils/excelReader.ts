import * as XLSX from 'xlsx';

// Funktion för att undersöka kolumnnamnen i Excel-filen
export async function analyzeExcelFile(filePath: string): Promise<string[]> {
  try {
    // Hämta Excel-filen
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    
    // Läs in Excel-filen
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Anta att första arbetsbladet innehåller datan
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Konvertera till JSON för att se strukturen
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Returnera kolumnnamnen från första raden
    if (jsonData.length > 0) {
      return Object.keys(jsonData[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Fel vid analys av Excel-fil:', error);
    return [];
  }
} 