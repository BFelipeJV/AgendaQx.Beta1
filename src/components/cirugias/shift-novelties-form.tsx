
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Hourglass, User, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const isDev = process.env.NODE_ENV !== 'production';

const shiftNoveltySchema = z.object({
  comentarioNovedad: z.string().min(1, { message: 'El comentario o novedad es obligatorio.' }).max(2000, {message: 'El comentario no puede exceder los 2000 caracteres.'}),
});

type ShiftNoveltyFormValues = z.infer<typeof shiftNoveltySchema>;

export default function ShiftNoveltiesForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const surgeonName = "Dr. Ejemplo (Sesión)"; // Placeholder, replace with actual session data

  useEffect(() => {
    const now = new Date();
    setCurrentDateTime(now.toLocaleString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }));
  }, []);


  const form = useForm<ShiftNoveltyFormValues>({
    resolver: zodResolver(shiftNoveltySchema),
    defaultValues: {
      comentarioNovedad: '',
    },
  });

  async function onSubmit(values: ShiftNoveltyFormValues) {
    setIsSubmitting(true);
    const submissionData = {
      ...values,
      fechaHora: new Date().toISOString(), // Actual submission timestamp
      cirujano: surgeonName,
    }
    if (isDev) console.log('Datos de Novedad del Turno:', submissionData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Novedad Registrada',
      description: 'La novedad del turno ha sido guardada exitosamente.',
      action: (
        <div className="flex items-center text-green-500">
          <CheckCircle className="mr-2 h-5 w-5" />
          <span>Éxito</span>
        </div>
      )
    });
    form.reset();
    // Optionally, refresh dateTime for next entry if user stays on page
    const now = new Date();
     setCurrentDateTime(now.toLocaleString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }));
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Fecha y Hora:</span>
                <span className="text-sm font-medium text-foreground">{currentDateTime || 'Cargando...'}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Cirujano de Turno:</span>
                <span className="text-sm font-medium text-foreground">{surgeonName}</span>
            </div>
        </div>
        
        <FormField
          control={form.control}
          name="comentarioNovedad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario / Novedad *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describa la novedad o comentario relevante del turno..."
                  {...field}
                  rows={6}
                  maxLength={2000}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Máximo 2000 caracteres.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Hourglass className="mr-2 h-5 w-5 animate-spin" />
              Registrando Novedad...
            </>
          ) : (
            <>
             <CheckCircle className="mr-2 h-5 w-5" />
             Registrar Novedad
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

    