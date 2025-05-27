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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale for date-fns
import { CalendarIcon, CheckCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const surgerySchema = z.object({
  patientName: z.string().min(2, { message: 'El nombre del paciente debe tener al menos 2 caracteres.' }),
  patientId: z.string().min(1, { message: 'El ID del paciente es obligatorio.' }),
  procedureType: z.string().min(3, { message: 'El tipo de procedimiento es obligatorio.' }),
  surgeon: z.string().min(3, { message: 'El nombre del cirujano es obligatorio.' }),
  date: z.date({ required_error: 'La fecha de la cirugía es obligatoria.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato de hora inválido (HH:MM).' }),
  operatingRoom: z.string().min(1, { message: 'El quirófano es obligatorio.' }),
});

type SurgeryFormValues = z.infer<typeof surgerySchema>;

export default function SurgeryRegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SurgeryFormValues>({
    resolver: zodResolver(surgerySchema),
    defaultValues: {
      patientName: '',
      patientId: '',
      procedureType: '',
      surgeon: '',
      time: '09:00', // Hora predeterminada
      operatingRoom: '',
    },
  });

  async function onSubmit(values: SurgeryFormValues) {
    setIsSubmitting(true);
    console.log('Datos de Registro de Cirugía:', values);
    // Simular llamada API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Cirugía Registrada',
      description: `La cirugía para ${values.patientName} ha sido programada exitosamente.`,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Paciente</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan Pérez" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID del Paciente</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: P123456789" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="procedureType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Procedimiento</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Apendicectomía" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormDescription>Especifique el tipo de procedimiento quirúrgico.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="surgeon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cirujano</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cirujano" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                  <SelectItem value="Dr. Jones">Dr. Jones</SelectItem>
                  <SelectItem value="Dr. Garcia">Dr. García</SelectItem>
                  <SelectItem value="Dr. Lee">Dr. Lee</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Cirugía</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || isSubmitting} // Deshabilitar fechas pasadas
                      initialFocus
                      locale={es} // Spanish locale for calendar
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de Cirugía (HH:MM)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} disabled={isSubmitting}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="operatingRoom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quirófano</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar quirófano" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OR-1">Quirófano 1</SelectItem>
                  <SelectItem value="OR-2">Quirófano 2</SelectItem>
                  <SelectItem value="OR-3">Quirófano 3</SelectItem>
                  <SelectItem value="OR-EMG">Quirófano de Emergencia</SelectItem>
                </SelectContent>
              </Select>
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
             Registrar Cirugía
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
