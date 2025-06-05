
'use client';

import type { StoredUser } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit3, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUsers, deleteUser as apiDeleteUser } from '@/lib/api';

export default function UserManagementTable() {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<StoredUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then(setUsers)
      .catch(error => {
        console.error('Error loading users:', error);
        toast({
          title: 'Error de Carga',
          description: 'No se pudieron cargar los usuarios.',
          variant: 'destructive',
        });
        setUsers([]);
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

  const handleEditUser = (email: string) => {
    // TODO: Implement full edit functionality (e.g., open a modal or navigate to an edit page)
    toast({
      title: "Editar Usuario (Próximamente)",
      description: `La funcionalidad completa para editar el usuario ${email} estará disponible pronto.`,
    });
  };

  const prepareDeleteUser = (user: StoredUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;

    apiDeleteUser(userToDelete.email)
      .then(() => {
        setUsers(users.filter(u => u.email !== userToDelete.email));
        toast({
          title: 'Usuario Eliminado',
          description: `El usuario ${userToDelete.nombreCompleto} ha sido eliminado exitosamente.`,
        });
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error al Eliminar',
          description: 'No se pudo eliminar el usuario.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      });
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-4">Cargando usuarios...</p>;
  }

  if (users.length === 0) {
    return (
        <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay usuarios registrados para mostrar.</p>
            <p className="text-sm text-muted-foreground mt-1">Puedes registrar nuevos usuarios en la sección "Registrar Nuevo Usuario".</p>
        </div>
    );
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
                <Button variant="destructive" size="sm" onClick={() => prepareDeleteUser(user)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar al usuario <span className="font-semibold">{userToDelete?.nombreCompleto}</span> ({userToDelete?.email})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive hover:bg-destructive/90">Eliminar Usuario</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
