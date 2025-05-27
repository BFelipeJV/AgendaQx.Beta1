
'use client';

import ShiftCalendarView from '@/components/turnos/shift-calendar-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, PlusCircle, Users, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ShiftAssignment, StoredUser } from '@/lib/types';
import { MOCK_USERS_STORAGE_KEY } from '@/lib/constants';
import { isSameDay } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

// Initial shift data (can be moved or fetched eventually)
const currentYear = new Date().getFullYear();
const initialShiftData: ShiftAssignment[] = [
  // Copied from dummyShiftData in shift-calendar-view, ensure dates are valid
  { id: 'shift1', date: new Date(currentYear, 4, 1), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift2', date: new Date(currentYear, 4, 2), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 3'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift3', date: new Date(currentYear, 4, 3), shiftLabel: 'Volante 1', surgeons: ['Cirujano Asignado 4', 'Cirujano Asignado 5'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift4', date: new Date(currentYear, 4, 4), shiftLabel: 'Volante 2', surgeons: ['Cirujano Asignado 6'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift5', date: new Date(currentYear, 4, 5), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  // Add more shifts as needed to match the original dummy data structure
];


export default function ShiftCalendarPage() {
  const { toast } = useToast();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>();
  const [registeredSurgeons, setRegisteredSurgeons] = useState<StoredUser[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>(initialShiftData);

  useEffect(() => {
    try {
      const storedUsersJSON = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
      if (storedUsersJSON) {
        const allUsers: StoredUser[] = JSON.parse(storedUsersJSON);
        setRegisteredSurgeons(allUsers.filter(user => user.rol === 'cirujano'));
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios registrados.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleAssignSurgeonToDate = (surgeon: StoredUser, date: Date | undefined) => {
    if (!date) {
      toast({
        title: "Error de Asignación",
        description: "Por favor, seleccione una fecha en el calendario primero.",
        variant: "destructive",
      });
      return;
    }

    setShiftAssignments(prevAssignments => {
      const newAssignments = [...prevAssignments];
      const shiftIndex = newAssignments.findIndex(s => isSameDay(s.date, date));

      if (shiftIndex > -1) { // Shift for this day exists
        const existingShift = { ...newAssignments[shiftIndex] };
        if (!existingShift.surgeons.includes(surgeon.nombreCompleto)) {
          existingShift.surgeons = [...existingShift.surgeons, surgeon.nombreCompleto];
          newAssignments[shiftIndex] = existingShift;
          toast({ title: "Turno Actualizado", description: `${surgeon.nombreCompleto} añadido al turno del ${date.toLocaleDateString('es-ES')}.` });
        } else {
          toast({ title: "Información", description: `${surgeon.nombreCompleto} ya está asignado a este turno.`, variant: "default" });
          return prevAssignments; // No change needed
        }
      } else { // No shift for this day, create new one
        const newShift: ShiftAssignment = {
          id: new Date().getTime().toString(), // Simple unique ID
          date: date,
          shiftLabel: 'Turno Asignado',
          surgeons: [surgeon.nombreCompleto],
          bgColorClass: 'bg-purple-100 text-purple-800', 
          borderColorClass: 'border-purple-300',
        };
        newAssignments.push(newShift);
        toast({ title: "Turno Creado", description: `${surgeon.nombreCompleto} asignado a un nuevo turno el ${date.toLocaleDateString('es-ES')}.` });
      }
      return newAssignments.sort((a, b) => a.date.getTime() - b.date.getTime()); // Keep shifts sorted by date
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Calendario de Turnos de Cirujanos</CardTitle>
            <CardDescription className="text-md">
              Visualiza y gestiona la asignación de turnos. Selecciona una fecha y luego un cirujano para asignar.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={!selectedCalendarDate || registeredSurgeons.length === 0}
                  className="h-11 text-base w-full sm:w-auto"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Asignar Cirujano a Fecha
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Seleccionar Cirujano</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {registeredSurgeons.length > 0 ? (
                  registeredSurgeons.map(surgeon => (
                    <DropdownMenuItem
                      key={surgeon.email}
                      onSelect={() => handleAssignSurgeonToDate(surgeon, selectedCalendarDate)}
                      disabled={!selectedCalendarDate}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      {surgeon.nombreCompleto}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                    No hay cirujanos registrados
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedCalendarDate && (
              <p className="text-sm text-muted-foreground border border-dashed border-border p-2 rounded-md">
                Fecha seleccionada: <span className="font-semibold text-foreground">{selectedCalendarDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
    </div>
  );
}
