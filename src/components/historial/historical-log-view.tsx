
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, Search } from 'lucide-react';

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

export default function HistoricalLogView() {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date()); // Default to today

  const [allSurgeries, setAllSurgeries] = useState<Surgery[]>([]);
  const [allNonSurgical, setAllNonSurgical] = useState<NonSurgicalPatient[]>([]);
  const [allNovelties, setAllNovelties] = useState<ShiftNovelty[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedSurgeries = localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY);
      setAllSurgeries(storedSurgeries ? JSON.parse(storedSurgeries) : []);

      const storedNonSurgical = localStorage.getItem(MOCK_NON_SURGICAL_STORAGE_KEY);
      setAllNonSurgical(storedNonSurgical ? JSON.parse(storedNonSurgical) : []);

      const storedNovelties = localStorage.getItem(MOCK_NOVELTIES_STORAGE_KEY);
      setAllNovelties(storedNovelties ? JSON.parse(storedNovelties) : []);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast({
        title: "Error de Carga",
        description: "No se pudieron cargar los datos históricos desde el almacenamiento local.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const filteredSurgeries = useMemo(() => {
    if (!startDate || !endDate) return [];
    return allSurgeries.filter(surgery => {
      try {
        const surgeryDate = parseISO(surgery.date); // surgery.date is 'YYYY-MM-DD'
        return isWithinInterval(surgeryDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
      } catch (e) { return false; }
    });
  }, [allSurgeries, startDate, endDate]);

  const filteredNonSurgical = useMemo(() => {
    if (!startDate || !endDate) return [];
    return allNonSurgical.filter(patient => {
       try {
        const entryDate = parseISO(patient.entryTimestamp);
        return isWithinInterval(entryDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
      } catch (e) { return false; }
    });
  }, [allNonSurgical, startDate, endDate]);

  const filteredNovelties = useMemo(() => {
    if (!startDate || !endDate) return [];
    return allNovelties.filter(novelty => {
      try {
        const entryDate = parseISO(novelty.entryTimestamp);
        return isWithinInterval(entryDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
      } catch (e) { return false; }
    });
  }, [allNovelties, startDate, endDate]);

  const handleDownloadPdf = () => {
    toast({
      title: 'Descarga PDF (Próximamente)',
      description: 'La funcionalidad para descargar el historial en PDF estará disponible pronto.',
    });
  };
  
  const noDataInRange = !isLoading && startDate && endDate && filteredSurgeries.length === 0 && filteredNonSurgical.length === 0 && filteredNovelties.length === 0;

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

      {isLoading && <p className="text-muted-foreground text-center py-4">Cargando datos históricos...</p>}
      
      {!isLoading && (!startDate || !endDate) && (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertTitle>Seleccione un Rango de Fechas</AlertTitle>
          <AlertDescription>
            Por favor, elija una fecha de inicio y una fecha de fin para ver los registros históricos.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && startDate && endDate && (
        <>
          {noDataInRange && (
             <Alert variant="default" className="mt-6">
                <Search className="h-4 w-4" />
                <AlertTitle>Sin Resultados</AlertTitle>
                <AlertDescription>
                  No se encontraron registros para el rango de fechas seleccionado.
                </AlertDescription>
            </Alert>
          )}

          {filteredSurgeries.length > 0 && (
            <div className="space-y-2 pt-4">
              <h3 className="text-xl font-semibold text-primary">Cirugías y Procedimientos</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Procedimiento</TableHead>
                    <TableHead>Cirujano</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurgeries.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.date ? format(parseISO(s.date), 'dd/MM/yyyy', { locale: es }) : 'N/A'}</TableCell>
                      <TableCell>{s.patientName}</TableCell>
                      <TableCell>{s.procedureType}</TableCell>
                      <TableCell>{s.surgeon || 'N/A'}</TableCell>
                      <TableCell><Badge variant={s.status === 'Cancelled' ? 'destructive' : s.status === 'Completed' ? 'default' : 'secondary' } className={cn(s.status === 'Completed' && 'bg-green-600 hover:bg-green-700')}>{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                 <TableCaption>Total de cirugías/procedimientos en el rango: {filteredSurgeries.length}</TableCaption>
              </Table>
            </div>
          )}

          {filteredNonSurgical.length > 0 && (
            <div className="space-y-2 pt-6">
              <h3 className="text-xl font-semibold text-primary">Pacientes No Quirúrgicos</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha Ingreso</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Médico Tratante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNonSurgical.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.entryTimestamp ? format(parseISO(p.entryTimestamp), 'dd/MM/yyyy HH:mm', { locale: es }) : 'N/A'}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.diagnosis}</TableCell>
                      <TableCell>{p.attending}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Total de pacientes no quirúrgicos en el rango: {filteredNonSurgical.length}</TableCaption>
              </Table>
            </div>
          )}

          {filteredNovelties.length > 0 && (
            <div className="space-y-2 pt-6">
              <h3 className="text-xl font-semibold text-primary">Novedades del Turno</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Novedad</TableHead>
                    <TableHead>Reportado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNovelties.map(n => (
                    <TableRow key={n.id}>
                      <TableCell>{n.entryTimestamp ? format(parseISO(n.entryTimestamp), 'dd/MM/yyyy HH:mm', { locale: es }) : 'N/A'}</TableCell>
                      <TableCell className="whitespace-pre-wrap max-w-md">{n.text}</TableCell>
                      <TableCell>{n.reportedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Total de novedades en el rango: {filteredNovelties.length}</TableCaption>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

