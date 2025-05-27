'use client'; // Añadido para marcar como Componente de Cliente

import type { Surgery } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarCheck, Edit3, Trash2, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"; // ChevronLeft/Right not used here, but often with Calendar
import React, { useState, useEffect } from 'react';
import { es } from 'date-fns/locale'; // Import Spanish locale
import { cn } from '@/lib/utils'; // Import cn utility

// Dummy data for demonstration
const dummySurgeries: Surgery[] = [
  { id: '1', patientName: 'Alicia Maravillas', patientId: 'P001', procedureType: 'Reemplazo de Rodilla', surgeon: 'Dr. Pérez', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], time: '09:00', operatingRoom: 'Q-1', status: 'Scheduled' },
  { id: '2', patientName: 'Roberto Constructor', patientId: 'P002', procedureType: 'Extracción de Vesícula', surgeon: 'Dr. López', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], time: '13:00', operatingRoom: 'Q-2', status: 'Scheduled' },
  { id: '3', patientName: 'Carlos Pardo', patientId: 'P003', procedureType: 'Apendicectomía', surgeon: 'Dr. García', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], time: '11:00', operatingRoom: 'Q-1', status: 'Scheduled' },
];


export default function ScheduleOverview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [surgeries, setSurgeries] = useState<Surgery[]>(dummySurgeries);
  const [formattedDate, setFormattedDate] = useState<string>('Cargando fecha...'); // Initial loading state

  useEffect(() => {
    // Set the initial date only on the client-side to avoid hydration mismatch
    setSelectedDate(new Date());
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  useEffect(() => {
    if (selectedDate) {
      setFormattedDate(selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    } else {
      // This might be briefly true before the first useEffect sets selectedDate
      setFormattedDate('Seleccione una fecha'); 
    }
  }, [selectedDate]);

  const surgeriesForSelectedDate = surgeries.filter(
    surgery => selectedDate && new Date(surgery.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Seleccionar Fecha</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={es} // Spanish locale for calendar
            />
          </CardContent>
        </Card>
         <Button className="w-full mt-4 h-11 text-base">
            <PlusCircle className="mr-2 h-5 w-5" />
            Añadir Nueva Cirugía
        </Button>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-md h-full">
          <CardHeader>
            <CardTitle>
              Agenda para {formattedDate}
            </CardTitle>
            <CardDescription>
              {selectedDate && surgeriesForSelectedDate.length > 0 
                ? `Se encontraron ${surgeriesForSelectedDate.length} cirugías.`
                : selectedDate ? "No hay cirugías programadas para esta fecha." : "Cargando agenda..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {selectedDate && surgeriesForSelectedDate.length > 0 ? (
              surgeriesForSelectedDate.map((surgery) => (
                <Card key={surgery.id} className="bg-muted/30 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{surgery.procedureType}</CardTitle>
                        <CardDescription>Paciente: {surgery.patientName} (ID: {surgery.patientId})</CardDescription>
                      </div>
                      <Badge 
                        variant={surgery.status === 'Scheduled' ? 'default' : surgery.status === 'Completed' ? 'default' : 'destructive'} 
                        className={cn("capitalize text-primary-foreground", { // Ensure text is visible on colored badges
                            "bg-blue-500 hover:bg-blue-600": surgery.status === 'Scheduled',
                            "bg-green-500 hover:bg-green-600": surgery.status === 'Completed',
                            // destructive variant will handle its own colors
                        })}
                      >
                        {surgery.status === 'Scheduled' && 'Programada'}
                        {surgery.status === 'Completed' && 'Completada'}
                        {surgery.status === 'Cancelled' && 'Cancelada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><strong>Hora:</strong> {surgery.time}</p>
                    <p><strong>Cirujano:</strong> {surgery.surgeon}</p>
                    <p><strong>Quirófano:</strong> {surgery.operatingRoom}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="mr-1 h-3 w-3" /> Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-3 w-3" /> Cancelar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Alert>
                <CalendarCheck className="h-4 w-4" />
                <AlertTitle>{selectedDate ? '¡Todo Despejado!' : 'Cargando...'}</AlertTitle>
                <AlertDescription>
                  {selectedDate 
                    ? "No hay cirugías programadas para la fecha seleccionada. Puede añadir una nueva cirugía usando el botón."
                    : "Por favor, espere mientras se carga la agenda."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
