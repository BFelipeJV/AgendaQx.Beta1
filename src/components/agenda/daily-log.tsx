import type { Surgery } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit3, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Dummy data for today's surgeries
const todaysSurgeries: Surgery[] = [
  { id: 's001', patientName: 'Eleanor Vance', patientId: 'P007', procedureType: 'Coronary Bypass', surgeon: 'Dr. Smith', date: new Date().toISOString().split('T')[0], time: '08:00', operatingRoom: 'OR-1', status: 'Scheduled' },
  { id: 's002', patientName: 'Marcus Cole', patientId: 'P008', procedureType: 'Hernia Repair', surgeon: 'Dr. Jones', date: new Date().toISOString().split('T')[0], time: '10:30', operatingRoom: 'OR-2', status: 'Completed' },
  { id: 's003', patientName: 'Lena Petrova', patientId: 'P009', procedureType: 'Cesarean Section', surgeon: 'Dr. Garcia', date: new Date().toISOString().split('T')[0], time: '12:00', operatingRoom: 'OR-EMG', status: 'Scheduled' },
  { id: 's004', patientName: 'Raj Patel', patientId: 'P010', procedureType: 'Cataract Surgery', surgeon: 'Dr. Lee', date: new Date().toISOString().split('T')[0], time: '14:00', operatingRoom: 'OR-3', status: 'Cancelled' },
  { id: 's005', patientName: 'Sofia Reyes', patientId: 'P011', procedureType: 'Tonsillectomy', surgeon: 'Dr. Smith', date: new Date().toISOString().split('T')[0], time: '16:00', operatingRoom: 'OR-1', status: 'Scheduled' },
];

const StatusBadge = ({ status }: { status: Surgery['status'] }) => {
  switch (status) {
    case 'Scheduled':
      return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><Clock className="mr-1 h-3 w-3" />{status}</Badge>;
    case 'Completed':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />{status}</Badge>;
    case 'Cancelled':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};


export default function DailyLog() {
  if (todaysSurgeries.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No surgeries scheduled for today.</p>;
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-md">
      <Table>
        <TableCaption>A list of surgical procedures for today.</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Surgeon</TableHead>
            <TableHead>OR</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todaysSurgeries.map((surgery) => (
            <TableRow key={surgery.id} className="hover:bg-muted/20">
              <TableCell className="font-medium">{surgery.time}</TableCell>
              <TableCell>{surgery.patientName} <span className="text-xs text-muted-foreground">({surgery.patientId})</span></TableCell>
              <TableCell>{surgery.procedureType}</TableCell>
              <TableCell>{surgery.surgeon}</TableCell>
              <TableCell>{surgery.operatingRoom}</TableCell>
              <TableCell><StatusBadge status={surgery.status} /></TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={surgery.status !== 'Scheduled'}>
                       <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={surgery.status === 'Cancelled' || surgery.status === 'Completed'}>
                       <Trash2 className="mr-2 h-4 w-4" />
                      Cancel Surgery
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
