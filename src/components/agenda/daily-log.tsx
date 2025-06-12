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
import EndShiftButton from './end-shift-button';
import { useAutoShiftClose } from '@/hooks/use-auto-shift-close';

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
      statusText = 'Pendiente';
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
            <CardTitle className="text-lg">{surgery.patientName}</CardTitle>
            <CardDescription className="text-lg font-medium">{surgery.procedureType || 'N/A'}</CardDescription>
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{patient.name}</CardTitle>
            <CardDescription className="text-lg font-medium">{patient.diagnosis}</CardDescription>
          </div>
        </div>
    </CardHeader>
    <CardContent className="text-sm space-y-1">
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
  const [isShiftClosed, setIsShiftClosed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('is_shift_closed');
      console.log('Loading isShiftClosed from localStorage:', stored);
      return stored === 'true';
    }
    return false;
  });
  const [shiftCloseInfo, setShiftCloseInfo] = useState<{
    closingSurgeon: string;
    closingTime: string;
    closingDate: string;
  } | null>(null);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'surgery' | 'non-surgical' | 'novelty' } | null>(null);

  // Efecto para guardar el estado de isShiftClosed en localStorage
  useEffect(() => {
    localStorage.setItem('is_shift_closed', isShiftClosed.toString());
  }, [isShiftClosed]);

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    // Cargar cirugías
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

      // Si el turno está cerrado, solo mostrar pendientes
      if (isShiftClosed) {
        setTodaysSurgeries(allSurgeries.filter(s => 
          s.date === format(new Date(), 'yyyy-MM-dd') && 
          s.status === 'Scheduled'
        ));
      } else {
        setTodaysSurgeries(allSurgeries.filter(s => 
          s.date === format(new Date(), 'yyyy-MM-dd')
        ));
      }
    } catch (error) {
      console.error("Error loading/initializing surgeries from localStorage:", error);
      setTodaysSurgeries(initialSurgeries.filter(s => 
        s.date === format(new Date(), 'yyyy-MM-dd')
      ));
      toast({ title: "Error de Carga de Cirugías", description: "Mostrando datos de ejemplo para cirugías.", variant: "destructive" });
    }

    // Cargar pacientes no quirúrgicos
    try {
      let allNonSurgical: NonSurgicalPatient[];
      const storedNonSurgicalJSON = localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY);
      if (storedNonSurgicalJSON && storedNonSurgicalJSON !== 'null' && storedNonSurgicalJSON !== 'undefined') {
        console.log("Loading non-surgical patients from localStorage:", storedNonSurgicalJSON);
        allNonSurgical = JSON.parse(storedNonSurgicalJSON);
        console.log("Parsed non-surgical patients:", allNonSurgical);
      } else {
        console.log("Initializing MOCK_NON_SURGICAL_STORAGE_KEY with example data.");
        allNonSurgical = initialNonSurgicalPatients;
        localStorage.setItem(MOCK_NON_SURGICAL_STORAGE_KEY, JSON.stringify(allNonSurgical));
      }

      // Filtrar pacientes no quirúrgicos para hoy
      const todayNonSurgical = allNonSurgical.filter(p => {
        if (!p.entryTimestamp) {
          console.log("Non-surgical patient without entryTimestamp:", p);
          return false;
        }
        const entryDate = parseISO(p.entryTimestamp);
        const isTodayPatient = isValid(entryDate) && isToday(entryDate);
        console.log("Checking non-surgical patient:", p, "entryDate:", entryDate, "isToday:", isTodayPatient);
        return isTodayPatient;
      });

      console.log("Today's non-surgical patients after filtering:", todayNonSurgical);
      setNonSurgicalPatients(todayNonSurgical);
    } catch (error) {
      console.error("Error loading/initializing non-surgical patients from localStorage:", error);
      setNonSurgicalPatients([]);
      toast({ 
        title: "Error de Carga de Pacientes", 
        description: "No se pudieron cargar los pacientes no quirúrgicos.", 
        variant: "destructive" 
      });
    }

    // Cargar novedades del turno
    try {
      let allNovelties: ShiftNovelty[];
      const storedNoveltiesJSON = localStorage.getItem(MOCK_NOVELTIES_STORAGE_KEY);
      if (storedNoveltiesJSON && storedNoveltiesJSON !== 'null' && storedNoveltiesJSON !== 'undefined') {
        console.log("Loading novelties from localStorage:", storedNoveltiesJSON);
        allNovelties = JSON.parse(storedNoveltiesJSON);
        console.log("Parsed novelties:", allNovelties);
      } else {
        console.log("Initializing MOCK_NOVELTIES_STORAGE_KEY with example data.");
        allNovelties = initialShiftNovelties;
        localStorage.setItem(MOCK_NOVELTIES_STORAGE_KEY, JSON.stringify(allNovelties));
      }

      // Filtrar novedades para hoy
      const todayNovelties = allNovelties.filter(n => {
        if (!n.entryTimestamp) {
          console.log("Novelty without entryTimestamp:", n);
          return false;
        }
        const entryDate = parseISO(n.entryTimestamp);
        const isTodayNovelty = isValid(entryDate) && isToday(entryDate);
        console.log("Checking novelty:", n, "entryDate:", entryDate, "isToday:", isTodayNovelty);
        return isTodayNovelty;
      });

      console.log("Today's novelties after filtering:", todayNovelties);
      setShiftNovelties(todayNovelties);
    } catch (error) {
      console.error("Error loading/initializing shift novelties from localStorage:", error);
      setShiftNovelties([]);
      toast({ 
        title: "Error de Carga de Novedades", 
        description: "No se pudieron cargar las novedades del turno.", 
        variant: "destructive" 
      });
    }
  }, [isShiftClosed, toast]);

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

  const handleReclassify = (item: Surgery | NonSurgicalPatient, newType: 'surgery' | 'non-surgical') => {
    console.log('Reclassifying item:', item, 'to type:', newType);
    
    if (newType === 'surgery') {
      // Convertir no quirúrgico a cirugía
      const newSurgery: Surgery = {
        id: `s_${Date.now()}`,
        patientName: item.name,
        patientId: item.patientId,
        edad: item.edad,
        procedureType: 'Por definir',
        diagnosticoPreOperatorio: item.diagnosis,
        operatingRoom: 'Por asignar',
        status: 'Scheduled',
        entryTimestamp: new Date().toISOString()
      };
      
      // Eliminar de no quirúrgicos y agregar a cirugías
      const updatedNonSurgical = nonSurgicalPatients.filter(p => p.id !== item.id);
      const updatedSurgeries = [...todaysSurgeries, newSurgery];
      
      saveAllDataToLocalStorage(updatedSurgeries, updatedNonSurgical, shiftNovelties);
      toast({
        title: "Paciente Reclasificado",
        description: "El paciente ha sido movido a la sección de cirugías pendientes.",
      });
    } else {
      // Convertir cirugía a no quirúrgico
      const newNonSurgical: NonSurgicalPatient = {
        id: `ns_${Date.now()}`,
        name: item.patientName,
        patientId: item.patientId,
        edad: item.edad,
        diagnosis: item.diagnosticoPreOperatorio,
        tratamiento: 'Por definir',
        comentarios: '',
        entryTimestamp: new Date().toISOString(),
        attending: 'Por asignar',
        ubicacionCama: 'Por asignar'
      };
      
      // Eliminar de cirugías y agregar a no quirúrgicos
      const updatedSurgeries = todaysSurgeries.filter(s => s.id !== item.id);
      const updatedNonSurgical = [...nonSurgicalPatients, newNonSurgical];
      
      saveAllDataToLocalStorage(updatedSurgeries, updatedNonSurgical, shiftNovelties);
      toast({
        title: "Paciente Reclasificado",
        description: "El paciente ha sido movido a la sección de pacientes no quirúrgicos.",
      });
    }
  };

  const handleEdit = (id: string, type: 'surgery' | 'non-surgical' | 'novelty', entryTimestamp?: string) => {
    console.log('Editing item:', { id, type, entryTimestamp });
    
    if (!isEditable(entryTimestamp)) {
      toast({
        title: "No se puede editar",
        description: "Este registro no puede ser editado porque pertenece a un turno cerrado.",
        variant: "destructive",
      });
      return;
    }

    let item;
    if (type === 'surgery') {
      item = todaysSurgeries.find(s => s.id === id);
      if (item) {
        // Redirigir al formulario de cirugía con los datos
        window.location.href = `/cirugias/registrar/procedimiento?edit=${id}`;
      }
    } else if (type === 'non-surgical') {
      item = nonSurgicalPatients.find(p => p.id === id);
      if (item) {
        // Redirigir al formulario de no quirúrgico con los datos
        window.location.href = `/cirugias/registrar/no-quirurgico?edit=${id}`;
      }
    } else if (type === 'novelty') {
      item = shiftNovelties.find(n => n.id === id);
      if (item) {
        // Redirigir al formulario de novedades con los datos
        window.location.href = `/cirugias/registrar/novedades-turno?edit=${id}`;
      }
    }
  };

  const handleDelete = (id: string, type: 'surgery' | 'non-surgical' | 'novelty') => {
    console.log('Deleting item:', { id, type });
    
    let updatedSurgeries = [...todaysSurgeries];
    let updatedNonSurgical = [...nonSurgicalPatients];
    let updatedNovelties = [...shiftNovelties];
    let itemFoundAndRemoved = false;

    if (type === 'surgery') {
      updatedSurgeries = todaysSurgeries.filter(s => s.id !== id);
      itemFoundAndRemoved = updatedSurgeries.length < todaysSurgeries.length;
    } else if (type === 'non-surgical') {
      updatedNonSurgical = nonSurgicalPatients.filter(p => p.id !== id);
      itemFoundAndRemoved = updatedNonSurgical.length < nonSurgicalPatients.length;
    } else if (type === 'novelty') {
      updatedNovelties = shiftNovelties.filter(n => n.id !== id);
      itemFoundAndRemoved = updatedNovelties.length < shiftNovelties.length;
    }

    if (itemFoundAndRemoved) {
      saveAllDataToLocalStorage(updatedSurgeries, updatedNonSurgical, updatedNovelties);
      toast({
        title: "Registro Eliminado",
        description: "El registro ha sido eliminado exitosamente.",
      });
    } else {
      console.error("Item not found for deletion:", { id, type });
      toast({
        title: "Error",
        description: "No se pudo encontrar el registro para eliminar.",
        variant: "destructive",
      });
    }
  };

  // Modificar el renderizado de las tarjetas para incluir el botón de reclasificación
  const renderPatientCard = (item: Surgery | NonSurgicalPatient, type: 'surgery' | 'non-surgical') => {
    const isSurgery = type === 'surgery';
    const surgery = isSurgery ? item as Surgery : null;
    const nonSurgical = !isSurgery ? item as NonSurgicalPatient : null;

    return (
      <Card className="mb-3 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{isSurgery ? surgery?.patientName : nonSurgical?.name}</CardTitle>
              <CardDescription className="text-lg font-medium">
                {isSurgery ? surgery?.procedureType || 'N/A' : nonSurgical?.diagnosis || 'N/A'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize text-sm py-1 px-2">
              {isSurgery ? 'Cirugía' : 'No Quirúrgico'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p><strong>RUT:</strong> {isSurgery ? surgery?.patientId : nonSurgical?.patientId}</p>
          <p><strong>Edad:</strong> {isSurgery ? surgery?.edad : nonSurgical?.edad}</p>
          {isSurgery ? (
            <>
              <p><strong>Pabellón/Sala:</strong> {surgery?.operatingRoom || 'N/A'}</p>
              <p><strong>Diag. Pre-Op:</strong> {surgery?.diagnosticoPreOperatorio || 'N/A'}</p>
            </>
          ) : (
            <>
              <p><strong>Tratamiento:</strong> {nonSurgical?.tratamiento || 'N/A'}</p>
              <p><strong>Comentarios:</strong> {nonSurgical?.comentarios || 'N/A'}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEdit(item.id, type, isSurgery ? surgery?.entryTimestamp : nonSurgical?.entryTimestamp)}
          >
            <Edit3 className="mr-1 h-3 w-3" /> Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleReclassify(item, isSurgery ? 'non-surgical' : 'surgery')}
          >
            <UserCog className="mr-1 h-3 w-3" /> Reclasificar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleDelete(item.id, type)}
          >
            <Trash2 className="mr-1 h-3 w-3" /> Eliminar
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Actualizar las secciones del acordeón
  const accordionSections = [
    {
      id: 'pendientes',
      title: 'Pendientes por Operar',
      icon: Clock,
      data: todaysSurgeries.filter(s => s.status === 'Scheduled'),
      renderItem: (item: Surgery) => renderPatientCard(item, 'surgery'),
      emptyText: "No hay cirugías pendientes programadas para hoy.",
      droppable: false,
      navigationPath: '/cirugias/registrar/pendiente'
    },
    {
      id: 'operados',
      title: 'Pacientes Operados',
      icon: CheckCircle,
      data: todaysSurgeries.filter(s => s.status === 'Completed'),
      renderItem: (item: Surgery) => renderPatientCard(item, 'surgery'),
      emptyText: "No hay pacientes operados registrados para hoy.",
      droppable: false,
      navigationPath: '/cirugias/registrar/procedimiento'
    },
    {
      id: 'no-quirurgicos',
      title: 'Pacientes No Quirúrgicos',
      icon: Bed,
      data: nonSurgicalPatients,
      renderItem: (item: NonSurgicalPatient) => renderPatientCard(item, 'non-surgical'),
      emptyText: "No hay pacientes no quirúrgicos registrados para hoy.",
      droppable: false,
      navigationPath: '/cirugias/registrar/no-quirurgico'
    },
    {
      id: 'novedades',
      title: 'Novedades',
      icon: FileText,
      data: shiftNovelties,
      renderItem: (item: ShiftNovelty) => (
        <NoveltyCard 
          key={item.id} 
          novelty={item} 
          onEdit={(id, ts) => handleEdit(id, 'novelty', ts)} 
          onDelete={(id) => handleDelete(id, 'novelty')} 
        />
      ),
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

  // --- Agregar función para finalizar el turno ---
  const handleEndShift = ({ closingSurgeon, closingTime, closingDate }: { closingSurgeon: string; closingTime: string; closingDate: string; }) => {
    // Guardar información del cierre de turno
    setIsShiftClosed(true);
    setShiftCloseInfo({ closingSurgeon, closingTime, closingDate });
    localStorage.setItem('is_shift_closed', 'true');
    localStorage.setItem('shift_close_info', JSON.stringify({ closingSurgeon, closingTime, closingDate }));
    toast({
      title: 'Turno Cerrado',
      description: `El turno fue cerrado por ${closingSurgeon} el ${closingDate} a las ${closingTime}.`,
    });
    // Aquí puedes agregar lógica adicional para archivar pacientes, etc.
  };

  // --- Función para confirmar eliminación ---
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    handleDelete(itemToDelete.id, itemToDelete.type);
    setDeleteAlertOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hoja Diaria</h1>
        {!isShiftClosed ? (
          <EndShiftButton onEndShift={handleEndShift} />
        ) : (
          <Button 
            variant="outline" 
            onClick={() => {
              setIsShiftClosed(false);
              localStorage.setItem('is_shift_closed', 'false');
              toast({
                title: "Turno Reabierto",
                description: "El turno ha sido reabierto. Ahora puede agregar nuevos registros.",
              });
            }}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Reabrir Turno
          </Button>
        )}
      </div>
      {shiftCloseInfo && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Turno cerrado por {shiftCloseInfo.closingSurgeon} el {shiftCloseInfo.closingDate} a las {shiftCloseInfo.closingTime}
          </p>
        </div>
      )}
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
                      className="h-8 w-8 text-muted-foreground hover:text-primary rounded-full mr-1 opacity-100 hover:opacity-100 data-[state=open]:opacity-100 data-[state=closed]:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Añadir a ${section.title}`}
                    >
                      <PlusCircle className="h-4 w-4" />
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
    
