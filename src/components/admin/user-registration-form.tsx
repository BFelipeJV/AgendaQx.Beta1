
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, Hourglass, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const userRegistrationSchema = z.object({
  nombreCompleto: z.string().min(3, { message: 'El nombre completo debe tener al menos 3 caracteres.' }),
  email: z.string().email({ message: 'Dirección de correo electrónico inválida.' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  rol: z.enum(['cirujano', 'administrador'], { required_error: 'Debe seleccionar un rol.' }),
});

type UserRegistrationFormValues = z.infer<typeof userRegistrationSchema>;

// Define a type for the stored user for clarity
interface StoredUser extends UserRegistrationFormValues {}

const MOCK_USERS_STORAGE_KEY = 'mockRegisteredUsers';

export default function UserRegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      nombreCompleto: '',
      email: '',
      password: '',
      rol: undefined,
    },
  });

  async function onSubmit(values: UserRegistrationFormValues) {
    setIsSubmitting(true);
    console.log('Datos de Registro de Usuario:', values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- Simulation: Store user in localStorage ---
    // THIS IS NOT SECURE FOR PRODUCTION. For demonstration purposes only.
    try {
      const existingUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      const existingUsers: StoredUser[] = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];
      
      // Check if email already exists
      if (existingUsers.some(user => user.email === values.email)) {
        toast({
          title: 'Error de Registro',
          description: 'Este correo electrónico ya está registrado.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const newUser: StoredUser = { ...values };
      existingUsers.push(newUser);
      localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      
      toast({
        title: 'Usuario Registrado (Simulación Exitosa)',
        description: `El usuario ${values.nombreCompleto} ha sido registrado con el rol de ${values.rol}. Ahora puede iniciar sesión.`,
        action: (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Éxito</span>
          </div>
        )
      });
      form.reset();
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
      toast({
        title: 'Error de Almacenamiento',
        description: 'No se pudo guardar el usuario localmente. Intente de nuevo.',
        variant: 'destructive',
      });
    }
    // --- End Simulation ---
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombreCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Dr. Juan Pérez" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ejemplo@dominio.com" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña *</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cirujano">Cirujano</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-11 text-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Hourglass className="mr-2 h-5 w-5 animate-spin" />
              Registrando Usuario...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" />
              Registrar Usuario
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
