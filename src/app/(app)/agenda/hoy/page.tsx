
'use client';

import DailyLog from '@/components/agenda/daily-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function DailyLogPage() {
  const [todayString, setTodayString] = useState('');
  const logRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = async () => {
    if (!logRef.current) return;
    const canvas = await html2canvas(logRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('hoja_diaria.pdf');
  };

  useEffect(() => {
    setTodayString(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Hoja Diaria</CardTitle>
            <CardDescription className="text-md">
              {todayString ? `Resumen de actividades para ${todayString}.` : 'Cargando fecha...'}
            </CardDescription>
          </div>
          <Button onClick={handleDownloadPdf} className="ml-auto" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Descargar PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div ref={logRef}>
            <DailyLog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

