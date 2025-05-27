
'use client';

import type { Surgery, NonSurgicalPatient, ShiftNovelty } from '@/lib/types';
import { MOCK_SURGERIES_STORAGE_KEY } from '@/lib/constants';
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
import { differenceInHours, parseISO, isValid, isToday } from 'date-fns';

// Dummy data for other sections (will be replaced if localStorage has data for them)
const initialNonSurgicalPatientsData: NonSurgicalPatient[] = [
  { id: 'ns001', name: 'Ana Torres', diagnosis: 'Neumonía', attending: 'Dra. Vega', entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString() },
  { id: 'ns002', name: 'Luis Rivas', diagnosis: 'Gastroenteritis', attending: 'Dr. Campos', entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 26)).toISOString() },
];

const initialShiftNoveltiesData: ShiftNovelty[] = [
  { id: 'nv001', time: '09:15', text: 'Se retrasó cirugía de P007 por falta de material.', reportedBy: 'Enf. Carla Soto', entryTimestamp: new Date().toISOString() },
  { id: 'nv002', time: '13:00', text: 'Paciente P009 presentó reacción alérgica leve post-operatoria.', reportedBy: 'Dr. García', entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
];


interface PatientCardProps {
  surgery: Surgery;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, surgeryId: string, currentStatus: Surgery['status']) => void;
  onEdit: (surgeryId: string, entryTimestamp: string) => void;
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
            <CardDescription>Paciente: {surgery.patientName} (ID: {surgery.patientId || 'N/A'})</CardDescription>
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
        <p><strong>Hora:</strong> {surgery.time || 'N/A'}</p>
        <p><strong>Cirujano:</strong> {surgery.surgeon || 'N/A'}</p>
        <p><strong>Quirófano/Cama:</strong> {surgery.operatingRoom || surgery.ubicacionCama || 'N/A'}</p>
        <p><strong>Edad:</strong> {surgery.edad || 'N/A'}</p>
        <p><strong>Diag. Pre-Op:</strong> {surgery.diagnosticoPreOperatorio || 'N/A'}</p>
        <p><strong>Diag. Post-Op:</strong> {surgery.diagnosticoPostOperatorio || 'N/A'}</p>
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
    patient: NonSurgicalPatient;
    onEdit: (patientId: string, entryTimestamp: string) => void;
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
    novelty: ShiftNovelty;
    onEdit: (noveltyId: string, entryTimestamp: string) => void;
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
  const [todaysSurgeries, setTodaysSurgeries] = useState<Surgery[]>([]);
  const [nonSurgicalPatients, setNonSurgicalPatients] = useState<NonSurgicalPatient[]>(initialNonSurgicalPatientsData);
  const [shiftNovelties, setShiftNovelties] = useState<ShiftNovelty[]>(initialShiftNoveltiesData);
  const [draggingOver, setDraggingOver] = useState<Surgery['status'] | null>(null);

  useEffect(() => {
    try {
      const storedSurgeriesJSON = localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY);
      if (storedSurgeriesJSON) {
        const allStoredSurgeries: Surgery[] = JSON.parse(storedSurgeriesJSON);
        const todayFilteredSurgeries = allStoredSurgeries.filter(surgery => 
            surgery.date && isToday(parseISO(surgery.date))
        );
        setTodaysSurgeries(todayFilteredSurgeries);
        console.log("Cirugías cargadas de localStorage:", todayFilteredSurgeries);
      } else {
        console.log("No hay cirugías en localStorage.");
      }
    } catch (error) {
      console.error("Error loading surgeries from localStorage:", error);
      toast({
        title: "Error de Carga",
        description: "No se pudieron cargar las cirugías guardadas.",
        variant: "destructive",
      });
    }
    // Placeholder: Load non-surgical and novelties from their respective localStorage keys if implemented
  }, [toast]);

  const saveSurgeriesToLocalStorage = (updatedTodaysSurgeries: Surgery[]) => {
    try {
      const storedSurgeriesJSON = localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY);
      let allSurgeries: Surgery[] = storedSurgeriesJSON ? JSON.parse(storedSurgeriesJSON) : [];
      
      const updatedTodayIds = new Set(updatedTodaysSurgeries.map(s => s.id));
      
      allSurgeries = allSurgeries.filter(s => {
        if (!s.date || !isToday(parseISO(s.date))) { // Keep non-today's surgeries
          return true;
        }
        return !updatedTodayIds.has(s.id); // Remove old versions of today's surgeries
      });
      allSurgeries.push(...updatedTodaysSurgeries); // Add new/updated versions of today's surgeries
      
      localStorage.setItem(MOCK_SURGERIES_STORAGE_KEY, JSON.stringify(allSurgeries));
      setTodaysSurgeries(updatedTodaysSurgeries); // Update local state for UI re-render
      console.log("Cirugías guardadas en localStorage:", allSurgeries);

    } catch (error) {
      console.error("Error saving surgeries to localStorage:", error);
      toast({
        title: "Error de Guardado",
        description: "No se pudieron guardar los cambios de las cirugías.",
        variant: "destructive",
      });
    }
  };

  const isEditable = (entryTimestamp?: string): boolean => {
    if (!entryTimestamp) {
      console.warn("isEditable: entryTimestamp is missing. Defaulting to not editable.");
      return false; 
    }
    const entryDate = parseISO(entryTimestamp);
    if (!isValid(entryDate)) {
      console.warn(`isEditable: entryTimestamp '${entryTimestamp}' is invalid. Defaulting to not editable.`);
      return false; 
    }
    const hoursDifference = differenceInHours(new Date(), entryDate);
    console.log(`isEditable: Timestamp: ${entryTimestamp}, Current Time: ${new Date().toISOString()}, Parsed Entry Date: ${entryDate.toISOString()}, Hours difference: ${hoursDifference}`);
    return hoursDifference <= 24;
  };

  const handleEdit = (itemId: string, itemType: string, entryTimestamp: string | undefined) => {
    console.log(`Attempting to edit ${itemType} ID: ${itemId} with timestamp: ${entryTimestamp}`);
    const editable = isEditable(entryTimestamp);

    if (editable) {
      toast({
        title: "Edición Permitida (Próximamente)",
        description: `Este registro ${itemType} (ID: ${itemId}) ES editable (creado/modificado en las últimas 24h). La funcionalidad completa de edición está pendiente.`,
        variant: "default",
      });
      console.log(`EDIT ACTION (Permitted): ${itemType} ID: ${itemId}, Timestamp: ${entryTimestamp}, Is Editable: ${editable}`);
    } else {
      toast({
        title: "Edición Bloqueada",
        description: `Este registro ${itemType} (ID: ${itemId}) NO es editable (han pasado más de 24h desde su creación/modificación o la fecha es inválida/faltante).`,
        variant: "destructive",
      });
      console.log(`EDIT ACTION (Blocked): ${itemType} ID: ${itemId}, Timestamp: ${entryTimestamp}, Is Editable: ${editable}`);
    }
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

    const newEntryTimestamp = new Date().toISOString();
    const updatedMappedSurgeries = todaysSurgeries.map(surgery =>
      surgery.id === draggedId ? { ...surgery, status: targetStatus, entryTimestamp: newEntryTimestamp } : surgery
    );
    saveSurgeriesToLocalStorage(updatedMappedSurgeries);
    toast({ title: "Estado Actualizado", description: `La cirugía ${draggedId} se movió a ${targetStatus === 'Completed' ? 'Pacientes Operados' : 'Pendientes por Operar'}. Fecha de modificación actualizada.`});
  };

  const scheduledSurgeries = todaysSurgeries.filter(s => s.status === 'Scheduled');
  const completedSurgeries = todaysSurgeries.filter(s => s.status === 'Completed');

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
      renderItem: (item: NonSurgicalPatient) => <NonSurgicalPatientCard key={item.id} patient={item} onEdit={(id, ts) => handleEdit(id, "el paciente no quirúrgico", ts)} />,
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
      renderItem: (item: ShiftNovelty) => <NoveltyCard key={item.id} novelty={item} onEdit={(id, ts) => handleEdit(id, "la novedad", ts)} />,
      emptyText: "No hay novedades registradas para el turno de hoy.",
      droppableStatus: null,
      navigationPath: '/cirugias/registrar/novedades-turno'
    },
  ];

  const noDataForAllSections = todaysSurgeries.length === 0 && nonSurgicalPatients.length === 0 && shiftNovelties.length === 0;

  if (noDataForAllSections) {
    return (
        <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No hay registros para hoy.</p>
            <Link href="/cirugias/registrar" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Registro de Atención
                </Button>
            </Link>
        </div>
    );
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
            <div className="ml-auto flex items-center">
                {section.navigationPath && (
                    <Link href={section.navigationPath} passHref legacyBehavior>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full mr-1 opacity-100 hover:opacity-100 data-[state=open]:opacity-100 data-[state=closed]:opacity-100"
                        onClick={(e) => e.stopPropagation()} 
                        aria-label={`Añadir a ${section.title}`}
                    >
                        <PlusCircle className="h-5 w-5" />
                    </Button>
                    </Link>
                )}
                {/* Chevron is now implicitly handled by AccordionTrigger styling from ShadCN */}
            </div>
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

