import SurgeryRegistrationForm from '@/components/cirugias/surgery-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export default function RegisterSurgeryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <UserPlus className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Nueva Cirugía</CardTitle>
            <CardDescription className="text-md">
              Completa los detalles a continuación para añadir un nuevo procedimiento quirúrgico a la agenda.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SurgeryRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
