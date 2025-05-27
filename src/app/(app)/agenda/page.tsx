import ScheduleOverview from '@/components/agenda/schedule-overview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <CalendarDays className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Surgical Schedule Management</CardTitle>
            <CardDescription className="text-md">
              View, add, or modify surgical appointments. (Calendar view placeholder)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ScheduleOverview />
        </CardContent>
      </Card>
    </div>
  );
}
