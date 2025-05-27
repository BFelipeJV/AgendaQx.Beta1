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
import { CalendarIcon, CheckCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const surgerySchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  patientId: z.string().min(1, { message: 'Patient ID is required.' }),
  procedureType: z.string().min(3, { message: 'Procedure type is required.' }),
  surgeon: z.string().min(3, { message: 'Surgeon name is required.' }),
  date: z.date({ required_error: 'Surgery date is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid time format (HH:MM).' }),
  operatingRoom: z.string().min(1, { message: 'Operating room is required.' }),
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
      time: '09:00', // Default time
      operatingRoom: '',
    },
  });

  async function onSubmit(values: SurgeryFormValues) {
    setIsSubmitting(true);
    console.log('Surgery Registration Data:', values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Surgery Registered',
      description: `Surgery for ${values.patientName} has been successfully scheduled.`,
      action: (
        <div className="flex items-center text-green-500">
          <CheckCircle className="mr-2 h-5 w-5" />
          <span>Success</span>
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
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} disabled={isSubmitting}/>
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
                <FormLabel>Patient ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., P123456789" {...field} disabled={isSubmitting}/>
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
              <FormLabel>Procedure Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Appendectomy" {...field} disabled={isSubmitting}/>
              </FormControl>
              <FormDescription>Specify the type of surgical procedure.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="surgeon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surgeon</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select surgeon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                  <SelectItem value="Dr. Jones">Dr. Jones</SelectItem>
                  <SelectItem value="Dr. Garcia">Dr. Garcia</SelectItem>
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
                <FormLabel>Surgery Date</FormLabel>
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
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || isSubmitting} // Disable past dates
                      initialFocus
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
                <FormLabel>Surgery Time (HH:MM)</FormLabel>
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
              <FormLabel>Operating Room</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operating room" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OR-1">Operating Room 1</SelectItem>
                  <SelectItem value="OR-2">Operating Room 2</SelectItem>
                  <SelectItem value="OR-3">Operating Room 3</SelectItem>
                  <SelectItem value="OR-EMG">Emergency OR</SelectItem>
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
              Submitting...
            </>
          ) : (
            <>
             <CheckCircle className="mr-2 h-5 w-5" />
             Register Surgery
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
