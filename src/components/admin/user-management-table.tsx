
'use client';

// Placeholder component for User Management Table

import { StoredUser } from '@/lib/types';
import { MOCK_USERS_STORAGE_KEY } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Edit3, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserManagementTable() {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      if (storedUsersJSON) {
        setUsers(JSON.parse(storedUsersJSON));
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEditUser = (email: string) => {
    // TODO: Implement edit functionality (e.g., open a modal or navigate to an edit page)
    toast({
      title: "Editar Usuario (Próximamente)",
      description: `Funcionalidad para editar el usuario ${email} estará disponible pronto.`,
    });
  };

  const handleDeleteUser = (email: string) => {
    // TODO: Implement delete functionality (with confirmation)
    // This would involve updating localStorage and the local state
    toast({
      title: "Eliminar Usuario (Próximamente)",
      description: `Funcionalidad para eliminar el usuario ${email} estará disponible pronto.`,
      variant: "destructive"
    });
  };

  if (users.length === 0) {
    return <p className="text-muted-foreground">No hay usuarios registrados para mostrar.</p>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>Lista de usuarios registrados en el sistema.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell className="font-medium">{user.nombreCompleto}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.rol}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user.email)}>
                  <Edit3 className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.email)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
