
'use client';

import React, { useState, useEffect } from 'react';
import { DayPicker, type DayContentProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; 
import { es } from 'date-fns/locale';
import { addYears, subYears, getDate, getMonth, isSameDay, format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ShiftAssignment, AssignedPersonnel } from '@/lib/types'; 

interface ShiftCalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date?: Date) => void;
  shiftData: ShiftAssignment[];
}

function CustomDayContent(props: DayContentProps & { shiftDataForDay?: ShiftAssignment }) {
  const { date, displayMonth, shiftDataForDay } = props;
  const dayNumber = getDate(date);
  const isCurrentMonth = getMonth(date) === getMonth(displayMonth);

  return (
    <div className={cn(
      "h-36 w-full p-1 text-xs relative flex flex-col justify-start items-start overflow-y-auto", 
      !isCurrentMonth && "text-muted-foreground/50",
      isCurrentMonth && "cursor-pointer hover:bg-muted/30 transition-colors duration-150"
    )}>
      <span className={cn(
        "absolute top-1 right-1 font-medium text-sm z-10",
        isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"
      )}>
        {dayNumber}
      </span>
      {isCurrentMonth && shiftDataForDay && (
        <div className="mt-5 w-full space-y-0.5">
          <div className={cn(
            "p-1 rounded-md w-full text-xs shadow-sm border font-semibold truncate",
            shiftDataForDay.bgColorClass,
            shiftDataForDay.borderColorClass
          )}>
            {shiftDataForDay.shiftLabel}
          </div>
          {shiftDataForDay.assignedPersonnel.length > 0 ? 
            shiftDataForDay.assignedPersonnel.map((person) => (
              <div key={person.surgeonId} className={cn(
                "p-0.5 rounded-sm w-full text-[10px] truncate",
                 shiftDataForDay.bgColorClass, 
                 "opacity-80" // Slightly transparent to differentiate from main shift label
              )}>
                {person.surgeonName} 
              </div>
            ))
            : <p className="italic text-[10px] text-muted-foreground mt-1">&nbsp;Sin personal</p> 
          }
        </div>
      )}
      {!shiftDataForDay && isCurrentMonth && (
         <p className="italic text-[10px] text-muted-foreground/70 mt-6 pl-1">Sin turno base</p>
      )}
    </div>
  );
}


export default function ShiftCalendarView({ selectedDate, onDateSelect, shiftData }: ShiftCalendarViewProps) {
  const initialDisplayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); 
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || initialDisplayMonth);
  const fiveYearsAgo = subYears(new Date(), 5);
  const fiveYearsFromNow = addYears(new Date(), 5);

  useEffect(() => {
    if (selectedDate && (getMonth(selectedDate) !== getMonth(currentMonth) || selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
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
          DayContent: (dayProps) => {
            // Find the shift assignment for THIS specific date.
            // This ensures that if a user assigns someone to a specific "Monday, May 13th",
            // it doesn't use a generic "Turno Lunes" template if one for that specific date exists.
            const shiftForThisSpecificDate = shiftData.find(shift => 
              isSameDay(shift.date, dayProps.date)
            );
            return <CustomDayContent {...dayProps} shiftDataForDay={shiftForThisSpecificDate} />;
          },
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
          day_selected: "bg-primary/20 text-primary-foreground rounded-md focus:outline-none ring-2 ring-primary ring-offset-2", 
          day_today: "font-bold ring-1 ring-accent rounded-md", 
          day_outside: "text-muted-foreground/30",
          day: "h-full w-full", 
        }}
      />
    </div>
  );
}

