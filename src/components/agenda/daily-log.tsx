
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
import { PlusCircle, CheckCircle, Clock, UserCog, FileText, Edit3, XCircle, AlertTriangle, Trash2, BriefcaseMedical, Bed, ClipboardList } from 'lucide-react'; // Added new icons
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { differenceInHours, parseISO, isValid, isToday, format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Initial Example Data (will be used if localStorage is empty) ---
const initialSurgeries: Surgery[] = [
  {
    id: 's001',
    tipoIntervencion: 'cirugia',
    patientName: 'Ana Pérez (Ejemplo Hoy)',
    patientId: '12345678-9',
    procedureType: 'Apendicectomía',
    diagnosticoPreOperatorio: 'Apendicitis Aguda',
    status: 'Scheduled',
    date: format(new Date(), 'yyyy-MM-dd'), // Today
    time: '09:00',
    entryTimestamp: new Date().toISOString(),
    surgeon: 'Dr. Casas',
    operatingRoom: 'Q1',
  },
  {
    id: 's002',
    tipoIntervencion: 'procedimiento',
    patientName: 'Luis Gómez (Ejemplo Hoy)',
    patientId: '98765432-1',
    procedureType: 'Endoscopía',
    diagnosticoPreOperatorio: 'Dolor Abdominal',
    status: 'Completed',
    date: format(new Date(), 'yyyy-MM-dd'), // Today
    time: '11:00',
    entryTimestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // 2 hours ago
    surgeon: 'Dra. Luna',
    operatingRoom: 'Endo1',
  },
  {
    id: 's003_yesterday',
    tipoIntervencion: 'cirugia',
    patientName: 'Carlos Solís (Ejemplo Ayer)',
    patientId: '11223344-5',
    procedureType: 'Colecistectomía',
    diagnosticoPreOperatorio: 'Colelitiasis',
    status: 'Completed',
    date: format(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd'), // Yesterday
    time: '14:00',
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    surgeon: 'Dr. Silva',
    operatingRoom: 'Q2',
  }
];

const initialNonSurgicalPatients: NonSurgicalPatient[] = [
  {
    id: 'ns001',
    name: 'Laura Méndez (NQ Hoy)',
    diagnosis: 'Neumonía Leve',
    attending: 'Dr. Roca',
    entryTimestamp: new Date().toISOString(),
    patientId: '22334455-6',
    edad: 65,
    ubicacionCama: 'Sala 3B',
  },
  {
    id: 'ns002_yesterday',
    name: 'Pedro Vargas (NQ Ayer)',
    diagnosis: 'Cefalea Tensional',
    attending: 'Dra. Ríos',
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    patientId: '33445566-7',
    edad: 40,
    ubicacionCama: 'Observación',
  }
];

const initialShiftNovelties: ShiftNovelty[] = [
  {
    id: 'nv001',
    time: format(new Date(), 'HH:mm'),
    text: 'Falla de equipo de Rayos X en Pabellón 2 (Ejemplo Hoy).',
    reportedBy: 'Téc. Paramed. J.Perez',
    entryTimestamp: new Date().toISOString(),
  },
  {
    id: 'nv002_yesterday',
    time: '18:30',
    text: 'Retraso en llegada de anestesista (Ejemplo Ayer).',
    reportedBy: 'Enf. Supervisora L. Soto',
    entryTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  }
];
// --- End Initial Example Data ---


interface DraggableItemData {
  id: string;
  originalSectionId: 'operados' | 'no-quirurgicos' | 'pendientes' | 'novedades'; // 'novedades' added for completeness but not used in D&D
  itemData: Surgery | NonSurgicalPatient | ShiftNovelty;
}

interface PatientCardProps {
  surgery: Surgery;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, itemData: DraggableItemData) => void;
  onEdit: (itemId: string, entryTimestamp: string | undefined) => void;
  onDelete: (itemId: string) => void;
}

const PatientCard = ({ surgery, onDragStart, onEdit, onDelete }: PatientCardProps) => {
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
            <CardTitle className="text-lg">{surgery.procedureType || 'N/A'}</CardTitle>
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
        <p><strong>Hora Prog.:</strong> {surgery.time || 'N/A'}</p>
        <p><strong>Cirujano/Equipo:</strong> {surgery.surgeon || 'N/A'}</p>
        <p><strong>Pabellón/Sala:</strong> {surgery.operatingRoom || 'N/A'}</p>
        <p><strong>Edad:</strong> {surgery.edad || 'N/A'}</p>
        <p><strong>Diag. Pre-Op:</strong> {surgery.diagnosticoPreOperatorio || 'N/A'}</p>
        {surgery.status === 'Completed' && <p><strong>Diag. Post-Op:</strong> {surgery.diagnosticoPostOperatorio || 'N/A'}</p>}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-3">
        <Button variant="outline" size="sm" onClick={() => onEdit(surgery.id, surgery.entryTimestamp)}>
            <Edit3 className="mr-1 h-3 w-3" /> Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(surgery.id)}>
            <Trash2 className="mr-1 h-3 w-3" /> Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

interface NonSurgicalPatientCardProps {
    patient: NonSurgicalPatient;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, itemData: DraggableItemData) => void;
    onEdit: (patientId: string, entryTimestamp: string | undefined) => void;
    onDelete: (patientId: string) => void;
}

const NonSurgicalPatientCard = ({ patient, onDragStart, onEdit, onDelete }: NonSurgicalPatientCardProps) => (
  <Card
    className="mb-3 shadow-md hover:shadow-lg transition-shadow cursor-grab"
    draggable={true}
    onDragStart={(e) => onDragStart(e, { id: patient.id, originalSectionId: 'no-quirurgicos', itemData: patient })}
  >
    <CardHeader className="pb-2">
        <CardTitle className="text-lg">{patient.name}</CardTitle>
        <CardDescription>Atendido por: {patient.attending} (ID: {patient.patientId || 'N/A'})</CardDescription>
    </CardHeader>
    <CardContent className="text-sm space-y-1">
      <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
      <p><strong>Edad:</strong> {patient.edad || 'N/A'}</p>
      <p><strong>Ubicación:</strong> {patient.ubicacionCama || 'N/A'}</p>
      <p><strong>Tratamiento:</strong> {patient.tratamiento || 'N/A'}</p>
      {patient.comentarios && <p><strong>Comentarios:</strong> {patient.comentarios}</p>}
    </CardContent>
    <CardFooter className="flex justify-end gap-2 pt-3">
       <Button variant="outline" size="sm" onClick={() => onEdit(patient.id, patient.entryTimestamp)}>
            <Edit3 className="mr-1 h-3 w-3" /> Editar
       </Button>
       <Button variant="destructive" size="sm" onClick={() => onDelete(patient.id)}>
            <Trash2 className="mr-1 h-3 w-3" /> Eliminar
        </Button>
    </CardFooter>
  </Card>
);

interface NoveltyCardProps {
    novelty: ShiftNovelty;
    onEdit: (noveltyId: string, entryTimestamp: string | undefined) => void;
    onDelete: (noveltyId: string) => void;
}

const NoveltyCard = ({ novelty, onEdit, onDelete }: NoveltyCardProps) => (
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
        <Button variant="destructive" size="sm" onClick={() => onDelete(novelty.id)}>
            <Trash2 className="mr-1 h-3 w-3" /> Eliminar
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

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'surgery' | 'non-surgical' | 'novelty' } | null>(null);


  useEffect(() => {
    const currentDayString = format(new Date(), 'yyyy-MM-dd');

    // Load Surgeries
    try {
      let allSurgeries: Surgery[];
      const storedSurgeriesJSON = localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY);
      if (storedSurgeriesJSON && storedSurgeriesJSON !== 'null' && storedSurgeriesJSON !== 'undefined') {
        console.log("Loading surgeries from localStorage");
        allSurgeries = JSON.parse(storedSurgeriesJSON);
      } else {
        console.log("Initializing MOCK_SURGERIES_STORAGE_KEY with example data.");
        allSurgeries = initialSurgeries;
        localStorage.setItem(MOCK_SURGERIES_STORAGE_KEY, JSON.stringify(allSurgeries));
      }
      setTodaysSurgeries(allSurgeries.filter(surgery => surgery.date === currentDayString));
    } catch (error) {
      console.error("Error loading/initializing surgeries from localStorage:", error);
      setTodaysSurgeries(initialSurgeries.filter(surgery => surgery.date === currentDayString));
      toast({ title: "Error de Carga de Cirugías", description: "Mostrando datos de ejemplo para cirugías.", variant: "destructive" });
    }

    // Load Non-Surgical Patients
    try {
      let allNonSurgical: NonSurgicalPatient[];
      const storedNonSurgicalJSON = localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY);
      if (storedNonSurgicalJSON && storedNonSurgicalJSON !== 'null' && storedNonSurgicalJSON !== 'undefined') {
         console.log("Loading non-surgical from localStorage");
        allNonSurgical = JSON.parse(storedNonSurgicalJSON);
      } else {
        console.log("Initializing MOCK_NON_SURGICAL_STORAGE_KEY with example data.");
        allNonSurgical = initialNonSurgicalPatients;
        localStorage.setItem(MOCK_NON_SURGICAL_STORAGE_KEY, JSON.stringify(allNonSurgical));
      }
      setNonSurgicalPatients(allNonSurgical.filter(p => p.entryTimestamp && isToday(parseISO(p.entryTimestamp))));
    } catch (error) {
      console.error("Error loading/initializing non-surgical patients from localStorage:", error);
      setNonSurgicalPatients(initialNonSurgicalPatients.filter(p => p.entryTimestamp && isToday(parseISO(p.entryTimestamp))));
      toast({ title: "Error de Carga No Quirúrgicos", description: "Mostrando datos de ejemplo para no quirúrgicos.", variant: "destructive" });
    }

    // Load Shift Novelties
    try {
      let allNovelties: ShiftNovelty[];
      const storedNoveltiesJSON = localStorage.getItem(MOCK_NOVELTIES_STORAGE_KEY);
      if (storedNoveltiesJSON && storedNoveltiesJSON !== 'null' && storedNoveltiesJSON !== 'undefined') {
        console.log("Loading novelties from localStorage");
        allNovelties = JSON.parse(storedNoveltiesJSON);
      } else {
        console.log("Initializing MOCK_NOVELTIES_STORAGE_KEY with example data.");
        allNovelties = initialShiftNovelties;
        localStorage.setItem(MOCK_NOVELTIES_STORAGE_KEY, JSON.stringify(allNovelties));
      }
      setShiftNovelties(allNovelties.filter(n => n.entryTimestamp && isToday(parseISO(n.entryTimestamp))));
    } catch (error) {
      console.error("Error loading/initializing shift novelties from localStorage:", error);
      setShiftNovelties(initialShiftNovelties.filter(n => n.entryTimestamp && isToday(parseISO(n.entryTimestamp))));
      toast({ title: "Error de Carga de Novedades", description: "Mostrando datos de ejemplo para novedades.", variant: "destructive" });
    }
  }, []); // Empty dependency array to run only on mount

  const saveAllDataToLocalStorage = (
    updatedTodaysSurgeriesArg?: Surgery[],
    updatedNonSurgicalPatientsArg?: NonSurgicalPatient[],
    updatedShiftNoveltiesArg?: ShiftNovelty[]
  ) => {
    try {
      const currentDayStr = format(new Date(), 'yyyy-MM-dd');

      // Surgeries
      const surgeriesToSave = updatedTodaysSurgeriesArg ?? todaysSurgeries;
      const allStoredSurgeries: Surgery[] = JSON.parse(localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY) || '[]')
                                           .filter((s: Surgery) => s.date !== currentDayStr); // Keep non-today's surgeries
      const newAllSurgeries = [...allStoredSurgeries, ...surgeriesToSave];
      localStorage.setItem(MOCK_SURGERIES_STORAGE_KEY, JSON.stringify(newAllSurgeries));
      if(updatedTodaysSurgeriesArg) setTodaysSurgeries(updatedTodaysSurgeriesArg);

      // Non-Surgical Patients
      const nonSurgicalToSave = updatedNonSurgicalPatientsArg ?? nonSurgicalPatients;
      const allStoredNonSurgical: NonSurgicalPatient[] = JSON.parse(localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY) || '[]')
                                                          .filter((p: NonSurgicalPatient) => !(p.entryTimestamp && isToday(parseISO(p.entryTimestamp))));
      const newAllNonSurgical = [...allStoredNonSurgical, ...nonSurgicalToSave];
      localStorage.setItem(MOCK_NON_SURGICAL_STORAGE_KEY, JSON.stringify(newAllNonSurgical));
      if(updatedNonSurgicalPatientsArg) setNonSurgicalPatients(updatedNonSurgicalPatientsArg);

      // Shift Novelties
      const noveltiesToSave = updatedShiftNoveltiesArg ?? shiftNovelties;
      const allStoredNovelties: ShiftNovelty[] = JSON.parse(localStorage.getItem(MOCK_NOVELTIES_STORAGE_KEY) || '[]')
                                                 .filter((n: ShiftNovelty) => !(n.entryTimestamp && isToday(parseISO(n.entryTimestamp))));
      const newAllNovelties = [...allStoredNovelties, ...noveltiesToSave];
      localStorage.setItem(MOCK_NOVELTIES_STORAGE_KEY, JSON.stringify(newAllNovelties));
      if(updatedShiftNoveltiesArg) setShiftNovelties(updatedShiftNoveltiesArg);

    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      toast({ title: "Error de Guardado", description: "No se pudieron guardar los cambios.", variant: "destructive" });
    }
  };


  const isEditable = (entryTimestamp?: string): boolean => {
    console.log("[isEditable] Checking timestamp:", entryTimestamp);
    if (!entryTimestamp) {
      console.warn("[isEditable] entryTimestamp is missing. Defaulting to not editable.");
      return false;
    }
    const entryDate = parseISO(entryTimestamp);
    if (!isValid(entryDate)) {
      console.warn(`[isEditable] entryTimestamp '${entryTimestamp}' is invalid. Defaulting to not editable.`);
      return false;
    }
    const hoursDifference = differenceInHours(new Date(), entryDate);
    const editable = hoursDifference <= 24;
    console.log(`[isEditable] Entry TS: ${entryTimestamp}, Parsed Entry Date: ${entryDate.toISOString()}, Now: ${new Date().toISOString()}, Diff (hours): ${hoursDifference}, Editable: ${editable}`);
    return editable;
  };

  const handleEdit = (itemId: string, itemType: string, entryTimestamp: string | undefined) => {
    const editable = isEditable(entryTimestamp);
    console.log(`[handleEdit] Attempting to edit ${itemType} ID: ${itemId} with timestamp: ${entryTimestamp}, Editable: ${editable}`);
    if (editable) {
      toast({
        title: "Edición Permitida (Próximamente)",
        description: `Este registro ${itemType} (ID: ${itemId}) ES editable (dentro de las 24h). La funcionalidad completa de edición está pendiente.`,
      });
    } else {
      toast({
        title: "Edición Bloqueada",
        description: `Este registro ${itemType} (ID: ${itemId}) NO es editable (han pasado más de 24h desde su creación/última actualización, o fecha inválida/faltante).`,
        variant: "destructive",
      });
    }
  };

  const openDeleteConfirmation = (id: string, type: 'surgery' | 'non-surgical' | 'novelty') => {
    setItemToDelete({ id, type });
    setDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    console.log("[handleConfirmDelete] Deleting item:", itemToDelete);

    let updatedSurgeries = [...todaysSurgeries];
    let updatedNonSurgical = [...nonSurgicalPatients];
    let updatedNovelties = [...shiftNovelties];
    let itemFoundAndRemoved = false;

    if (itemToDelete.type === 'surgery') {
      updatedSurgeries = todaysSurgeries.filter(s => s.id !== itemToDelete.id);
      itemFoundAndRemoved = updatedSurgeries.length < todaysSurgeries.length;
      console.log(`[handleConfirmDelete] Surgeries after delete attempt (found: ${itemFoundAndRemoved}):`, updatedSurgeries);
    } else if (itemToDelete.type === 'non-surgical') {
      updatedNonSurgical = nonSurgicalPatients.filter(p => p.id !== itemToDelete.id);
      itemFoundAndRemoved = updatedNonSurgical.length < nonSurgicalPatients.length;
      console.log(`[handleConfirmDelete] Non-surgical after delete attempt (found: ${itemFoundAndRemoved}):`, updatedNonSurgical);
    } else if (itemToDelete.type === 'novelty') {
      updatedNovelties = shiftNovelties.filter(n => n.id !== itemToDelete.id);
      itemFoundAndRemoved = updatedNovelties.length < shiftNovelties.length;
      console.log(`[handleConfirmDelete] Novelties after delete attempt (found: ${itemFoundAndRemoved}):`, updatedNovelties);
    }

    if (itemFoundAndRemoved) {
      saveAllDataToLocalStorage(updatedSurgeries, updatedNonSurgical, updatedNovelties);
      toast({ title: "Registro Eliminado", description: `El registro ha sido eliminado exitosamente.` });
    } else {
      console.error("[handleConfirmDelete] Item not found for deletion:", itemToDelete);
      toast({ title: "Error al Eliminar", description: "No se encontró el registro para eliminar.", variant: "destructive"});
    }

    setDeleteAlertOpen(false);
    setItemToDelete(null);
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

    const newEntryTimestamp = new Date().toISOString();
    let updateMade = false;
    let toastMessage = "";

    if (originalSectionId === 'pendientes' && (rawItemData as Surgery).tipoIntervencion) { // Item is a Surgery from 'pendientes'
        const surgery = rawItemData as Surgery;
        if (targetSectionId === 'operados') {
            newTodaysSurgeries = newTodaysSurgeries.map(s => s.id === draggedItemId ? { ...s, status: 'Completed', entryTimestamp: newEntryTimestamp } : s);
            toastMessage = `Cirugía de ${surgery.patientName} movida a Pacientes Operados.`;
            updateMade = true;
        } else if (targetSectionId === 'no-quirurgicos') {
            newTodaysSurgeries = newTodaysSurgeries.filter(s => s.id !== draggedItemId); // Remove from surgeries
            const newNonSurgical: NonSurgicalPatient = { // Transform to NonSurgicalPatient
                id: `ns-${surgery.id}`, // Create new ID
                name: surgery.patientName,
                patientId: surgery.patientId,
                edad: surgery.edad,
                ubicacionCama: surgery.ubicacionCama,
                diagnosis: surgery.diagnosticoPreOperatorio || 'Diagnóstico no especificado',
                attending: surgery.surgeon || 'Médico no especificado',
                entryTimestamp: newEntryTimestamp,
                tratamiento: surgery.tratamientoIndicado, // Assuming these fields exist on Surgery or are okay as undefined
                comentarios: surgery.comentariosAdicionales,
            };
            newNonSurgicalPatients.push(newNonSurgical);
            toastMessage = `Paciente ${surgery.patientName} movido de Pendientes a No Quirúrgicos.`;
            updateMade = true;
        }
    }
    else if (originalSectionId === 'operados' && (rawItemData as Surgery).tipoIntervencion) { // Item is a Surgery from 'operados'
        if (targetSectionId === 'pendientes' || targetSectionId === 'no-quirurgicos') {
            toast({ title: "Acción no permitida", description: "Un paciente operado no puede volver a Pendientes o No Quirúrgicos mediante arrastre.", variant: "destructive" });
            return; // Block this move
        }
    }
    else if (originalSectionId === 'no-quirurgicos' && !(rawItemData as Surgery).tipoIntervencion) { // Item is a NonSurgicalPatient
        const nonSurgical = rawItemData as NonSurgicalPatient;
        if (targetSectionId === 'pendientes' || targetSectionId === 'operados') {
            newNonSurgicalPatients = newNonSurgicalPatients.filter(p => p.id !== draggedItemId); // Remove from non-surgical
            const newSurgery: Surgery = { // Transform to Surgery
                id: `s-${nonSurgical.id}`, // Create new ID
                patientName: nonSurgical.name,
                patientId: nonSurgical.patientId,
                edad: nonSurgical.edad,
                ubicacionCama: nonSurgical.ubicacionCama,
                procedureType: targetSectionId === 'pendientes' ? 'Procedimiento por definir' : 'Procedimiento realizado (traslado NQ)',
                tipoIntervencion: 'procedimiento', // Default to procedimiento
                status: targetSectionId === 'pendientes' ? 'Scheduled' : 'Completed',
                date: format(new Date(), 'yyyy-MM-dd'),
                time: format(new Date(), 'HH:mm'), // Current time as placeholder
                diagnosticoPreOperatorio: nonSurgical.diagnosis,
                diagnosticoPostOperatorio: targetSectionId === 'operados' ? nonSurgical.diagnosis : undefined, // If moved to operated, copy diagnosis
                tratamientoIndicado: nonSurgical.tratamiento,
                comentariosAdicionales: nonSurgical.comentarios,
                entryTimestamp: newEntryTimestamp,
                // Fields like surgeon, operatingRoom might need to be placeholders or derived
                surgeon: nonSurgical.attending, // Use attending physician as surgeon placeholder
                operatingRoom: nonSurgical.ubicacionCama // Or a default OR
            };
            newTodaysSurgeries.push(newSurgery);
            toastMessage = `Paciente ${nonSurgical.name} movido de No Quirúrgicos a ${targetSectionId === 'pendientes' ? 'Pendientes por Operar' : 'Pacientes Operados'}.`;
            updateMade = true;
        }
    }


    if (updateMade) {
      saveAllDataToLocalStorage(newTodaysSurgeries, newNonSurgicalPatients, shiftNovelties);
      toast({ title: "Actualización Exitosa", description: toastMessage });
    } else if (originalSectionId !== targetSectionId) { // If no specific update was made but sections were different
       toast({ title: "Movimiento no válido", description: "Esta transición no está permitida o no se pudo identificar el tipo de ítem.", variant: "default" });
    }
  };


  const scheduledSurgeries = todaysSurgeries.filter(s => s.status === 'Scheduled');
  const completedSurgeries = todaysSurgeries.filter(s => s.status === 'Completed');
  const todayNonSurgicalPatients = nonSurgicalPatients; // Already filtered by isToday in useEffect
  const todayShiftNovelties = shiftNovelties; // Already filtered by isToday in useEffect

  const accordionSections = [
    {
      id: 'operados',
      title: 'Pacientes Operados',
      icon: BriefcaseMedical, // Changed icon
      data: completedSurgeries,
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "la cirugía completada", ts)} onDelete={(id) => openDeleteConfirmation(id, 'surgery')} />,
      emptyText: "No hay pacientes registrados como operados hoy.",
      droppable: true, // Can drop here (e.g., from 'pendientes')
      navigationPath: '/cirugias/registrar/procedimiento'
    },
    {
      id: 'no-quirurgicos',
      title: 'Pacientes No Quirúrgicos',
      icon: Bed, // Changed icon
      data: todayNonSurgicalPatients,
      renderItem: (item: NonSurgicalPatient) => <NonSurgicalPatientCard key={item.id} patient={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "el paciente no quirúrgico", ts)} onDelete={(id) => openDeleteConfirmation(id, 'non-surgical')} />,
      emptyText: "No hay pacientes no quirúrgicos registrados hoy.",
      droppable: true, // Can drop here (e.g., from 'pendientes')
      navigationPath: '/cirugias/registrar/no-quirurgico'
    },
    {
      id: 'pendientes',
      title: 'Pendientes por Operar',
      icon: ClipboardList, // Changed icon
      data: scheduledSurgeries,
      renderItem: (item: Surgery) => <PatientCard key={item.id} surgery={item} onDragStart={handleDragStart} onEdit={(id, ts) => handleEdit(id, "la cirugía pendiente", ts)} onDelete={(id) => openDeleteConfirmation(id, 'surgery')} />,
      emptyText: "No hay cirugías pendientes programadas para hoy.",
      droppable: true, // Can drop here (e.g., from 'no-quirurgicos')
      navigationPath: '/cirugias/registrar/procedimiento' // Or '/cirugias/registrar/pendiente' if specific form for pending
    },
    {
      id: 'novedades',
      title: 'Novedades',
      icon: FileText,
      data: todayShiftNovelties,
      renderItem: (item: ShiftNovelty) => <NoveltyCard key={item.id} novelty={item} onEdit={(id, ts) => handleEdit(id, "la novedad", ts)} onDelete={(id) => openDeleteConfirmation(id, 'novelty')} />,
      emptyText: "No hay novedades registradas para el turno de hoy.",
      droppable: false, // Cannot drop items into 'Novedades'
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
    <>
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['pendientes', 'operados', 'no-quirurgicos', 'novedades']}>
        {accordionSections.map((section) => (
          <AccordionItem value={section.id} key={section.id} className="border rounded-lg shadow-md bg-card overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors group">
              <div className="flex items-center text-lg font-semibold text-primary">
                <section.icon className="mr-3 h-6 w-6" />
                {section.title}
                <Badge variant="outline" className="ml-3">{section.data.length}</Badge>
              </div>
               <div className="ml-auto flex items-center"> {/* Ensure plus button is on the right */}
                  {section.navigationPath && (
                      <Link href={section.navigationPath} passHref legacyBehavior>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full mr-1 opacity-100 hover:opacity-100 data-[state=open]:opacity-100 data-[state=closed]:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
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
                  "px-6 py-4 border-t bg-background min-h-[100px]", // Ensure some min height
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
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este registro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
    
