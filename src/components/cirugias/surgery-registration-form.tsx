
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
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { CheckCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const surgeryRegistrationSchema = z.object({
  tipoIntervencion: z.enum(['cirugia', 'procedimiento'], {
    required_error: 'Debe seleccionar el tipo de intervención.',
  }),
  nombrePaciente: z.string().min(2, { message: 'El nombre del paciente debe tener al menos 2 caracteres.' }),
  edad: z.coerce.number({ invalid_type_error: 'La edad debe ser un número.' }).int().positive({ message: 'La edad debe ser un número positivo.' }).min(0, { message: 'La edad no puede ser negativa.' }),
  rut: z.string().min(7, { message: 'El RUT debe tener al menos 7 caracteres.' }).regex(/^[0-9Kk.-]+$/, { message: 'RUT inválido.'}),
  ubicacionCama: z.string().min(1, { message: 'La ubicación/cama es obligatoria.' }),
  cirugiaProcedimientoRealizado: z.string().min(3, { message: 'El nombre de la cirugía o procedimiento es obligatorio.' }),
  diagnostico: z.string().optional(),
  diagnosticoPreoperatorio: z.string().min(1, { message: 'El diagnóstico pre-operatorio es obligatorio.' }),
  diagnosticoPostoperatorio: z.string().min(1, { message: 'El diagnóstico post-operatorio es obligatorio.' }),
  tratamiento: z.string().optional(),
  comentariosAdicionales: z.string().optional(),
});

type SurgeryRegistrationFormValues = z.infer<typeof surgeryRegistrationSchema>;

export default function SurgeryRegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SurgeryRegistrationFormValues>({
    resolver: zodResolver(surgeryRegistrationSchema),
    defaultValues: {
      tipoIntervencion: undefined,
      nombrePaciente: '',
      edad: undefined,
      rut: '',
      ubicacionCama: '',
      cirugiaProcedimientoRealizado: '',
      diagnostico: '',
      diagnosticoPreoperatorio: '',
      diagnosticoPostoperatorio: '',
      tratamiento: '',
      comentariosAdicionales: '',
    },
  });

  async function onSubmit(values: SurgeryRegistrationFormValues) {
    setIsSubmitting(true);
    console.log('Datos de Registro Quirúrgico:', values);
    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Registro Exitoso',
      description: `El registro para ${values.nombrePaciente} ha sido guardado.`,
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
              <FormLabel>Tipo de Intervención *</FormLabel>
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
                <FormLabel>Nombre Completo del Paciente *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan Pérez Rodríguez" {...field} disabled={isSubmitting}/>
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
                  <Input placeholder="Ej: 12.345.678-K" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="edad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ej: 35" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ubicacionCama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación / Cama *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Sala 3, Cama 12" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="cirugiaProcedimientoRealizado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cirugía / Procedimiento Realizado *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Apendicectomía laparoscópica" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="diagnosticoPreoperatorio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnóstico Pre-operatorio *</FormLabel>
              <FormControl>
                <Textarea placeholder="Describa el diagnóstico pre-operatorio..." {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="diagnosticoPostoperatorio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnóstico Post-operatorio *</FormLabel>
              <FormControl>
                <Textarea placeholder="Describa el diagnóstico post-operatorio..." {...field} disabled={isSubmitting}/>
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
              <FormLabel>Diagnóstico (General)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles adicionales del diagnóstico (opcional)..." {...field} disabled={isSubmitting}/>
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
              <FormLabel>Tratamiento</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles del tratamiento (opcional)..." {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comentariosAdicionales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios Adicionales</FormLabel>
              <FormControl>
                <Textarea placeholder="Cualquier otro comentario relevante (opcional)..." {...field} disabled={isSubmitting}/>
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
             Registrar
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

    