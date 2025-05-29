
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, Trash2 } from 'lucide-react';
import type { StoredUser, AssignedPersonnel, SurgeonRole, ShiftAssignment } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface AssignShiftPersonnelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  shiftDetails?: Pick<ShiftAssignment, 'shiftLabel' | 'bgColorClass' | 'borderColorClass'>;
  currentAssignments: AssignedPersonnel[];
  registeredSurgeons: StoredUser[];
  onSave: (updatedPersonnel: AssignedPersonnel[]) => void;
}

const surgeonRoles: { value: SurgeonRole; label: string }[] = [
  { value: 'primer', label: 'Primer Cirujano' },
  { value: 'segundo', label: 'Segundo Cirujano' },
  { value: 'becado', label: 'Becado/Residente' },
  { value: 'interno', label: 'Interno/Pasante' },
  { value: 'volante', label: 'Volante' },
];

export default function AssignShiftPersonnelDialog({
  isOpen,
  onOpenChange,
  selectedDate,
  shiftDetails,
  currentAssignments,
  registeredSurgeons,
  onSave,
}: AssignShiftPersonnelDialogProps) {
  const { toast } = useToast();
  const [personnel, setPersonnel] = useState<AssignedPersonnel[]>([]);
  const [selectedSurgeonId, setSelectedSurgeonId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<SurgeonRole | ''>('');

  useEffect(() => {
    // This effect initializes or resets the local 'personnel' state
    // when the dialog opens OR when the context (selectedDate) changes.
    // It uses a deep copy of currentAssignments to prevent direct mutation
    // and to ensure local state is distinct from parent state until saved.
    if (isOpen && selectedDate) {
      console.log('Dialog Effect: Initializing/Resetting personnel for date:', selectedDate.toISOString(), 'with currentAssignments:', currentAssignments);
      setPersonnel(JSON.parse(JSON.stringify(currentAssignments)));
      setSelectedSurgeonId('');
      setSelectedRole('');
    }
  }, [isOpen, selectedDate, currentAssignments]); // currentAssignments is added here to re-initialize if parent data changes for the same open dialog and date.

  const handleAddPersonnel = () => {
    if (!selectedSurgeonId || !selectedRole) {
      toast({ title: "Error", description: "Por favor, seleccione un cirujano y un rol.", variant: "destructive" });
      return;
    }
    const surgeon = registeredSurgeons.find(s => s.email === selectedSurgeonId);
    if (!surgeon) {
      toast({ title: "Error", description: "Cirujano no encontrado.", variant: "destructive" });
      return;
    }
    if (personnel.some(p => p.surgeonId === selectedSurgeonId)) {
      toast({ title: "Información", description: `${surgeon.nombreCompleto} ya está asignado a este turno.`, variant: "default" });
      return;
    }

    setPersonnel(prev => [...prev, { surgeonId: surgeon.email, surgeonName: surgeon.nombreCompleto, role: selectedRole as SurgeonRole }]);
    setSelectedSurgeonId(''); 
    setSelectedRole('');     
  };

  const handleRemovePersonnel = (surgeonIdToRemove: string) => {
    console.log('handleRemovePersonnel called for surgeonId:', surgeonIdToRemove);
    console.log('Personnel state BEFORE removal:', personnel);
    setPersonnel(prevPersonnel => {
      const updatedPersonnel = prevPersonnel.filter(p => p.surgeonId !== surgeonIdToRemove);
      console.log('Personnel state AFTER removal (updatedPersonnel):', updatedPersonnel);
      return updatedPersonnel;
    });
  };

  const handleSaveChanges = () => {
    console.log('Saving changes with personnel:', personnel);
    onSave(personnel);
  };

  const availableSurgeons = registeredSurgeons.filter(
    regSurgeon => !personnel.some(assigned => assigned.surgeonId === regSurgeon.email)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Gestionar Personal del Turno - <span className="text-primary">{shiftDetails?.shiftLabel || 'Turno'}</span>
          </DialogTitle>
          <DialogDescription>
            Fecha: {selectedDate ? format(selectedDate, 'PPPP', { locale: es }) : 'N/A'}. Asigne o remueva personal.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4 flex-grow overflow-y-auto">
          <div className="space-y-4 md:border-r md:pr-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Añadir Personal</h3>
            <div className="space-y-2">
              <Label htmlFor="select-surgeon">Cirujano</Label>
              <Select value={selectedSurgeonId} onValueChange={setSelectedSurgeonId}>
                <SelectTrigger id="select-surgeon" className="w-full">
                  <SelectValue placeholder="Seleccionar cirujano..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSurgeons.length > 0 ? (
                    availableSurgeons.map(s => (
                      <SelectItem key={s.email} value={s.email}>
                        {s.nombreCompleto}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-surgeons" disabled>No hay más cirujanos disponibles</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="select-role">Rol</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as SurgeonRole | '')}>
                <SelectTrigger id="select-role" className="w-full">
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  {surgeonRoles.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddPersonnel} className="w-full" disabled={!selectedSurgeonId || !selectedRole}>
              <UserPlus className="mr-2 h-4 w-4" /> Añadir al Turno
            </Button>
          </div>

          <div className="space-y-3">
             <h3 className="text-lg font-medium text-foreground mb-2">Personal Asignado ({personnel.length})</h3>
            {personnel.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No hay personal asignado a este turno.</p>
            ) : (
              <ScrollArea className="h-[250px] md:h-[300px] pr-1">
                <ul className="space-y-2">
                  {personnel.map((p) => (
                    <li key={p.surgeonId} className="flex items-center justify-between p-3 border rounded-md shadow-sm bg-card hover:bg-muted/50 w-full">
                      <div>
                        <p className="font-medium text-foreground">{p.surgeonName}</p>
                        <p className="text-xs text-muted-foreground">
                          {surgeonRoles.find(r => r.value === p.role)?.label || p.role}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          console.log(`Delete button clicked for surgeonId: ${p.surgeonId}`);
                          handleRemovePersonnel(p.surgeonId);
                        }} 
                        className="text-destructive hover:text-destructive/80 h-8 w-8"
                        aria-label={`Remover a ${p.surgeonName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
