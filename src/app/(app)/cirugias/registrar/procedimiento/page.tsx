
import SurgeryRegistrationForm from '@/components/cirugias/surgery-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2 } from 'lucide-react'; // Changed icon

export default function RegisterSurgeryProcedurePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <FilePlus2 className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Cirugía o Procedimiento</CardTitle>
            <CardDescription className="text-md">
              Complete los detalles a continuación para añadir una nueva cirugía o procedimiento a la agenda.
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
