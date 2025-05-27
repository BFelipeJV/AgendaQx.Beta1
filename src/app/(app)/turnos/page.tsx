
'use client';

import ShiftCalendarView from '@/components/turnos/shift-calendar-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function ShiftCalendarPage() {
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>();

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Calendario de Turnos de Cirujanos</CardTitle>
            <CardDescription className="text-md">
              Visualiza y gestiona la asignación de turnos para los cirujanos. Haz clic en un día para seleccionarlo.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <Button 
              onClick={() => {
                if (selectedCalendarDate) {
                  // In the future, open a modal or navigate to an assignment page
                  console.log('Asignar turno para:', selectedCalendarDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
                  // alert(`Próximamente: Asignar turno para ${selectedCalendarDate.toLocaleDateString('es-ES')}`);
                }
              }}
              disabled={!selectedCalendarDate}
              className="h-11 text-base w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Asignar Turno a Fecha (Próximamente)
            </Button>
            {selectedCalendarDate && (
              <p className="text-sm text-muted-foreground border border-dashed border-border p-2 rounded-md">
                Fecha seleccionada: <span className="font-semibold text-foreground">{selectedCalendarDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            )}
          </div>
          <ShiftCalendarView 
            selectedDate={selectedCalendarDate}
            onDateSelect={setSelectedCalendarDate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
