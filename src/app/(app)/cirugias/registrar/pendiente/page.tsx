
import PendingSurgeryForm from '@/components/cirugias/pending-surgery-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileClock } from 'lucide-react';

export default function RegisterPendingSurgeryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <FileClock className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Cirugía o Procedimiento Pendiente</CardTitle>
            <CardDescription className="text-md">
              Actualice o ingrese información de procedimientos que están en espera o requieren seguimiento.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <PendingSurgeryForm />
        </CardContent>
      </Card>
    </div>
  );
}

    