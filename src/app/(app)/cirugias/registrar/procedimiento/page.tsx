
import SurgeryRegistrationForm from '@/components/cirugias/surgery-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react'; // Changed icon to Stethoscope for more general medical procedure

export default function RegisterSurgeryProcedurePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <Stethoscope className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Cirugía o Procedimiento</CardTitle>
            <CardDescription className="text-md">
              Complete los detalles a continuación para registrar una nueva intervención quirúrgica o procedimiento.
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

    