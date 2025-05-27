
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/hooks/use-toast';
import { useState, type FormEvent } from 'react'; 
import { LogIn } from 'lucide-react';


const loginSchema = z.object({
  email: z.string().email({ message: 'Dirección de correo electrónico inválida.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Define a type for the stored user for clarity (should match UserRegistrationForm's StoredUser if defined there)
interface StoredUser {
  nombreCompleto: string;
  email: string;
  password: string; // In a real app, this would be a hashed password
  rol: 'cirujano' | 'administrador';
}

const MOCK_USERS_STORAGE_KEY = 'mockRegisteredUsers';

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    let loggedIn = false;

    // --- Simulation: Check localStorage for the user ---
    // THIS IS NOT SECURE FOR PRODUCTION. For demonstration purposes only.
    try {
      const storedUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      const storedUsers: StoredUser[] = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];
      
      const foundUser = storedUsers.find(
        user => user.email === values.email && user.password === values.password
      );

      if (foundUser) {
        loggedIn = true;
        toast({
          title: 'Inicio de Sesión Exitoso',
          description: `Bienvenido, ${foundUser.nombreCompleto}. Redirigiendo al panel principal...`,
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error reading users from localStorage:", error);
      // Proceed to fallback or error
    }
    // --- End Simulation ---

    // Fallback to hardcoded admin if not logged in via localStorage
    if (!loggedIn && values.email === "admin@example.com" && values.password === "password") {
      loggedIn = true;
      toast({
        title: 'Inicio de Sesión Exitoso (Admin)',
        description: 'Redirigiendo al panel principal...',
      });
      router.push('/dashboard');
    }
    
    if (!loggedIn) {
      toast({
        title: 'Inicio de Sesión Fallido',
        description: 'Correo electrónico o contraseña inválidos.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
    // If loggedIn is true, navigation already happened, so no need to setIsLoading(false) here for the success case.
  }
  
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nombre@ejemplo.com" {...field} disabled={isLoading} />
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
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href="#" className="font-medium text-primary hover:underline">
                Contactar Soporte
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
