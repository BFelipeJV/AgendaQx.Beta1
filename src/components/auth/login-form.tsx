
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
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { MOCK_USERS_STORAGE_KEY, CURRENT_USER_SESSION_KEY } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email({ message: 'Dirección de correo electrónico inválida.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface StoredUser {
  nombreCompleto: string;
  email: string;
  password?: string;
  rol: 'cirujano' | 'administrador';
}

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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    let loggedIn = false;
    let userToSession: StoredUser | null = null;

    // 1. Check localStorage
    try {
      const storedUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      const storedUsers: StoredUser[] = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];
      
      const foundUser = storedUsers.find(
        user => user.email.toLowerCase() === values.email.toLowerCase() && user.password === values.password
      );

      if (foundUser) {
        loggedIn = true;
        userToSession = foundUser;
      }
    } catch (error) {
      console.error("Error reading users from localStorage:", error);
    }

    // 2. If not found in localStorage, check default admin credentials
    if (!loggedIn && values.email.toLowerCase() === "admin@example.com" && values.password === "password") {
      loggedIn = true;
      userToSession = {
        nombreCompleto: "Administrador Principal",
        email: "admin@example.com",
        rol: "administrador",
        // No password stored for default admin in session for this example
      };
    }
    
    if (loggedIn && userToSession) {
      try {
        localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify({
          nombreCompleto: userToSession.nombreCompleto,
          email: userToSession.email,
          rol: userToSession.rol,
        }));
      } catch (error) {
        console.error("Error saving user session to localStorage:", error);
      }
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: `Bienvenido, ${userToSession.nombreCompleto}. Redirigiendo...`,
      });
      router.push('/dashboard'); 
    } else {
      toast({
        title: 'Inicio de Sesión Fallido',
        description: 'Usuario o contraseña inválidos.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }
  
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardDescription className="text-center text-sm">
          Por favor, inicia sesión para acceder a tu panel.
        </CardDescription>
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
                    <Input placeholder="su.correo@ejemplo.com" {...field} disabled={isLoading}/>
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
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
