
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const isDev = process.env.NODE_ENV !== 'production';

const pendingSurgerySchema = z.object({
  tipoIntervencion: z.enum(['cirugia', 'procedimiento'], {
    required_error: 'Debe seleccionar el tipo de intervención.',
  }),
  nombrePaciente: z.string().min(2, { message: 'El nombre del paciente debe tener al menos 2 caracteres.' }),
  edad: z.coerce.number({ invalid_type_error: 'La edad debe ser un número.' }).int().positive({ message: 'La edad debe ser un número positivo.' }).min(0, { message: 'La edad no puede ser negativa.' }),
  rut: z.string().min(7, { message: 'El RUT debe tener al menos 7 caracteres.' }).regex(/^[0-9Kk.-]+$/, { message: 'RUT inválido.'}),
  diagnostico: z.string().min(1, { message: 'El diagnóstico es obligatorio.' }),
  comentarios: z.string().optional(),
});

type PendingSurgeryFormValues = z.infer<typeof pendingSurgerySchema>;

export default function PendingSurgeryForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PendingSurgeryFormValues>({
    resolver: zodResolver(pendingSurgerySchema),
    defaultValues: {
      tipoIntervencion: undefined,
      nombrePaciente: '',
      edad: undefined,
      rut: '',
      diagnostico: '',
      comentarios: '',
    },
  });

  async function onSubmit(values: PendingSurgeryFormValues) {
    setIsSubmitting(true);
    if (isDev) console.log('Datos de Cirugía Pendiente:', values);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Registro Actualizado',
      description: `La información del ${values.tipoIntervencion} pendiente para ${values.nombrePaciente} ha sido guardada.`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="tipoIntervencion"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Intervención a Realizar *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                  disabled={isSubmitting}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cirugia" />
                    </FormControl>
                    <FormLabel className="font-normal">Cirugía</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="procedimiento" />
                    </FormControl>
                    <FormLabel className="font-normal">Procedimiento</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombrePaciente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Paciente *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Carlos Soto" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT del Paciente *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 11.222.333-4" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="edad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ej: 50" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="diagnostico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnóstico Principal *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Colecistitis crónica calculosa" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comentarios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios Adicionales</FormLabel>
              <FormControl>
                <Textarea placeholder="Observaciones sobre el caso, examenes pendientes, etc. (opcional)..." {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Hourglass className="mr-2 h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
             <CheckCircle className="mr-2 h-5 w-5" />
             Guardar Información Pendiente
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
