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
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { MOCK_NON_SURGICAL_STORAGE_KEY } from '@/lib/constants';

const nonSurgicalSchema = z.object({
  nombrePaciente: z.string().min(2, { message: 'El nombre del paciente debe tener al menos 2 caracteres.' }),
  edad: z.coerce.number({ invalid_type_error: 'La edad debe ser un número.' }).int().positive({ message: 'La edad debe ser un número positivo.' }).min(0, { message: 'La edad no puede ser negativa.' }),
  rut: z.string().min(7, { message: 'El RUT debe tener al menos 7 caracteres.' }).regex(/^[0-9Kk.-]+$/, { message: 'RUT inválido.'}),
  diagnostico: z.string().min(1, { message: 'El diagnóstico es obligatorio.' }),
  tratamiento: z.string().min(1, { message: 'El tratamiento es obligatorio.' }),
  comentarios: z.string().optional(),
});

type NonSurgicalFormValues = z.infer<typeof nonSurgicalSchema>;

export default function NonSurgicalRegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NonSurgicalFormValues>({
    resolver: zodResolver(nonSurgicalSchema),
    defaultValues: {
      nombrePaciente: '',
      edad: undefined,
      rut: '',
      diagnostico: '',
      tratamiento: '',
      comentarios: '',
    },
  });

  async function onSubmit(values: NonSurgicalFormValues) {
    setIsSubmitting(true);
    
    const now = new Date();
    const newNonSurgicalPatient = {
      id: `ns_${Date.now()}`,
      name: values.nombrePaciente,
      patientId: values.rut,
      edad: values.edad,
      diagnosis: values.diagnostico,
      tratamiento: values.tratamiento,
      comentarios: values.comentarios,
      entryTimestamp: now.toISOString(),
      attending: 'Dr. Asignado (Form.)', // Placeholder
      ubicacionCama: 'Por asignar' // Placeholder
    };

    console.log('Datos de Registro No Quirúrgico a Guardar:', newNonSurgicalPatient);

    try {
      const existingNonSurgicalJSON = localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY);
      let existingNonSurgical = [];
      
      if (existingNonSurgicalJSON && existingNonSurgicalJSON !== 'null' && existingNonSurgicalJSON !== 'undefined') {
        existingNonSurgical = JSON.parse(existingNonSurgicalJSON);
        console.log("Existing non-surgical patients:", existingNonSurgical);
      }

      existingNonSurgical.push(newNonSurgicalPatient);
      console.log("Updated non-surgical patients list:", existingNonSurgical);
      
      localStorage.setItem(MOCK_NON_SURGICAL_STORAGE_KEY, JSON.stringify(existingNonSurgical));
      
      toast({
        title: 'Registro Exitoso',
        description: `El ingreso no quirúrgico para ${values.nombrePaciente} ha sido guardado.`,
        action: (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Éxito</span>
          </div>
        )
      });
      form.reset();
    } catch (error) {
      console.error("Error saving non-surgical patient to localStorage:", error);
      toast({
        title: 'Error de Almacenamiento',
        description: 'No se pudo guardar el registro localmente. Intente de nuevo.',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombrePaciente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Paciente *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Ana González" {...field} disabled={isSubmitting}/>
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
                  <Input placeholder="Ej: 9.876.543-2" {...field} disabled={isSubmitting}/>
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
                  <Input type="number" placeholder="Ej: 42" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} disabled={isSubmitting}/>
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
              <FormLabel>Diagnóstico *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Neumonía comunitaria" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tratamiento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tratamiento Indicado *</FormLabel>
              <FormControl>
                <Textarea placeholder="Describa el tratamiento indicado..." {...field} disabled={isSubmitting}/>
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
                <Textarea placeholder="Cualquier observación o comentario adicional (opcional)..." {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Hourglass className="mr-2 h-5 w-5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
             <CheckCircle className="mr-2 h-5 w-5" />
             Registrar Ingreso
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

    