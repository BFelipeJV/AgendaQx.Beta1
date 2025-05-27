
import UserRegistrationForm from '@/components/admin/user-registration-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export default function RegisterUserPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <UserPlus className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registrar Nuevo Usuario</CardTitle>
            <CardDescription className="text-md">
              Complete los detalles a continuación para crear una nueva cuenta de usuario.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <UserRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
