'use client';

import DailyLog from '@/components/agenda/daily-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';
import { useState, useEffect } from 'react'; // Import useEffect and useState

export default function DailyLogPage() {
  const [todayString, setTodayString] = useState('');

  useEffect(() => {
    // This code runs only on the client, preventing hydration mismatch
    setTodayString(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <ListChecks className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registro Quirúrgico de Hoy</CardTitle>
            <CardDescription className="text-md">
              {todayString ? `Lista de todas las cirugías y procedimientos programados para ${todayString}.` : 'Cargando fecha...'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DailyLog />
        </CardContent>
      </Card>
    </div>
  );
}
