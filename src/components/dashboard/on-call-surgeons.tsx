
'use client';

import { useState, useEffect } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ShiftAssignment } from '@/lib/types';
import { SHIFT_ASSIGNMENTS_STORAGE_KEY } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { UserCircle, CalendarDays } from 'lucide-react';

export default function OnCallSurgeonsDisplay() {
  const [currentDate, setCurrentDate] = useState('');
  const [onCallSurgeons, setOnCallSurgeons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserName = "Usuario Actual"; // Placeholder

  useEffect(() => {
    const today = new Date();
    setCurrentDate(format(today, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }));

    try {
      const storedShiftAssignmentsJSON = localStorage.getItem(SHIFT_ASSIGNMENTS_STORAGE_KEY);
      if (storedShiftAssignmentsJSON) {
        const allAssignments: ShiftAssignment[] = JSON.parse(storedShiftAssignmentsJSON).map((sa: any) => ({
            ...sa,
            date: parseISO(sa.date),
        }));
        
        const todayAssignments = allAssignments.find(assignment => 
          isSameDay(assignment.date, today)
        );

        if (todayAssignments && todayAssignments.assignedPersonnel.length > 0) {
          setOnCallSurgeons(todayAssignments.assignedPersonnel.map(p => p.surgeonName.split(' ')[0])); // Display first name or a part
        } else {
          setOnCallSurgeons([]);
        }
      }
    } catch (error) {
      console.error("Error loading shift assignments for today:", error);
      setOnCallSurgeons([]);
    }
    setIsLoading(false);
  }, []);

  const displaySurgeons = onCallSurgeons.length > 0 
    ? onCallSurgeons.join(' - ') 
    : 'Sin asignación para hoy';

  return (
    <Card className="shadow-lg border-border bg-card/80 backdrop-blur-sm">
      <CardContent className="pt-6 space-y-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <UserCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{currentUserName}</p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-foreground">
           <CalendarDays className="h-5 w-5" />
          <p className="text-md font-semibold capitalize">{currentDate || 'Cargando fecha...'}</p>
        </div>
        
        <div className="space-y-2">
            <p className="text-sm font-medium text-primary">DE TURNO</p>
            {isLoading ? (
                <Badge variant="secondary" className="text-sm px-4 py-2">Cargando...</Badge>
            ) : (
                <Badge variant="outline" className="text-md px-6 py-2 border-primary text-primary font-semibold shadow-sm">
                {displaySurgeons}
                </Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
