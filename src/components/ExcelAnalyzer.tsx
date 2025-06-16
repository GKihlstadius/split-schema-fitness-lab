import React, { useState, useEffect } from 'react';
import { analyzeExcelFile } from '@/utils/excelReader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ExcelAnalyzer() {
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const analyzeFile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const columnNames = await analyzeExcelFile('/LivsmedelsDB_202506161528.xlsx');
      setColumns(columnNames);
    } catch (err) {
      setError('Kunde inte analysera Excel-filen. Kontrollera att filen finns och är korrekt formaterad.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Excel-filanalys</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={analyzeFile} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Analyserar...' : 'Analysera Excel-fil'}
        </Button>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        {columns.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Hittade kolumner:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {columns.map((column, index) => (
                <li key={index}>{column}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 