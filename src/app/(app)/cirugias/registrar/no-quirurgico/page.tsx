
import NonSurgicalRegistrationForm from '@/components/cirugias/non-surgical-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble } from 'lucide-react';

export default function RegisterNonSurgicalPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <BedDouble className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Ingreso Paciente No Quirúrgico</CardTitle>
            <CardDescription className="text-md">
              Complete los detalles para el ingreso de un paciente que no requiere cirugía.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <NonSurgicalRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}

    