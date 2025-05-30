
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
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, type FormEvent } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { APP_HEADER_TITLE } from '@/lib/constants'; // Using the constant for "AGENDA QX"

const loginSchema = z.object({
  email: z.string().email({ message: 'Dirección de correo electrónico inválida.' }), // Still expecting email for logic
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }), // Min 1 for simplicity in example
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface StoredUser {
  nombreCompleto: string;
  email: string;
  password: string;
  rol: 'cirujano' | 'administrador';
}

const MOCK_USERS_STORAGE_KEY = 'mockRegisteredUsers';

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let loggedIn = false;
    let userName = '';

    try {
      const storedUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      const storedUsers: StoredUser[] = storedUsersJSON ? JSON.parse(storedUsersJSON) : [];
      
      const foundUser = storedUsers.find(
        user => user.email.toLowerCase() === values.email.toLowerCase() && user.password === values.password
      );

      if (foundUser) {
        loggedIn = true;
        userName = foundUser.nombreCompleto;
      }
    } catch (error) {
      console.error("Error reading users from localStorage:", error);
    }

    if (!loggedIn && values.email.toLowerCase() === "admin@example.com" && values.password === "password") {
      loggedIn = true;
      userName = "Administrador";
    }
    
    if (loggedIn) {
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: `Bienvenido, ${userName}. Redirigiendo...`,
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
    <Card className="w-full shadow-xl overflow-hidden">
      <div className="bg-primary text-primary-foreground py-6 px-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{APP_HEADER_TITLE}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Usuario</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="su.correo@ejemplo.com" 
                      {...field} 
                      disabled={isLoading}
                      className="h-11 border-primary/30 focus:border-primary"
                    />
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
                  <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Contraseña</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        {...field} 
                        disabled={isLoading}
                        className="h-11 pr-10 border-primary/30 focus:border-primary"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0 text-muted-foreground hover:text-primary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex items-center justify-between mt-2">
                <Link href="#" className="text-xs text-primary hover:underline">
                  Recupera tu contraseña
                </Link>
             </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-6 pb-6">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 w-full justify-start mb-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                      id="remember-me"
                    />
                  </FormControl>
                  <Label htmlFor="remember-me" className="text-xs font-normal text-muted-foreground cursor-pointer">
                    Recordar tu usuario y contraseña
                  </Label>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
              {isLoading ? 'INGRESANDO...' : 'ENTRAR'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
