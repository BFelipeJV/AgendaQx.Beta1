
'use client';

import type { Surgery, NonSurgicalPatient, ShiftNovelty } from '@/lib/types';
import { MOCK_SURGERIES_STORAGE_KEY, MOCK_NON_SURGICAL_STORAGE_KEY, MOCK_NOVELTIES_STORAGE_KEY } from '@/lib/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle, Clock, UserCog, FileText, Edit3, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { differenceInHours, parseISO, isValid, isToday, format } from 'date-fns';

// --- More Descriptive Initial Dummy Data ---
const todayDateString = format(new Date(), 'yyyy-MM-dd');
const yesterdayDateString = format(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd');
const tomorrowDateString = format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

const initialSurgeriesData: Surgery[] = [
  { 
    id: 's001', 
    tipoIntervencion: 'cirugia', 
    patientName: 'Carlos Ruiz', 
    patientId: 'P001', 
    edad: 30, 
    ubicacionCama: 'Pabellón 1, Cama 101',
    procedureType: 'Apendicectomía', 
    diagnosticoPreOperatorio: 'Apendicitis Aguda', 
    diagnosticoPostOperatorio: 'Apendicitis Aguda Resuelta',
    surgeon: 'Dr. Pérez', 
    date: todayDateString, 
    time: '09:30', 
    operatingRoom: 'Q1', 
    status: 'Completed', 
    entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString() // 3 hours ago today
  },
  { 
    id: 's002', 
    tipoIntervencion: 'cirugia', 
    patientName: 'Laura Méndez', 
    patientId: 'P002', 
    edad: 45, 
    ubicacionCama: 'Pabellón 1, Cama 102',
    procedureType: 'Colecistectomía Laparoscópica', 
    diagnosticoPreOperatorio: 'Colelitiasis Sintomática',
    surgeon: 'Dra. González', 
    date: todayDateString, 
    time: '11:00', 
    operatingRoom: 'Q2', 
    status: 'Scheduled', 
    entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString() // 5 hours ago today
  },
  { 
    id: 's003', 
    tipoIntervencion: 'procedimiento', 
    patientName: 'Roberto Gómez', 
    patientId: 'P003', 
    edad: 55, 
    ubicacionCama: 'Sala Proc., Cama 201',
    procedureType: 'Endoscopía Digestiva Alta', 
    diagnosticoPreOperatorio: 'Reflujo Gastroesofágico', 
    diagnosticoPostOperatorio: 'Esofagitis Leve',
    surgeon: 'Dr. Silva', 
    date: yesterdayDateString, 
    time: '14:00', 
    operatingRoom: 'Endo1', 
    status: 'Completed', 
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() -1)).toISOString() // Yesterday
  },
   { 
    id: 's004', 
    tipoIntervencion: 'cirugia', 
    patientName: 'Ana Vidal', 
    patientId: 'P004', 
    edad: 68, 
    ubicacionCama: 'Pabellón 2, Cama 104',
    procedureType: 'Reemplazo de Cadera', 
    diagnosticoPreOperatorio: 'Artrosis de Cadera Severa',
    surgeon: 'Dr. Acosta', 
    date: tomorrowDateString, 
    time: '10:00', 
    operatingRoom: 'Q1', 
    status: 'Scheduled', 
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() -1)).toISOString() // Yesterday (scheduled for tomorrow)
  },
  { 
    id: 's005', 
    tipoIntervencion: 'cirugia', 
    patientName: 'Elena Ríos', 
    patientId: 'P005', 
    edad: 50, 
    ubicacionCama: 'Pabellón 2, Cama 105',
    procedureType: 'Gastrectomía Parcial', 
    diagnosticoPreOperatorio: 'Adenocarcinoma Gástrico', 
    diagnosticoPostOperatorio: 'Adenocarcinoma Gástrico Resecado',
    surgeon: 'Dr. Campos', 
    date: todayDateString, 
    time: '13:15', 
    operatingRoom: 'Q3', 
    status: 'Completed', 
    entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString() // 1 hour ago today
  },
];

const initialNonSurgicalPatientsData: NonSurgicalPatient[] = [
  { 
    id: 'ns001', 
    name: 'Mario Luna', 
    diagnosis: 'Deshidratación Severa', 
    attending: 'Dra. Vega', 
    entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // 2 hours ago today
    patientId: 'NS-P001', 
    edad: 60, 
    ubicacionCama: 'Sala Común 101',
    tratamiento: 'Fluidoterapia IV, observación'
  },
  { 
    id: 'ns002', 
    name: 'Sofia Castro', 
    diagnosis: 'Crisis Hipertensiva', 
    attending: 'Dr. Torres', 
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
    patientId: 'NS-P002', 
    edad: 72, 
    ubicacionCama: 'Sala Común 102',
    tratamiento: 'Labetalol IV, monitorización continua'
  },
   { 
    id: 'ns003', 
    name: 'Juan Herrera', 
    diagnosis: 'Neumonía Adquirida en la Comunidad', 
    attending: 'Dra. Solís', 
    entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(), // 4 hours ago today
    patientId: 'NS-P003', 
    edad: 52, 
    ubicacionCama: 'Sala Aislamiento 205',
    tratamiento: 'Ceftriaxona IV, O2 suplementario'
  },
];

const initialShiftNoveltiesData: ShiftNovelty[] = [
  { 
    id: 'nv001', 
    time: '09:15', 
    text: 'Falla equipo Rayos X en pabellón 2. Se reprograman procedimientos que lo requieren.', 
    reportedBy: 'Enf. Carla Soto', 
    entryTimestamp: new Date(new Date().setHours(9,15)).toISOString() // Today 9:15 AM
  },
  { 
    id: 'nv002', 
    time: '13:00', 
    text: 'Paciente P002 (Laura Méndez) refiere ser alérgica a Penicilina. Confirmado en ficha.', 
    reportedBy: 'Dr. García', 
    entryTimestamp: new Date(new Date().setHours(13,0)).toISOString() // Today 1:00 PM
  },
  {
    id: 'nv003',
    time: '15:30',
    text: 'Disponibilidad de camas UCI limitada. Priorizar altas.',
    reportedBy: 'Jefe de Turno',
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() // Yesterday
  }
];
// --- End Descriptive Initial Dummy Data ---


interface DraggableItemData {
  id: string;
  originalSectionId: 'operados' | 'no-quirurgicos' | 'pendientes' | 'novedades';
  itemData: Surgery | NonSurgicalPatient | ShiftNovelty;
}

interface PatientCardProps {
  surgery: Surgery;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, itemData: DraggableItemData) => void;
  onEdit: (itemId: string, entryTimestamp: string | undefined) => void;
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
      onDragStart={(e) => onDragStart(e, { id: surgery.id, originalSectionId: surgery.status === 'Completed' ? 'operados' : 'pendientes', itemData: surgery })}
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
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemData: DraggableItemData) => void;
    onEdit: (patientId: string, entryTimestamp: string | undefined) => void;
}

const NonSurgicalPatientCard = ({ patient, onDragStart, onEdit }: NonSurgicalPatientCardProps) => (
  <Card
    className="mb-3 shadow-md hover:shadow-lg transition-shadow cursor-grab"
    draggable={true}
    onDragStart={(e) => onDragStart(e, { id: patient.id, originalSectionId: 'no-quirurgicos', itemData: patient })}
  >
    <CardHeader className="pb-2">
        <CardTitle className="text-lg">{patient.name}</CardTitle>
        <CardDescription>Atendido por: {patient.attending} (ID: {patient.patientId || 'N/A'})</CardDescription>
    </CardHeader>
    <CardContent className="text-sm">
      <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
      <p><strong>Edad:</strong> {patient.edad || 'N/A'}</p>
      <p><strong>Ubicación:</strong> {patient.ubicacionCama || 'N/A'}</p>
      <p><strong>Tratamiento:</strong> {patient.tratamiento || 'N/A'}</p>
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
    onEdit: (noveltyId: string, entryTimestamp: string | undefined) => void;
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
  const [nonSurgicalPatients, setNonSurgicalPatients] = useState<NonSurgicalPatient[]>([]);
  const [shiftNovelties, setShiftNovelties] = useState<ShiftNovelty[]>([]);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);

  useEffect(() => {
    const currentDateString = format(new Date(), 'yyyy-MM-dd');

    // Load Surgeries
    try {
      let allSurgeries: Surgery[];
      const storedSurgeriesJSON = localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY);
      if (storedSurgeriesJSON) {
        allSurgeries = JSON.parse(storedSurgeriesJSON);
      } else {
        allSurgeries = initialSurgeriesData; // Use the new descriptive initial data
        localStorage.setItem(MOCK_SURGERIES_STORAGE_KEY, JSON.stringify(allSurgeries));
      }
      setTodaysSurgeries(allSurgeries.filter(surgery => surgery.date === currentDateString));
    } catch (error) {
      console.error("Error loading/initializing surgeries from localStorage:", error);
      // Fallback to ensure some data is shown if parsing fails or initial data is problematic
      setTodaysSurgeries(initialSurgeriesData.filter(surgery => surgery.date === currentDateString));
      toast({ title: "Error de Carga", description: "No se pudieron cargar las cirugías. Mostrando datos de ejemplo.", variant: "destructive" });
    }

    // Load Non-Surgical Patients
    try {
      let allNonSurgical: NonSurgicalPatient[];
      const storedNonSurgicalJSON = localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY);
      if (storedNonSurgicalJSON) {
        allNonSurgical = JSON.parse(storedNonSurgicalJSON);
      } else {
        allNonSurgical = initialNonSurgicalPatientsData;
        localStorage.setItem(MOCK_NON_SURGICAL_STORAGE_KEY, JSON.stringify(allNonSurgical));
      }
      setNonSurgicalPatients(allNonSurgical.filter(p => p.entryTimestamp && isToday(parseISO(p.entryTimestamp))));
    } catch (error) {
      console.error("Error loading/initializing non-surgical patients from localStorage:", error);
      setNonSurgicalPatients(initialNonSurgicalPatientsData.filter(p => p.entryTimestamp && isToday(parseISO(p.entryTimestamp))));
      toast({ title: "Error de Carga", description: "No se pudieron cargar los pacientes no quirúrgicos. Mostrando datos de ejemplo.", variant: "destructive" });
    }

    // Load Shift Novelties
    try {
      let allNovelties: ShiftNovelty[];
      const storedNoveltiesJSON = localStorage.getItem(MOCK_NOVELTIES_STORAGE_KEY);
      if (storedNoveltiesJSON) {
        allNovelties = JSON.parse(storedNoveltiesJSON);
      } else {
        allNovelties = initialShiftNoveltiesData;
        localStorage.setItem(MOCK_NOVELTIES_STORAGE_KEY, JSON.stringify(allNovelties));
      }
      setShiftNovelties(allNovelties.filter(n => n.entryTimestamp && isToday(parseISO(n.entryTimestamp))));
    } catch (error) {
      console.error("Error loading/initializing shift novelties from localStorage:", error);
      setShiftNovelties(initialShiftNoveltiesData.filter(n => n.entryTimestamp && isToday(parseISO(n.entryTimestamp))));
      toast({ title: "Error de Carga", description: "No se pudieron cargar las novedades. Mostrando datos de ejemplo.", variant: "destructive" });
    }
  }, [toast]);

  const saveAllDataToLocalStorage = (
    updatedTodaysSurgeries: Surgery[],
    updatedNonSurgicalPatients: NonSurgicalPatient[],
    updatedShiftNovelties: ShiftNovelty[]
  ) => {
    try {
      // Save Surgeries: merge updatedTodaysSurgeries with other-day surgeries from localStorage
      const allStoredSurgeries: Surgery[] = JSON.parse(localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY) || '[]')
                                           .filter((s: Surgery) => s.date !== todayDateString); // Keep surgeries from other days
      const newAllSurgeries = [...allStoredSurgeries, ...updatedTodaysSurgeries];
      localStorage.setItem(MOCK_SURGERIES_STORAGE_KEY, JSON.stringify(newAllSurgeries));
      setTodaysSurgeries(updatedTodaysSurgeries);


      // Save Non-Surgical Patients: merge updatedNonSurgicalPatients with other-day patients
      const allStoredNonSurgical: NonSurgicalPatient[] = JSON.parse(localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY) || '[]')
                                                          .filter((p: NonSurgicalPatient) => !(p.entryTimestamp && isToday(parseISO(p.entryTimestamp))));
      const newAllNonSurgical = [...allStoredNonSurgical, ...updatedNonSurgicalPatients];
      localStorage.setItem(MOCK_NON_SURGICAL_STORAGE_KEY, JSON.stringify(newAllNonSurgical));
      setNonSurgicalPatients(updatedNonSurgicalPatients);
      

      // Save Shift Novelties: merge updatedShiftNovelties with other-day novelties
      const allStoredNovelties: ShiftNovelty[] = JSON.parse(localStorage.getItem(MOCK_NOVELTIES_STORAGE_KEY) || '[]')
                                                 .filter((n: ShiftNovelty) => !(n.entryTimestamp && isToday(parseISO(n.entryTimestamp))));
      const newAllNovelties = [...allStoredNovelties, ...updatedShiftNovelties];
      localStorage.setItem(MOCK_NOVELTIES_STORAGE_KEY, JSON.stringify(newAllNovelties));
      setShiftNovelties(updatedShiftNovelties);


    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      toast({ title: "Error de Guardado", description: "No se pudieron guardar los cambios.", variant: "destructive" });
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
    console.log(`isEditable: Entry: ${entryTimestamp}, Now: ${new Date().toISOString()}, Diff (hours): ${hoursDifference}`);
    return hoursDifference <= 24;
  };

  const handleEdit = (itemId: string, itemType: string, entryTimestamp: string | undefined) => {
    const editable = isEditable(entryTimestamp);
    console.log(`Attempting to edit ${itemType} ID: ${itemId} with timestamp: ${entryTimestamp}, Editable: ${editable}`);
    if (editable) {
      toast({
        title: "Edición Permitida (Próximamente)",
        description: `Este registro ${itemType} (ID: ${itemId}) ES editable. La funcionalidad completa de edición está pendiente.`,
      });
    } else {
      toast({
        title: "Edición Bloqueada",
        description: `Este registro ${itemType} (ID: ${itemId}) NO es editable (han pasado más de 24h o fecha inválida).`,
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemData: DraggableItemData) => {
    e.dataTransfer.setData('application/json', JSON.stringify(itemData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetSectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggingOver(targetSectionId);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetSectionId: 'operados' | 'no-quirurgicos' | 'pendientes') => {
    e.preventDefault();
    setDraggingOver(null);
    const draggedItemJSON = e.dataTransfer.getData('application/json');
    if (!draggedItemJSON) return;

    const { id: draggedItemId, originalSectionId, itemData: rawItemData } = JSON.parse(draggedItemJSON) as DraggableItemData;

    if (originalSectionId === targetSectionId) {
      toast({ title: "Movimiento no realizado", description: "El ítem ya está en esta sección.", variant: "default" });
      return;
    }

    let newTodaysSurgeries = [...todaysSurgeries];
    let newNonSurgicalPatients = [...nonSurgicalPatients];
    // let newShiftNovelties = [...shiftNovelties]; // Novelties not part of D&D yet

    const newEntryTimestamp = new Date().toISOString();
    let updateMade = false;
    let toastMessage = "";

    // From PENDIENTES (Surgery)
    if (originalSectionId === 'pendientes' && (rawItemData as Surgery).tipoIntervencion) {
        const surgery = rawItemData as Surgery;
        if (targetSectionId === 'operados') { // Pendientes -> Operados
            newTodaysSurgeries = newTodaysSurgeries.map(s => s.id === draggedItemId ? { ...s, status: 'Completed', entryTimestamp: newEntryTimestamp } : s);
            toastMessage = `Cirugía de ${surgery.patientName} movida a Pacientes Operados.`;
            updateMade = true;
        } else if (targetSectionId === 'no-quirurgicos') { // Pendientes -> No Quirúrgicos
            newTodaysSurgeries = newTodaysSurgeries.filter(s => s.id !== draggedItemId);
            const newNonSurgical: NonSurgicalPatient = {
            id: `ns-${surgery.id}`, 
            name: surgery.patientName,
            patientId: surgery.patientId,
            edad: surgery.edad,
            ubicacionCama: surgery.ubicacionCama,
            diagnosis: surgery.diagnosticoPreOperatorio || 'Diagnóstico no especificado',
            attending: surgery.surgeon || 'Médico no especificado',
            entryTimestamp: newEntryTimestamp,
            };
            newNonSurgicalPatients.push(newNonSurgical);
            toastMessage = `Paciente ${surgery.patientName} movido de Pendientes a No Quirúrgicos.`;
            updateMade = true;
        }
    }
    // From OPERADOS (Surgery)
    else if (originalSectionId === 'operados' && (rawItemData as Surgery).tipoIntervencion) {
        if (targetSectionId === 'pendientes' || targetSectionId === 'no-quirurgicos') {
            toast({ title: "Acción no permitida", description: "Un paciente operado no puede volver a Pendientes o No Quirúrgicos mediante arrastre.", variant: "destructive" });
            return; 
        }
    }
    // From NO QUIRURGICOS (NonSurgicalPatient)
    else if (originalSectionId === 'no-quirurgicos' && !(rawItemData as Surgery).tipoIntervencion) {
        const nonSurgical = rawItemData as NonSurgicalPatient;
        if (targetSectionId === 'pendientes' || targetSectionId === 'operados') {
            newNonSurgicalPatients = newNonSurgicalPatients.filter(p => p.id !== draggedItemId);
            const newSurgery: Surgery = {
                id: `s-${nonSurgical.id}`, 
                patientName: nonSurgical.name,
                patientId: nonSurgical.patientId,
                edad: nonSurgical.edad,
                ubicacionCama: nonSurgical.ubicacionCama,
                procedureType: 'Procedimiento por traslado de No Quirúrgico',
                tipoIntervencion: 'procedimiento', 
                status: targetSectionId === 'pendientes' ? 'Scheduled' : 'Completed',
                date: format(new Date(), 'yyyy-MM-dd'),
                time: format(new Date(), 'HH:mm'),
                diagnosticoPreOperatorio: nonSurgical.diagnosis,
                entryTimestamp: newEntryTimestamp,
                surgeon: nonSurgical.attending,
            };
            newTodaysSurgeries.push(newSurgery);
            toastMessage = `Paciente ${nonSurgical.name} movido de No Quirúrgicos a ${targetSectionId === 'pendientes' ? 'Pendientes por Operar' : 'Pacientes Operados'}.`;
            updateMade = true;
        }
    }


    if (updateMade) {
      saveAllDataToLocalStorage(newTodaysSurgeries, newNonSurgicalPatients, shiftNovelties); // Pass novelties even if not changed by D&D
      toast({ title: "Actualización Exitosa", description: toastMessage });
    } else if (originalSectionId !== targetSectionId) { // Only show if it was a valid attempt to move to a *different* section
       toast({ title: "Movimiento no válido", description: "Esta transición no está permitida o no se pudo identificar el tipo de ítem.", variant: "default" });
    }
  };


  const scheduledSurgeries = todaysSurgeries.filter(s => s.status === 'Scheduled');
  const completedSurgeries = todaysSurgeries.filter(s => s.status === 'Completed');
  // todayNonSurgicalPatients and todayShiftNovelties are already filtered by day on load/init
  const todayNonSurgicalPatients = nonSurgicalPatients; 
  const todayShiftNovelties = shiftNovelties; 

  const accordionSections = [
    {
      id: 'operados',
      title: 'Pacientes Operados',
      icon: CheckCircle,
      data: completedSurgeries,
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "la cirugía completada", ts)} />,
      emptyText: "No hay pacientes registrados como operados hoy.",
      droppable: true,
      navigationPath: '/cirugias/registrar/procedimiento'
    },
    {
      id: 'no-quirurgicos',
      title: 'Pacientes No Quirúrgicos',
      icon: UserCog,
      data: todayNonSurgicalPatients,
      renderItem: (item: NonSurgicalPatient) => <NonSurgicalPatientCard key={item.id} patient={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "el paciente no quirúrgico", ts)} />,
      emptyText: "No hay pacientes no quirúrgicos registrados hoy.",
      droppable: true,
      navigationPath: '/cirugias/registrar/no-quirurgico'
    },
    {
      id: 'pendientes',
      title: 'Pendientes por Operar',
      icon: Clock,
      data: scheduledSurgeries,
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "la cirugía pendiente", ts)} />,
      emptyText: "No hay cirugías pendientes programadas para hoy.",
      droppable: true,
      navigationPath: '/cirugias/registrar/procedimiento'
    },
    {
      id: 'novedades',
      title: 'Novedades',
      icon: FileText,
      data: todayShiftNovelties,
      renderItem: (item: ShiftNovelty) => <NoveltyCard key={item.id} novelty={item} onEdit={(id, ts) => handleEdit(id, "la novedad", ts)} />,
      emptyText: "No hay novedades registradas para el turno de hoy.",
      droppable: false, 
      navigationPath: '/cirugias/registrar/novedades-turno'
    },
  ];

  const noDataForAllSections = todaysSurgeries.length === 0 && nonSurgicalPatients.length === 0 && shiftNovelties.length === 0;

  if (noDataForAllSections) {
    return (
        <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No hay registros para la hoja diaria de hoy.</p>
            <Link href="/cirugias/registrar" passHref>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Nuevo Registro
                </Button>
            </Link>
        </div>
    );
  }


  return (
    <Accordion type="multiple" className="w-full space-y-4" defaultValue={['pendientes', 'operados', 'no-quirurgicos', 'novedades']}>
      {accordionSections.map((section) => (
        <AccordionItem value={section.id} key={section.id} className="border rounded-lg shadow-md bg-card overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors group">
            <div className="flex items-center text-lg font-semibold text-primary">
              <section.icon className="mr-3 h-6 w-6" />
              {section.title}
              <Badge variant="outline" className="ml-3">{section.data.length}</Badge>
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
            </div>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
                "px-6 py-4 border-t bg-background min-h-[100px]",
                draggingOver === section.id && section.droppable && "bg-primary/10 border-primary border-dashed border-2"
             )}
            onDragOver={(e) => section.droppable && handleDragOver(e, section.id)}
            onDrop={(e) => section.droppable && handleDrop(e, section.id as 'operados' | 'no-quirurgicos' | 'pendientes')}
            onDragLeave={section.droppable ? handleDragLeave : undefined}
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

