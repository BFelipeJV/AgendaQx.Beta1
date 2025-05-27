
'use client';

import React, { useState } from 'react'; // Added useState
import { DayPicker, type DayContentProps, type DayModifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Base styles for DayPicker
import { es } from 'date-fns/locale';
import { addYears, subYears, format, getMonth, getDate, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ShiftAssignment {
  id: string;
  date: Date;
  shiftLabel: string;
  surgeons: string[];
  bgColorClass: string; 
  borderColorClass: string; 
}

interface ShiftCalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date?: Date) => void;
}

// Mock data for May (adjust year as needed) - Surgeon names are now generic
const currentYear = new Date().getFullYear();
const dummyShiftData: ShiftAssignment[] = [
  // Week 1
  { id: 'shift1', date: new Date(currentYear, 4, 1), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift2', date: new Date(currentYear, 4, 2), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 3'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift3', date: new Date(currentYear, 4, 3), shiftLabel: 'Volante 1', surgeons: ['Cirujano Asignado 4', 'Cirujano Asignado 5'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift4', date: new Date(currentYear, 4, 4), shiftLabel: 'Volante 2', surgeons: ['Cirujano Asignado 6'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  // Week 2
  { id: 'shift5', date: new Date(currentYear, 4, 5), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift6', date: new Date(currentYear, 4, 6), shiftLabel: 'Turno Martes', surgeons: ['Cirujano Asignado 3'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift7', date: new Date(currentYear, 4, 7), shiftLabel: 'Turno Miércoles', surgeons: [], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' }, 
  { id: 'shift8', date: new Date(currentYear, 4, 8), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 4', 'Cirujano Asignado 5'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift9', date: new Date(currentYear, 4, 9), shiftLabel: 'Volante 1', surgeons: ['Cirujano Asignado 6'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift10', date: new Date(currentYear, 4, 10), shiftLabel: 'Volante 2', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift11', date: new Date(currentYear, 4, 11), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 3'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' }, 
  // Week 3
  { id: 'shift12', date: new Date(currentYear, 4, 12), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 4', 'Cirujano Asignado 5'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift13', date: new Date(currentYear, 4, 13), shiftLabel: 'Turno Martes', surgeons: ['Cirujano Asignado 6'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift14', date: new Date(currentYear, 4, 14), shiftLabel: 'Turno Miércoles', surgeons: ['Cirujano Asignado 1'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift15', date: new Date(currentYear, 4, 15), shiftLabel: 'Volante 1', surgeons: ['Cirujano Asignado 2', 'Cirujano Asignado 3'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift16', date: new Date(currentYear, 4, 16), shiftLabel: 'Volante 2', surgeons: ['Cirujano Asignado 4'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift17', date: new Date(currentYear, 4, 17), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 5', 'Cirujano Asignado 6'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift18', date: new Date(currentYear, 4, 18), shiftLabel: 'Turno Miércoles', surgeons: ['Cirujano Asignado 1'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  // Week 4
  { id: 'shift19', date: new Date(currentYear, 4, 19), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 2', 'Cirujano Asignado 3'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift20', date: new Date(currentYear, 4, 20), shiftLabel: 'Turno Martes', surgeons: ['Cirujano Asignado 4'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift21', date: new Date(currentYear, 4, 21), shiftLabel: 'Volante 1', surgeons: ['Cirujano Asignado 5', 'Cirujano Asignado 6'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift22', date: new Date(currentYear, 4, 22), shiftLabel: 'Volante 2', surgeons: ['Cirujano Asignado 1'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift23', date: new Date(currentYear, 4, 23), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 2 (desde 14:00)'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift24', date: new Date(currentYear, 4, 24), shiftLabel: 'Turno Miércoles', surgeons: [], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' }, 
  { id: 'shift25', date: new Date(currentYear, 4, 25), shiftLabel: 'Turno Martes', surgeons: ['Cirujano Asignado 3', 'Cirujano Asignado 4'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  // Week 5
  { id: 'shift26', date: new Date(currentYear, 4, 26), shiftLabel: 'Turno Lunes', surgeons: ['Cirujano Asignado 5', 'Cirujano Asignado 6'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift27', date: new Date(currentYear, 4, 27), shiftLabel: 'Volante 1', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift28', date: new Date(currentYear, 4, 28), shiftLabel: 'Volante 2', surgeons: ['Cirujano Asignado 3'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift29', date: new Date(currentYear, 4, 29), shiftLabel: 'Turno Jueves', surgeons: ['Cirujano Asignado 4', 'Cirujano Asignado 5'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift30', date: new Date(currentYear, 4, 30), shiftLabel: 'Turno Miércoles', surgeons: ['Cirujano Asignado 6'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift31', date: new Date(currentYear, 4, 31), shiftLabel: 'Turno Martes', surgeons: ['Cirujano Asignado 1', 'Cirujano Asignado 2'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
];


function CustomDayContent(props: DayContentProps) {
  const { date, displayMonth } = props;
  const dayNumber = getDate(date);
  const isCurrentMonth = getMonth(date) === getMonth(displayMonth);

  const shiftForDay = dummyShiftData.find(shift => 
    isSameDay(shift.date, date)
  );

  return (
    <div className={cn(
      "h-32 w-full p-1 text-sm relative flex flex-col justify-start items-start",
      !isCurrentMonth && "text-muted-foreground/50",
       // Removed hover from here as DayPicker handles selection state styling
      isCurrentMonth && "cursor-pointer"
    )}>
      <span className={cn(
        "absolute top-1 right-1 font-medium",
        isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"
      )}>
        {dayNumber}
      </span>
      {isCurrentMonth && shiftForDay && (
        <div className={cn(
          "mt-5 p-1.5 rounded-md w-full text-xs shadow-sm border",
          shiftForDay.bgColorClass,
          shiftForDay.borderColorClass
        )}>
          <p className="font-semibold truncate">{shiftForDay.shiftLabel}</p>
          {shiftForDay.surgeons.map((surgeon, index) => (
            <p key={index} className="truncate">{surgeon}</p>
          ))}
          {shiftForDay.surgeons.length === 0 && <p className="italic text-xs">&nbsp;</p>} 
        </div>
      )}
    </div>
  );
}


export default function ShiftCalendarView({ selectedDate, onDateSelect }: ShiftCalendarViewProps) {
  const initialDate = new Date(currentYear, 4, 1); 
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || initialDate); // Initialize with selectedDate or initialDate
  const fiveYearsAgo = subYears(new Date(), 5);
  const fiveYearsFromNow = addYears(new Date(), 5);

  // Update currentMonth when selectedDate changes from parent, if it's in a different month
  React.useEffect(() => {
    if (selectedDate && getMonth(selectedDate) !== getMonth(currentMonth)) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate, currentMonth]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-md p-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={es}
        showOutsideDays
        fixedWeeks
        captionLayout="dropdown-buttons" 
        fromDate={fiveYearsAgo} 
        toDate={fiveYearsFromNow}   
        components={{
          DayContent: CustomDayContent,
        }}
        
        className="w-full" 
        classNames={{
          months: "space-y-0", 
          month: "space-y-0 border-collapse w-full", 
          table: "w-full border-collapse", 
          head_row: "flex justify-between border-b",
          head_cell: "w-[calc(100%/7)] py-2 text-sm font-medium text-muted-foreground text-center capitalize", 
          row: "flex w-full border-b last:border-b-0", 
          cell: "w-[calc(100%/7)] border-r last:border-r-0 text-center relative", 
          day: "", // Base day styling
          day_selected: "bg-primary text-primary-foreground !text-primary-foreground rounded-md focus:outline-none ring-2 ring-primary ring-offset-2", // Style for selected day
          day_today: "font-bold ring-1 ring-accent rounded-md", // Today's date with a ring
          day_outside: "text-muted-foreground/30",
        }}
      />
    </div>
  );
}

