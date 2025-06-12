'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, Search, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Surgery, NonSurgicalPatient, ShiftNovelty } from '@/lib/types';
import { MOCK_SURGERIES_STORAGE_KEY, MOCK_NON_SURGICAL_STORAGE_KEY, MOCK_NOVELTIES_STORAGE_KEY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

interface ShiftRecord {
  date: string;
  time: string;
  closingSurgeon: string;
  surgeries: Surgery[];
  nonSurgicalPatients: NonSurgicalPatient[];
  shiftNovelties: ShiftNovelty[];
}

export default function HistoricalLogView() {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [shiftRecords, setShiftRecords] = useState<ShiftRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedShifts = localStorage.getItem('shift_history');
      console.log('Stored shifts:', storedShifts); // Debug log
      if (storedShifts) {
        const parsedShifts = JSON.parse(storedShifts);
        console.log('Parsed shifts:', parsedShifts); // Debug log
        setShiftRecords(parsedShifts);
      } else {
        console.log('No shifts found in localStorage'); // Debug log
        setShiftRecords([]);
      }
    } catch (error) {
      console.error("Error loading shift history:", error);
      toast({
        title: "Error de Carga",
        description: "No se pudieron cargar los registros históricos.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const filteredShifts = useMemo(() => {
    if (!startDate || !endDate) return shiftRecords;
    return shiftRecords.filter(shift => {
      try {
        const shiftDate = parseISO(shift.date);
        return isWithinInterval(shiftDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
      } catch (e) {
        console.error('Error filtering shift:', e);
        return false;
      }
    });
  }, [shiftRecords, startDate, endDate]);

  const handleDownloadPdf = () => {
    toast({
      title: 'Descarga PDF (Próximamente)',
      description: 'La funcionalidad para descargar el historial en PDF estará disponible pronto.',
    });
  };
  
  const noDataInRange = !isLoading && startDate && endDate && filteredShifts.length === 0;

  const renderShiftRecord = (record: ShiftRecord) => {
    const completedSurgeries = record.surgeries.filter(s => s.status === 'Completed');
    const pendingSurgeries = record.surgeries.filter(s => s.status === 'Scheduled');

    return (
      <Card key={`${record.date}-${record.time}`} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Turno del {format(parseISO(record.date), 'PPP', { locale: es })}</CardTitle>
              <CardDescription>
                Cerrado por {record.closingSurgeon} a las {record.time}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cirugías Completadas */}
            {completedSurgeries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Pacientes Operados</h3>
                <div className="space-y-2">
                  {completedSurgeries.map(surgery => (
                    <div key={surgery.id} className="p-2 bg-muted rounded-md">
                      <p><strong>{surgery.patientName}</strong> - {surgery.procedureType}</p>
                      <p className="text-sm text-muted-foreground">Diagnóstico: {surgery.diagnosticoPreOperatorio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cirugías Pendientes */}
            {pendingSurgeries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Cirugías Pendientes</h3>
                <div className="space-y-2">
                  {pendingSurgeries.map(surgery => (
                    <div key={surgery.id} className="p-2 bg-muted rounded-md">
                      <p><strong>{surgery.patientName}</strong> - {surgery.procedureType}</p>
                      <p className="text-sm text-muted-foreground">Diagnóstico: {surgery.diagnosticoPreOperatorio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pacientes No Quirúrgicos */}
            {record.nonSurgicalPatients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Pacientes No Quirúrgicos</h3>
                <div className="space-y-2">
                  {record.nonSurgicalPatients.map(patient => (
                    <div key={patient.id} className="p-2 bg-muted rounded-md">
                      <p><strong>{patient.name}</strong></p>
                      <p className="text-sm text-muted-foreground">Diagnóstico: {patient.diagnosis}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Novedades del Turno */}
            {record.shiftNovelties.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Novedades</h3>
                <div className="space-y-2">
                  {record.shiftNovelties.map(novelty => (
                    <div key={novelty.id} className="p-2 bg-muted rounded-md">
                      <p><strong>{novelty.time}</strong> - {novelty.text}</p>
                      <p className="text-sm text-muted-foreground">Reportado por: {novelty.reportedBy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[280px] justify-start text-left font-normal h-11",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar fecha de inicio</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              locale={es}
              disabled={(date) => date > (endDate || new Date()) || date > new Date()}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[280px] justify-start text-left font-normal h-11",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha de fin</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              locale={es}
              disabled={(date) => date < (startDate || new Date(0)) || date > new Date()}
            />
          </PopoverContent>
        </Popover>
         <Button 
            onClick={handleDownloadPdf} 
            className="w-full sm:w-auto h-11"
            disabled={isLoading || (!startDate || !endDate) || noDataInRange}
          >
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredShifts.length === 0 ? (
        <Alert variant="default" className="mt-6">
          <Search className="h-4 w-4" />
          <AlertTitle>Sin Resultados</AlertTitle>
          <AlertDescription>
            No se encontraron registros de turnos para el rango de fechas seleccionado.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          {filteredShifts.map(renderShiftRecord)}
        </div>
      )}
    </div>
  );
}

