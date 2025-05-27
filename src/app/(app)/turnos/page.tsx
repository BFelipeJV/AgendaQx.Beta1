
import ShiftCalendarView from '@/components/turnos/shift-calendar-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';

export default function ShiftCalendarPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Calendario de Turnos de Cirujanos</CardTitle>
            <CardDescription className="text-md">
              Visualiza y gestiona la asignación de turnos para los cirujanos.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ShiftCalendarView />
        </CardContent>
      </Card>
    </div>
  );
}
