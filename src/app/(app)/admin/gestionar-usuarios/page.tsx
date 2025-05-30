
import UserManagementTable from '@/components/admin/user-management-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ManageUsersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Gestionar Usuarios</CardTitle>
            <CardDescription className="text-md">
              Ver, editar o eliminar usuarios existentes en la plataforma.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <UserManagementTable />
        </CardContent>
      </Card>
    </div>
  );
}
