
import ShiftNoveltiesForm from '@/components/cirugias/shift-novelties-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardEdit } from 'lucide-react';

export default function RegisterShiftNoveltiesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <ClipboardEdit className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Novedades del Turno</CardTitle>
            <CardDescription className="text-md">
              Anote cualquier evento o información relevante ocurrida durante el turno.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ShiftNoveltiesForm />
        </CardContent>
      </Card>
    </div>
  );
}

    