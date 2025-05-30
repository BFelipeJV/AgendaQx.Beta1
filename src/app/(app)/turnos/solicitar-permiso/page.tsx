
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function RequestPermissionPage() {
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Construction className="h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Solicitud de Permisos y Cambios de Turno</CardTitle>
          <CardDescription className="text-md">
            Esta funcionalidad está actualmente en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Próximamente podrás solicitar permisos o cambios de turno directamente desde esta sección.
            Por favor, contacta al coordinador de turnos (admin) para cualquier gestión mientras tanto.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
