import type { Surgery } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Using ShadCN Calendar as a base
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarCheck, Edit3, Trash2, PlusCircle } from "lucide-react";
import React, { useState } from 'react';

// Dummy data for demonstration
const dummySurgeries: Surgery[] = [
  { id: '1', patientName: 'Alice Wonderland', patientId: 'P001', procedureType: 'Knee Replacement', surgeon: 'Dr. Smith', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], time: '09:00', operatingRoom: 'OR-1', status: 'Scheduled' },
  { id: '2', patientName: 'Bob The Builder', patientId: 'P002', procedureType: 'Gallbladder Removal', surgeon: 'Dr. Jones', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], time: '13:00', operatingRoom: 'OR-2', status: 'Scheduled' },
  { id: '3', patientName: 'Charlie Brown', patientId: 'P003', procedureType: 'Appendectomy', surgeon: 'Dr. Garcia', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], time: '11:00', operatingRoom: 'OR-1', status: 'Scheduled' },
];


export default function ScheduleOverview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [surgeries, setSurgeries] = useState<Surgery[]>(dummySurgeries);

  const surgeriesForSelectedDate = surgeries.filter(
    surgery => new Date(surgery.date).toDateString() === selectedDate?.toDateString()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              
            />
          </CardContent>
        </Card>
         <Button className="w-full mt-4 h-11 text-base">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Surgery
        </Button>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-md h-full">
          <CardHeader>
            <CardTitle>
              Schedule for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No Date Selected'}
            </CardTitle>
            <CardDescription>
              {surgeriesForSelectedDate.length > 0 
                ? `Found ${surgeriesForSelectedDate.length} surgeries.`
                : "No surgeries scheduled for this date."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {surgeriesForSelectedDate.length > 0 ? (
              surgeriesForSelectedDate.map((surgery) => (
                <Card key={surgery.id} className="bg-muted/30 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{surgery.procedureType}</CardTitle>
                        <CardDescription>Patient: {surgery.patientName} (ID: {surgery.patientId})</CardDescription>
                      </div>
                      <Badge variant={surgery.status === 'Scheduled' ? 'default' : 'secondary'} className="capitalize">
                        {surgery.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p><strong>Time:</strong> {surgery.time}</p>
                    <p><strong>Surgeon:</strong> {surgery.surgeon}</p>
                    <p><strong>Operating Room:</strong> {surgery.operatingRoom}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-3 w-3" /> Cancel
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Alert>
                <CalendarCheck className="h-4 w-4" />
                <AlertTitle>All Clear!</AlertTitle>
                <AlertDescription>
                  There are no surgeries scheduled for the selected date. You can add a new surgery using the button.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
