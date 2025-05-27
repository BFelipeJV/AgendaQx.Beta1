
'use client';

import type { Surgery } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Clock, UserCog, FileText, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dummy data for today's surgeries - adjust as needed for different sections
const allTodaysEntries: Surgery[] = [
  { id: 's001', patientName: 'Eleonora Vance', patientId: 'P007', procedureType: 'Bypass Coronario', surgeon: 'Dr. Pérez', date: new Date().toISOString().split('T')[0], time: '08:00', operatingRoom: 'Q-1', status: 'Scheduled' },
  { id: 's002', patientName: 'Marcos Cole', patientId: 'P008', procedureType: 'Reparación de Hernia', surgeon: 'Dr. López', date: new Date().toISOString().split('T')[0], time: '10:30', operatingRoom: 'Q-2', status: 'Completed' },
  { id: 's003', patientName: 'Lena Petrova', patientId: 'P009', procedureType: 'Cesárea', surgeon: 'Dr. García', date: new Date().toISOString().split('T')[0], time: '12:00', operatingRoom: 'Q-EMG', status: 'Scheduled' },
  { id: 's004', patientName: 'Raj Patel', patientId: 'P010', procedureType: 'Cirugía de Cataratas', surgeon: 'Dr. Lee', date: new Date().toISOString().split('T')[0], time: '14:00', operatingRoom: 'Q-3', status: 'Completed' }, // Changed to Completed for demo
  { id: 's005', patientName: 'Sofía Reyes', patientId: 'P011', procedureType: 'Amigdalectomía', surgeon: 'Dr. Pérez', date: new Date().toISOString().split('T')[0], time: '16:00', operatingRoom: 'Q-1', status: 'Scheduled' },
];

// Placeholder data for other sections
const nonSurgicalPatients = [
  { id: 'ns001', name: 'Ana Torres', diagnosis: 'Neumonía', attending: 'Dra. Vega' },
  { id: 'ns002', name: 'Luis Rivas', diagnosis: 'Gastroenteritis', attending: 'Dr. Campos' },
];

const shiftNovelties = [
  { id: 'nv001', time: '09:15', text: 'Se retrasó cirugía de P007 por falta de material.', reportedBy: 'Enf. Carla Soto' },
  { id: 'nv002', time: '13:00', text: 'Paciente P009 presentó reacción alérgica leve post-operatoria.', reportedBy: 'Dr. García' },
];


const PatientCard = ({ surgery }: { surgery: Surgery }) => {
  let statusIcon, statusText, statusColorClass;
  switch (surgery.status) {
    case 'Scheduled':
      statusIcon = <Clock className="mr-2 h-4 w-4 text-blue-500" />;
      statusText = 'Programada';
      statusColorClass = 'border-blue-500';
      break;
    case 'Completed':
      statusIcon = <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
      statusText = 'Completada';
      statusColorClass = 'border-green-500';
      break;
    case 'Cancelled':
      statusIcon = <XCircle className="mr-2 h-4 w-4 text-red-500" />;
      statusText = 'Cancelada';
      statusColorClass = 'border-red-500';
      break;
    default:
      statusIcon = null;
      statusText = surgery.status;
      statusColorClass = 'border-muted';
  }

  return (
    <Card className={cn("mb-3 shadow-md hover:shadow-lg transition-shadow", statusColorClass)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{surgery.procedureType}</CardTitle>
            <CardDescription>Paciente: {surgery.patientName} (ID: {surgery.patientId})</CardDescription>
          </div>
          <Badge variant={surgery.status === 'Cancelled' ? 'destructive' : 'outline'} className={cn("capitalize text-sm py-1 px-2", 
            {"text-blue-700 bg-blue-100 border-blue-300": surgery.status === 'Scheduled'},
            {"text-green-700 bg-green-100 border-green-300": surgery.status === 'Completed'},
            // destructive variant handles its own colors
          )}>
             {statusIcon} {statusText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p><strong>Hora:</strong> {surgery.time}</p>
        <p><strong>Cirujano:</strong> {surgery.surgeon}</p>
        <p><strong>Quirófano:</strong> {surgery.operatingRoom}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-3">
        <Button variant="outline" size="sm"><Edit3 className="mr-1 h-3 w-3" /> Editar</Button>
        {surgery.status === 'Scheduled' && <Button variant="destructive" size="sm"><Trash2 className="mr-1 h-3 w-3" /> Cancelar</Button>}
      </CardFooter>
    </Card>
  );
};

const NonSurgicalPatientCard = ({ patient }: { patient: typeof nonSurgicalPatients[0] }) => (
  <Card className="mb-3 shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="pb-2">
        <CardTitle className="text-lg">{patient.name}</CardTitle>
        <CardDescription>Atendido por: {patient.attending}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
    </CardContent>
    <CardFooter className="flex justify-end gap-2 pt-3">
       <Button variant="outline" size="sm"><Edit3 className="mr-1 h-3 w-3" /> Ver Detalles</Button>
    </CardFooter>
  </Card>
);

const NoveltyCard = ({ novelty }: { novelty: typeof shiftNovelties[0] }) => (
  <Card className="mb-3 shadow-md hover:shadow-lg transition-shadow">
     <CardHeader className="pb-2">
        <CardTitle className="text-lg">Novedad a las {novelty.time}</CardTitle>
        <CardDescription>Reportada por: {novelty.reportedBy}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      <p>{novelty.text}</p>
    </CardContent>
     <CardFooter className="flex justify-end gap-2 pt-3">
       <Button variant="outline" size="sm"><Edit3 className="mr-1 h-3 w-3" /> Ver/Editar</Button>
    </CardFooter>
  </Card>
);


export default function DailyLog() {
  const scheduledSurgeries = allTodaysEntries.filter(s => s.status === 'Scheduled');
  const completedSurgeries = allTodaysEntries.filter(s => s.status === 'Completed');
  // const cancelledSurgeries = allTodaysEntries.filter(s => s.status === 'Cancelled'); // Could be another section

  const accordionSections = [
    { 
      id: 'operados', 
      title: 'Pacientes Operados', 
      icon: CheckCircle, 
      data: completedSurgeries, 
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} /> ,
      emptyText: "No hay pacientes registrados como operados hoy."
    },
    { 
      id: 'no-quirurgicos', 
      title: 'Pacientes No Quirúrgicos', 
      icon: UserCog, 
      data: nonSurgicalPatients, 
      renderItem: (item: typeof nonSurgicalPatients[0]) => <NonSurgicalPatientCard key={item.id} patient={item} />,
      emptyText: "No hay pacientes no quirúrgicos registrados hoy."
    },
    { 
      id: 'pendientes', 
      title: 'Pendientes por Operar', 
      icon: Clock, 
      data: scheduledSurgeries, 
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} />,
      emptyText: "No hay cirugías pendientes programadas para hoy."
    },
    { 
      id: 'novedades', 
      title: 'Novedades', 
      icon: FileText, 
      data: shiftNovelties, 
      renderItem: (item: typeof shiftNovelties[0]) => <NoveltyCard key={item.id} novelty={item} />,
      emptyText: "No hay novedades registradas para el turno de hoy."
    },
  ];

  if (allTodaysEntries.length === 0 && nonSurgicalPatients.length === 0 && shiftNovelties.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay registros para hoy.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full space-y-4" defaultValue={['pendientes']}>
      {accordionSections.map((section) => (
        <AccordionItem value={section.id} key={section.id} className="border rounded-lg shadow-md bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
            <div className="flex items-center text-lg font-semibold text-primary">
              <section.icon className="mr-3 h-6 w-6" />
              {section.title}
            </div>
            <Plus className="h-6 w-6 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-45" />
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 border-t bg-background">
            {section.data && section.data.length > 0 ? (
              section.data.map(item => section.renderItem(item as any)) // Cast 'as any' for simplicity with different item types
            ) : (
              <p className="text-muted-foreground italic">{section.emptyText}</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
