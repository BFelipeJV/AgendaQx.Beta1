'use client';

import React, { useState } from 'react';
import { DayPicker, type DayContentProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Base styles for DayPicker
import { es } from 'date-fns/locale';
import { addYears, subYears, format, getMonth, getDate, isSameDay } from 'date-fns'; // Removed addMonths, subMonths as DayPicker handles it
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Kept for potential future custom elements if needed, but not used by default DayPicker nav
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
  const fiveYearsAgo = subYears(new Date(), 5);
  const fiveYearsFromNow = addYears(new Date(), 5);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-md p-4">
      {/* Custom navigation buttons and header removed, DayPicker's captionLayout handles this */}
      <DayPicker
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={es}
        showOutsideDays
        fixedWeeks
        captionLayout="dropdown-buttons" // Enables dropdowns for month/year and prev/next buttons
        fromDate={fiveYearsAgo} // Sets the earliest year selectable in dropdown
        toDate={fiveYearsFromNow}   // Sets the latest year selectable in dropdown
        components={{
          DayContent: CustomDayContent,
          // IconLeft and IconRight can be customized if needed, but default icons will be used for dropdown-buttons layout
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
          day: "", 
          day_selected: "", 
          day_today: "font-bold", 
          day_outside: "text-muted-foreground/30",
          // caption_label, nav_button_previous, nav_button_next are handled by captionLayout="dropdown-buttons"
          // We don't need to hide them explicitly anymore if we want DayPicker's default controls.
          // If specific styling for the new caption is needed, target .rdp-caption_label, .rdp-nav_button etc.
          // For example, if built-in buttons are too small:
          // nav_button: "h-8 w-8 p-0", // Example to make default nav buttons larger
        }}
      />
    </div>
  );
}

// Ensure these styles are in globals.css or handled by Tailwind if DayPicker defaults aren't sufficient:
// .rdp-caption_label { font-size: 1.25rem; font-weight: 600; }
// .rdp-nav_button { border: 1px solid hsl(var(--border)); border-radius: var(--radius); }
// .rdp-dropdown_month, .rdp-dropdown_year { padding: 0.25rem 0.5rem; border-radius: var(--radius); border: 1px solid hsl(var(--border)); }

