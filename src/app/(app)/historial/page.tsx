
import HistoricalLogView from '@/components/historial/historical-log-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export default function HistoricalLogPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <History className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registro Quirúrgico Histórico</CardTitle>
            <CardDescription className="text-md">
              Consulta y descarga el historial de atenciones pasadas. Selecciona un rango de fechas.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <HistoricalLogView />
        </CardContent>
      </Card>
    </div>
  );
}
