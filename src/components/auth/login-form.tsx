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
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useToast } from '@/hooks/use-toast';
import { useState, type FormEvent } from 'react'; // Import FormEvent
import { LogIn } from 'lucide-react';


const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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

  // Placeholder onSubmit function
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure
    if (values.email === "admin@example.com" && values.password === "password") {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to dashboard...',
      });
      router.push('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }
  
  // Server action (alternative to API route, but for simplicity using client-side handler for now)
  // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   setIsLoading(true);
  //   const formData = new FormData(event.currentTarget);
  //   // const result = await loginUser(formData); // Your server action
  //   // Handle result...
  //   setIsLoading(false);
  // };


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} disabled={isLoading} />
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
                  <FormLabel>Password</FormLabel>
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="#" className="font-medium text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
