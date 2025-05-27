
'use client';

import React, { useState } from 'react';
import { DayPicker, type DayContentProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Base styles for DayPicker
import { es } from 'date-fns/locale';
import { addMonths, subMonths, format, getYear, getMonth, getDate, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ShiftAssignment {
  id: string;
  date: Date;
  shiftLabel: string;
  surgeons: string[];
  bgColorClass: string; // e.g., 'bg-teal-100 text-teal-800'
  borderColorClass: string; // e.g., 'border-teal-300'
}

// Mock data for May (adjust year as needed)
const currentYear = new Date().getFullYear();
const dummyShiftData: ShiftAssignment[] = [
  // Week 1
  { id: 'shift1', date: new Date(currentYear, 4, 1), shiftLabel: 'Turno jueves', surgeons: ['Arellano', 'Cáceres'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift2', date: new Date(currentYear, 4, 2), shiftLabel: 'Turno lunes', surgeons: ['Neira'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift3', date: new Date(currentYear, 4, 3), shiftLabel: 'Volante 1', surgeons: ['Figueroa', 'Oroz'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift4', date: new Date(currentYear, 4, 4), shiftLabel: 'Volante 2', surgeons: ['Jacubovsky', 'López'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  // Week 2
  { id: 'shift5', date: new Date(currentYear, 4, 5), shiftLabel: 'Turno lunes', surgeons: ['Neira', 'Neufeld'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift6', date: new Date(currentYear, 4, 6), shiftLabel: 'Turno martes', surgeons: ['Astorga', 'Trepat'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift7', date: new Date(currentYear, 4, 7), shiftLabel: 'Turno miércoles', surgeons: [], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' }, // Empty for Carreño as in image
  { id: 'shift8', date: new Date(currentYear, 4, 8), shiftLabel: 'Turno jueves', surgeons: ['Arellano', 'Cáceres'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift9', date: new Date(currentYear, 4, 9), shiftLabel: 'Volante 1', surgeons: ['Figueroa', 'Oroz'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift10', date: new Date(currentYear, 4, 10), shiftLabel: 'Volante 2', surgeons: ['Jacubovsky', 'Cáceres'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift11', date: new Date(currentYear, 4, 11), shiftLabel: 'Turno jueves', surgeons: ['Arellano', 'López'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' }, // Adjusted, was "Turno Jueves" in image but on a Sat
  // Week 3
  { id: 'shift12', date: new Date(currentYear, 4, 12), shiftLabel: 'Turno lunes', surgeons: ['Neira', 'Neufeld'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift13', date: new Date(currentYear, 4, 13), shiftLabel: 'Turno martes', surgeons: ['Astorga', 'Lopez'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift14', date: new Date(currentYear, 4, 14), shiftLabel: 'Turno miércoles', surgeons: ['Carreño'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift15', date: new Date(currentYear, 4, 15), shiftLabel: 'Volante 1', surgeons: ['Figueroa', 'Oroz'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift16', date: new Date(currentYear, 4, 16), shiftLabel: 'Volante 2', surgeons: ['Jacubovsky', 'López'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift17', date: new Date(currentYear, 4, 17), shiftLabel: 'Turno jueves', surgeons: ['Arellano', 'Cáceres'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift18', date: new Date(currentYear, 4, 18), shiftLabel: 'Turno miércoles', surgeons: ['Carreño'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  // Week 4
  { id: 'shift19', date: new Date(currentYear, 4, 19), shiftLabel: 'Turno lunes', surgeons: ['Neira', 'Neufeld'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift20', date: new Date(currentYear, 4, 20), shiftLabel: 'Turno martes', surgeons: ['Astorga', 'López'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift21', date: new Date(currentYear, 4, 21), shiftLabel: 'Volante 1', surgeons: ['Figueroa', 'Oroz'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift22', date: new Date(currentYear, 4, 22), shiftLabel: 'Volante 2', surgeons: ['López'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift23', date: new Date(currentYear, 4, 23), shiftLabel: 'Turno jueves', surgeons: ['Carreño (desde 14:00)'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift24', date: new Date(currentYear, 4, 24), shiftLabel: 'Turno miércoles', surgeons: [], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' }, // Empty from image
  { id: 'shift25', date: new Date(currentYear, 4, 25), shiftLabel: 'Turno martes', surgeons: ['Astorga', 'Trepat'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  // Week 5
  { id: 'shift26', date: new Date(currentYear, 4, 26), shiftLabel: 'Turno lunes', surgeons: ['Neira', 'Neufeld'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift27', date: new Date(currentYear, 4, 27), shiftLabel: 'Volante 1', surgeons: ['Figueroa', 'Oroz'], bgColorClass: 'bg-green-100 text-green-800', borderColorClass: 'border-green-300' },
  { id: 'shift28', date: new Date(currentYear, 4, 28), shiftLabel: 'Volante 2', surgeons: ['López'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift29', date: new Date(currentYear, 4, 29), shiftLabel: 'Turno jueves', surgeons: ['Arellano', 'Cáceres'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
  { id: 'shift30', date: new Date(currentYear, 4, 30), shiftLabel: 'Turno miércoles', surgeons: ['Figueroa', 'Oroz'], bgColorClass: 'bg-teal-100 text-teal-800', borderColorClass: 'border-teal-300' },
  { id: 'shift31', date: new Date(currentYear, 4, 31), shiftLabel: 'Turno martes', surgeons: ['Astorga', 'Trepat'], bgColorClass: 'bg-sky-100 text-sky-800', borderColorClass: 'border-sky-300' },
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
      isCurrentMonth && "hover:bg-accent/10 cursor-pointer" // Basic hover for current month days
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


export default function ShiftCalendarView() {
  const initialDate = new Date(currentYear, 4, 1); // May of current year
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth} aria-label="Mes anterior">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-center text-primary capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Mes siguiente">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <DayPicker
        month={currentMonth}
        onMonthChange={setCurrentMonth} // Allows DayPicker's internal nav if not using custom
        locale={es}
        showOutsideDays
        fixedWeeks
        components={{
          DayContent: CustomDayContent,
        }}
        
        // Custom class names for DayPicker elements to match style
        className="w-full" // Make DayPicker take full width of its container
        classNames={{
          months: "space-y-0", // Remove default space if DayPicker renders multiple months
          month: "space-y-0 border-collapse w-full", // Ensure month takes full width
          table: "w-full border-collapse", // Table should take full width
          head_row: "flex justify-between border-b",
          head_cell: "w-[calc(100%/7)] py-2 text-sm font-medium text-muted-foreground text-center capitalize", // Ensure cells take equal width
          row: "flex w-full border-b last:border-b-0", // Ensure rows take full width
          cell: "w-[calc(100%/7)] border-r last:border-r-0 text-center relative", // Ensure cells take equal width and have borders
          day: "", // Remove default button styling for the day itself, CustomDayContent handles it
          day_selected: "", // No selection styling needed here
          day_today: "font-bold", // Example: make today bold
          day_outside: "text-muted-foreground/30",
          caption_label: "hidden", // Hide default caption label as we have custom one
          nav_button_previous: "hidden", // Hide default nav buttons
          nav_button_next: "hidden", // Hide default nav buttons
        }}
      />
      {/* Action buttons (e.g., Add Shift) can go here */}
    </div>
  );
}

// Add some CSS to globals.css or a local style tag if absolutely necessary
// For example, to ensure day cells have a minimum height and proper borders:
// .rdp-cell { min-height: 8rem; /* Or desired height */ }
// .rdp-row { border-bottom: 1px solid hsl(var(--border)); }
// .rdp-row:last-child { border-bottom: none; }
// .rdp-cell { border-right: 1px solid hsl(var(--border)); }
// .rdp-cell:last-child { border-right: none; }
// These might be better handled by DayPicker's classNames prop and Tailwind above.

