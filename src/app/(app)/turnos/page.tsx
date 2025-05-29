
'use client';

import ShiftCalendarView from '@/components/turnos/shift-calendar-view';
import AssignShiftPersonnelDialog from '@/components/turnos/assign-shift-personnel-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, Users, Edit } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { ShiftAssignment, StoredUser, AssignedPersonnel, SurgeonRole } from '@/lib/types';
import { MOCK_USERS_STORAGE_KEY } from '@/lib/constants';
import { isSameDay, getDay, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { es } from 'date-fns/locale'; // Import es locale for formatting

// Templates for shift types based on day of the week or specific labels
// Day mapping: 0 for Sunday, 1 for Monday, ..., 6 for Saturday
const shiftTemplates: Record<string, Omit<ShiftAssignment, 'id' | 'date' | 'assignedPersonnel'>> = {
  '1': { shiftLabel: 'Turno Lunes', bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' }, // Monday
  '2': { shiftLabel: 'Turno Martes', bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' }, // Tuesday
  '3': { shiftLabel: 'Turno Miércoles', bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' }, // Wednesday
  '4': { shiftLabel: 'Turno Jueves', bgColorClass: 'bg-amber-100 text-amber-800', borderColorClass: 'border-amber-300' }, // Thursday
  '5': { shiftLabel: 'Turno Viernes', bgColorClass: 'bg-red-100 text-red-800', borderColorClass: 'border-red-300' }, // Friday
  'Volante 1': { shiftLabel: 'Volante 1', bgColorClass: 'bg-purple-100 text-purple-800', borderColorClass: 'border-purple-300' },
  'Volante 2': { shiftLabel: 'Volante 2', bgColorClass: 'bg-pink-100 text-pink-800', borderColorClass: 'border-pink-300' },
};

// Function to get a shift template based on a date
const getShiftTemplateForDate = (date: Date): Omit<ShiftAssignment, 'id' | 'date' | 'assignedPersonnel'> => {
  const dayOfWeek = getDay(date); // 0 (Sunday) to 6 (Saturday)
  if (dayOfWeek === 6) return shiftTemplates['Volante 1']; // Saturday
  if (dayOfWeek === 0) return shiftTemplates['Volante 2']; // Sunday
  return shiftTemplates[dayOfWeek.toString()] || { 
    shiftLabel: 'Turno General', // Fallback for unmapped days
    bgColorClass: 'bg-gray-100 text-gray-800',
    borderColorClass: 'border-gray-300',
  };
};

const SHIFT_ASSIGNMENTS_STORAGE_KEY = 'mockShiftAssignments';

export default function ShiftCalendarPage() {
  const { toast } = useToast();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>();
  const [registeredSurgeons, setRegisteredSurgeons] = useState<StoredUser[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>([]);

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingShiftAssignment, setEditingShiftAssignment] = useState<ShiftAssignment | undefined>(undefined);

  useEffect(() => {
    try {
      const storedUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      if (storedUsersJSON) {
        const allUsers: StoredUser[] = JSON.parse(storedUsersJSON);
        setRegisteredSurgeons(allUsers.filter(user => user.rol === 'cirujano'));
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      setTimeout(() => {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios registrados.",
          variant: "destructive",
        });
      }, 0);
    }

    try {
        const storedShiftAssignments = localStorage.getItem(SHIFT_ASSIGNMENTS_STORAGE_KEY);
        if (storedShiftAssignments) {
            const parsedAssignments: ShiftAssignment[] = JSON.parse(storedShiftAssignments).map((sa: any) => ({
                ...sa,
                date: new Date(sa.date), 
            }));
            setShiftAssignments(parsedAssignments);
        }
    } catch (error) {
        console.error("Error loading shift assignments from localStorage:", error);
        // Do not toast here as it might conflict with render cycle on initial load
    }
  }, []); // Removed toast from dependency array


  const handleOpenAssignDialog = () => {
    if (!selectedCalendarDate) {
      toast({ title: "Error", description: "Por favor, seleccione una fecha primero.", variant: "destructive" });
      return;
    }

    let assignmentForDate = shiftAssignments.find(sa => isSameDay(sa.date, selectedCalendarDate));

    if (!assignmentForDate) {
      const template = getShiftTemplateForDate(selectedCalendarDate);
      assignmentForDate = {
        id: selectedCalendarDate.toISOString(), 
        date: selectedCalendarDate,
        shiftLabel: template.shiftLabel,
        bgColorClass: template.bgColorClass,
        borderColorClass: template.borderColorClass,
        assignedPersonnel: [],
      };
    }
    setEditingShiftAssignment(assignmentForDate);
    setIsAssignDialogOpen(true);
  };

  const handleSaveShiftPersonnel = (updatedPersonnel: AssignedPersonnel[]) => {
    if (!editingShiftAssignment) return;

    const updatedAssignment = { ...editingShiftAssignment, assignedPersonnel: updatedPersonnel };
    
    setShiftAssignments(prevAssignments => {
      const existingIndex = prevAssignments.findIndex(sa => sa.id === updatedAssignment.id);
      let newAssignments;
      if (existingIndex > -1) {
        newAssignments = [...prevAssignments];
        newAssignments[existingIndex] = updatedAssignment;
      } else {
        newAssignments = [...prevAssignments, updatedAssignment];
      }
      
      try {
        localStorage.setItem(SHIFT_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(newAssignments.map(sa => ({...sa, date: sa.date.toISOString()}))));
      } catch (error) {
        console.error("Error saving shift assignments to localStorage:", error);
        toast({ title: "Error de Guardado", description: "No se pudieron guardar los cambios en localStorage.", variant: "destructive"});
      }
      return newAssignments.sort((a, b) => a.date.getTime() - b.date.getTime());
    });

    toast({ title: "Turno Actualizado", description: `Personal del turno para ${format(updatedAssignment.date, 'PPP', { locale: es})} guardado.` });
    setIsAssignDialogOpen(false);
    setEditingShiftAssignment(undefined);
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Calendario de Turnos de Cirujanos</CardTitle>
            <CardDescription className="text-md">
              Visualiza y gestiona la asignación de personal a los turnos. Selecciona una fecha y luego gestiona el personal.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={handleOpenAssignDialog}
              disabled={!selectedCalendarDate}
              className="h-11 text-base w-full sm:w-auto"
            >
              <Edit className="mr-2 h-5 w-5" />
              Gestionar Personal del Turno
            </Button>
            
            {selectedCalendarDate && (
              <p className="text-sm text-muted-foreground border border-dashed border-border p-2 rounded-md">
                Fecha seleccionada: <span className="font-semibold text-foreground">{format(selectedCalendarDate, 'PPP', { locale: es})}</span>
              </p>
            )}
          </div>
          <ShiftCalendarView 
            selectedDate={selectedCalendarDate}
            onDateSelect={setSelectedCalendarDate}
            shiftData={shiftAssignments} 
          />
        </CardContent>
      </Card>

      {editingShiftAssignment && selectedCalendarDate && (
        <AssignShiftPersonnelDialog
          isOpen={isAssignDialogOpen}
          onOpenChange={(open) => {
            setIsAssignDialogOpen(open);
            if (!open) setEditingShiftAssignment(undefined); // Clear editing state when dialog closes
          }}
          selectedDate={selectedCalendarDate}
          shiftDetails={{ // Pass only necessary details for display
             shiftLabel: editingShiftAssignment.shiftLabel,
             bgColorClass: editingShiftAssignment.bgColorClass,
             borderColorClass: editingShiftAssignment.borderColorClass,
          }}
          currentAssignments={editingShiftAssignment.assignedPersonnel}
          registeredSurgeons={registeredSurgeons}
          onSave={handleSaveShiftPersonnel}
        />
      )}
    </div>
  );
}
