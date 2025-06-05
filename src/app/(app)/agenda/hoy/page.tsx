
'use client';

import DailyLog, { DailyLogRef } from '@/components/agenda/daily-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function DailyLogPage() {
  const [todayString, setTodayString] = useState('');
  const dailyLogRef = useRef<DailyLogRef>(null);

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
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => dailyLogRef.current?.endShift()}>
            Terminar Turno
          </Button>
        </CardHeader>
        <CardContent>
          <DailyLog ref={dailyLogRef} />
        </CardContent>
      </Card>
    </div>
  );
}

