
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
    // Aquí iría la lógica para registrar el usuario (e.g., llamada a Firebase Auth)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular API
    
    toast({
      title: 'Usuario Registrado (Simulación)',
      description: `El usuario ${values.nombreCompleto} ha sido registrado con el rol de ${values.rol}.`,
      action: (
        <div className="flex items-center text-green-500">
          <CheckCircle className="mr-2 h-5 w-5" />
          <span>Éxito</span>
        </div>
      )
    });
    form.reset();
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
