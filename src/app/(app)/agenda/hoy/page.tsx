import DailyLog from '@/components/agenda/daily-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';

export default function DailyLogPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <ListChecks className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Today&apos;s Surgical Log</CardTitle>
            <CardDescription className="text-md">
              List of all surgeries and procedures scheduled for {today}.
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
