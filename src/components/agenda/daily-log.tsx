
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
import { PlusCircle, CheckCircle, Clock, UserCog, FileText, Edit3, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { differenceInHours, parseISO, isValid } from 'date-fns';

// Dummy data for today's surgeries - adjust as needed for different sections
const initialTodaysEntries: Surgery[] = [
  { id: 's001', patientName: 'Eleonora Vance', patientId: 'P007', procedureType: 'Bypass Coronario', surgeon: 'Dr. Pérez', date: new Date().toISOString().split('T')[0], time: '08:00', operatingRoom: 'Q-1', status: 'Scheduled', entryTimestamp: new Date(new Date().setDate(new Date().getDate() -1)).toISOString() }, // Older than 24h
  { id: 's002', patientName: 'Marcos Cole', patientId: 'P008', procedureType: 'Reparación de Hernia', surgeon: 'Dr. López', date: new Date().toISOString().split('T')[0], time: '10:30', operatingRoom: 'Q-2', status: 'Completed', entryTimestamp: new Date().toISOString() }, // Recent
  { id: 's003', patientName: 'Lena Petrova', patientId: 'P009', procedureType: 'Cesárea', surgeon: 'Dr. García', date: new Date().toISOString().split('T')[0], time: '12:00', operatingRoom: 'Q-EMG', status: 'Scheduled', entryTimestamp: new Date().toISOString() },
  { id: 's004', patientName: 'Raj Patel', patientId: 'P010', procedureType: 'Cirugía de Cataratas', surgeon: 'Dr. Lee', date: new Date().toISOString().split('T')[0], time: '14:00', operatingRoom: 'Q-3', status: 'Completed', entryTimestamp: new Date(new Date().setDate(new Date().getDate() -2)).toISOString() }, // Older than 24h
  { id: 's005', patientName: 'Sofía Reyes', patientId: 'P011', procedureType: 'Amigdalectomía', surgeon: 'Dr. Pérez', date: new Date().toISOString().split('T')[0], time: '16:00', operatingRoom: 'Q-1', status: 'Scheduled', entryTimestamp: new Date().toISOString() },
];

// Placeholder data for other sections
const nonSurgicalPatientsData = [
  { id: 'ns001', name: 'Ana Torres', diagnosis: 'Neumonía', attending: 'Dra. Vega', entryTimestamp: new Date().toISOString() },
  { id: 'ns002', name: 'Luis Rivas', diagnosis: 'Gastroenteritis', attending: 'Dr. Campos', entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 26)).toISOString() }, // > 24h ago
];

const shiftNoveltiesData = [
  { id: 'nv001', time: '09:15', text: 'Se retrasó cirugía de P007 por falta de material.', reportedBy: 'Enf. Carla Soto', entryTimestamp: new Date().toISOString() },
  { id: 'nv002', time: '13:00', text: 'Paciente P009 presentó reacción alérgica leve post-operatoria.', reportedBy: 'Dr. García', entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() }, // Older
];


interface PatientCardProps {
  surgery: Surgery;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, surgeryId: string, currentStatus: Surgery['status']) => void;
  onEdit: (surgeryId: string, entryTimestamp?: string) => void;
}

const PatientCard = ({ surgery, onDragStart, onEdit }: PatientCardProps) => {
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
    <Card
      className={cn("mb-3 shadow-md hover:shadow-lg transition-shadow cursor-grab", statusColorClass)}
      draggable={true}
      onDragStart={(e) => onDragStart(e, surgery.id, surgery.status)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{surgery.procedureType}</CardTitle>
            <CardDescription>Paciente: {surgery.patientName} (ID: {surgery.patientId})</CardDescription>
          </div>
          <Badge variant={surgery.status === 'Cancelled' ? 'destructive' : 'outline'} className={cn("capitalize text-sm py-1 px-2",
            {"text-blue-700 bg-blue-100 border-blue-300": surgery.status === 'Scheduled'},
            {"text-green-700 bg-green-100 border-green-300": surgery.status === 'Completed'},
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
        <Button variant="outline" size="sm" onClick={() => onEdit(surgery.id, surgery.entryTimestamp)}>
            <Edit3 className="mr-1 h-3 w-3" /> Editar
        </Button>
      </CardFooter>
    </Card>
  );
};

interface NonSurgicalPatientCardProps {
    patient: typeof nonSurgicalPatientsData[0];
    onEdit: (patientId: string, entryTimestamp?: string) => void;
}

const NonSurgicalPatientCard = ({ patient, onEdit }: NonSurgicalPatientCardProps) => (
  <Card className="mb-3 shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="pb-2">
        <CardTitle className="text-lg">{patient.name}</CardTitle>
        <CardDescription>Atendido por: {patient.attending}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
    </CardContent>
    <CardFooter className="flex justify-end gap-2 pt-3">
       <Button variant="outline" size="sm" onClick={() => onEdit(patient.id, patient.entryTimestamp)}>
            <Edit3 className="mr-1 h-3 w-3" /> Editar
       </Button>
    </CardFooter>
  </Card>
);

interface NoveltyCardProps {
    novelty: typeof shiftNoveltiesData[0];
    onEdit: (noveltyId: string, entryTimestamp?: string) => void;
}

const NoveltyCard = ({ novelty, onEdit }: NoveltyCardProps) => (
  <Card className="mb-3 shadow-md hover:shadow-lg transition-shadow">
     <CardHeader className="pb-2">
        <CardTitle className="text-lg">Novedad a las {novelty.time}</CardTitle>
        <CardDescription>Reportada por: {novelty.reportedBy}</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      <p>{novelty.text}</p>
    </CardContent>
     <CardFooter className="flex justify-end gap-2 pt-3">
       <Button variant="outline" size="sm" onClick={() => onEdit(novelty.id, novelty.entryTimestamp)}>
            <Edit3 className="mr-1 h-3 w-3" /> Editar
       </Button>
    </CardFooter>
  </Card>
);


export default function DailyLog() {
  const { toast } = useToast();
  const [todaysEntries, setTodaysEntries] = useState<Surgery[]>(initialTodaysEntries);
  const [nonSurgicalPatients, setNonSurgicalPatients] = useState(nonSurgicalPatientsData);
  const [shiftNovelties, setShiftNovelties] = useState(shiftNoveltiesData);
  const [draggingOver, setDraggingOver] = useState<Surgery['status'] | null>(null);

  const isEditable = (entryTimestamp?: string): boolean => {
    if (!entryTimestamp) return true; // If no timestamp, assume editable (for now)
    const entryDate = parseISO(entryTimestamp);
    if (!isValid(entryDate)) return true; // If invalid date, assume editable
    return differenceInHours(new Date(), entryDate) <= 24;
  };

  const handleEdit = (itemId: string, itemType: string, entryTimestamp?: string) => {
    const editable = isEditable(entryTimestamp);
    let message = `Se intentó editar ${itemType} con ID: ${itemId}. `;
    if (editable) {
      message += "Este registro es editable (dentro de las 24h).";
    } else {
      message += "Este registro NO es editable (fuera de las 24h).";
    }
    message += " La funcionalidad de edición completa está pendiente.";

    toast({
      title: "Editar Registro (Próximamente)",
      description: message,
      variant: editable ? "default" : "destructive",
    });
    console.log(message);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, surgeryId: string, currentStatus: Surgery['status']) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: surgeryId, status: currentStatus }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetStatus: Surgery['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggingOver(targetStatus);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: Surgery['status']) => {
    e.preventDefault();
    setDraggingOver(null);
    const draggedItemData = e.dataTransfer.getData('application/json');
    if (!draggedItemData) return;

    const { id: draggedId, status: originalStatus } = JSON.parse(draggedItemData) as { id: string, status: Surgery['status']};

    if (originalStatus === 'Completed' && targetStatus === 'Scheduled') {
      toast({ title: "Acción no permitida", description: "Una cirugía completada no puede volver a 'Pendientes por Operar' mediante arrastre.", variant: "destructive"});
      return;
    }
    
    if (originalStatus === targetStatus) {
      return;
    }

    setTodaysEntries(prevEntries =>
      prevEntries.map(surgery =>
        surgery.id === draggedId ? { ...surgery, status: targetStatus, entryTimestamp: new Date().toISOString() } : surgery // Update timestamp on status change
      )
    );
    toast({ title: "Estado Actualizado", description: `La cirugía ${draggedId} se movió a ${targetStatus === 'Completed' ? 'Pacientes Operados' : 'Pendientes por Operar'}.`});
  };

  const scheduledSurgeries = todaysEntries.filter(s => s.status === 'Scheduled');
  const completedSurgeries = todaysEntries.filter(s => s.status === 'Completed');

  const accordionSections = [
    {
      id: 'operados',
      title: 'Pacientes Operados',
      icon: CheckCircle,
      data: completedSurgeries,
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "la cirugía", ts)} />,
      emptyText: "No hay pacientes registrados como operados hoy.",
      droppableStatus: 'Completed' as Surgery['status'],
      navigationPath: '/cirugias/registrar/procedimiento'
    },
    {
      id: 'no-quirurgicos',
      title: 'Pacientes No Quirúrgicos',
      icon: UserCog,
      data: nonSurgicalPatients,
      renderItem: (item: typeof nonSurgicalPatients[0]) => <NonSurgicalPatientCard key={item.id} patient={item} onEdit={(id, ts) => handleEdit(id, "el paciente no quirúrgico", ts)} />,
      emptyText: "No hay pacientes no quirúrgicos registrados hoy.",
      droppableStatus: null,
      navigationPath: '/cirugias/registrar/no-quirurgico'
    },
    {
      id: 'pendientes',
      title: 'Pendientes por Operar',
      icon: Clock,
      data: scheduledSurgeries,
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "la cirugía pendiente", ts)} />,
      emptyText: "No hay cirugías pendientes programadas para hoy.",
      droppableStatus: 'Scheduled' as Surgery['status'],
      navigationPath: '/cirugias/registrar/procedimiento'
    },
    {
      id: 'novedades',
      title: 'Novedades',
      icon: FileText,
      data: shiftNovelties,
      renderItem: (item: typeof shiftNovelties[0]) => <NoveltyCard key={item.id} novelty={item} onEdit={(id, ts) => handleEdit(id, "la novedad", ts)} />,
      emptyText: "No hay novedades registradas para el turno de hoy.",
      droppableStatus: null,
      navigationPath: '/cirugias/registrar/novedades-turno'
    },
  ];

  if (todaysEntries.length === 0 && nonSurgicalPatients.length === 0 && shiftNovelties.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay registros para hoy.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full space-y-4" defaultValue={['pendientes', 'operados']}>
      {accordionSections.map((section) => (
        <AccordionItem value={section.id} key={section.id} className="border rounded-lg shadow-md bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors group">
            <div className="flex items-center text-lg font-semibold text-primary">
              <section.icon className="mr-3 h-6 w-6" />
              {section.title}
            </div>
            {section.navigationPath && (
                <Link href={section.navigationPath} passHref legacyBehavior>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full ml-auto mr-2 group-data-[state=closed]:opacity-100 group-data-[state=open]:opacity-100" // Ensure button is always visible for click
                    onClick={(e) => e.stopPropagation()} 
                    aria-label={`Añadir a ${section.title}`}
                >
                    <PlusCircle className="h-5 w-5" />
                </Button>
                </Link>
            )}
            {/* The default ChevronDown from AccordionTrigger will be used here */}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
                "px-6 py-4 border-t bg-background min-h-[100px]",
                draggingOver === section.droppableStatus && section.droppableStatus && "bg-primary/10 border-primary border-dashed border-2"
             )}
            onDragOver={(e) => section.droppableStatus && handleDragOver(e, section.droppableStatus)}
            onDrop={(e) => section.droppableStatus && handleDrop(e, section.droppableStatus)}
            onDragLeave={section.droppableStatus ? handleDragLeave : undefined}
          >
            {section.data && section.data.length > 0 ? (
              section.data.map(item => section.renderItem(item as any))
            ) : (
              <p className="text-muted-foreground italic">{section.emptyText}</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
    
