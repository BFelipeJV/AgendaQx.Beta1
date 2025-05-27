
'use client';

import React, { useState, useEffect } from 'react';
import { DayPicker, type DayContentProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; 
import { es } from 'date-fns/locale';
import { addYears, subYears, getDate, getMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ShiftAssignment } from '@/lib/types'; // Import ShiftAssignment type

interface ShiftCalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date?: Date) => void;
  shiftData: ShiftAssignment[]; // Accept shift data as a prop
}

// No longer need dummyShiftData here, it will come from props


function CustomDayContent(props: DayContentProps & { shiftData: ShiftAssignment[] }) {
  const { date, displayMonth, shiftData: allShifts } = props; // Destructure allShifts
  const dayNumber = getDate(date);
  const isCurrentMonth = getMonth(date) === getMonth(displayMonth);

  const shiftForDay = allShifts.find(shift => 
    isSameDay(shift.date, date)
  );

  return (
    <div className={cn(
      "h-32 w-full p-1 text-sm relative flex flex-col justify-start items-start",
      !isCurrentMonth && "text-muted-foreground/50",
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
          {shiftForDay.surgeons.length > 0 ? 
            shiftForDay.surgeons.map((surgeon, index) => (
              <p key={index} className="truncate">{surgeon}</p>
            ))
            : <p className="italic text-xs">&nbsp;Sin asignar</p> 
          }
        </div>
      )}
    </div>
  );
}


export default function ShiftCalendarView({ selectedDate, onDateSelect, shiftData }: ShiftCalendarViewProps) {
  const initialDisplayMonth = new Date(new Date().getFullYear(), 4, 1); // Example: May of current year
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || initialDisplayMonth);
  const fiveYearsAgo = subYears(new Date(), 5);
  const fiveYearsFromNow = addYears(new Date(), 5);

  useEffect(() => {
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
          DayContent: (dayProps) => <CustomDayContent {...dayProps} shiftData={shiftData} />,
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
          day_selected: "bg-primary text-primary-foreground !text-primary-foreground rounded-md focus:outline-none ring-2 ring-primary ring-offset-2", 
          day_today: "font-bold ring-1 ring-accent rounded-md", 
          day_outside: "text-muted-foreground/30",
        }}
      />
    </div>
  );
}
