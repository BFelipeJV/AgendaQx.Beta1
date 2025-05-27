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
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils'; // Import cn for conditional class names

// Dummy data for today's surgeries
const todaysSurgeries: Surgery[] = [
  { id: 's001', patientName: 'Eleonora Vance', patientId: 'P007', procedureType: 'Bypass Coronario', surgeon: 'Dr. Pérez', date: new Date().toISOString().split('T')[0], time: '08:00', operatingRoom: 'Q-1', status: 'Scheduled' },
  { id: 's002', patientName: 'Marcos Cole', patientId: 'P008', procedureType: 'Reparación de Hernia', surgeon: 'Dr. López', date: new Date().toISOString().split('T')[0], time: '10:30', operatingRoom: 'Q-2', status: 'Completed' },
  { id: 's003', patientName: 'Lena Petrova', patientId: 'P009', procedureType: 'Cesárea', surgeon: 'Dr. García', date: new Date().toISOString().split('T')[0], time: '12:00', operatingRoom: 'Q-EMG', status: 'Scheduled' },
  { id: 's004', patientName: 'Raj Patel', patientId: 'P010', procedureType: 'Cirugía de Cataratas', surgeon: 'Dr. Lee', date: new Date().toISOString().split('T')[0], time: '14:00', operatingRoom: 'Q-3', status: 'Cancelled' },
  { id: 's005', patientName: 'Sofía Reyes', patientId: 'P011', procedureType: 'Amigdalectomía', surgeon: 'Dr. Pérez', date: new Date().toISOString().split('T')[0], time: '16:00', operatingRoom: 'Q-1', status: 'Scheduled' },
];

const StatusBadge = ({ status }: { status: Surgery['status'] }) => {
  let text: string;
  let icon: React.ReactNode;
  let className: string;

  switch (status) {
    case 'Scheduled':
      text = 'Programada';
      icon = <Clock className="mr-1 h-3 w-3" />;
      className = 'bg-blue-500 hover:bg-blue-600';
      break;
    case 'Completed':
      text = 'Completada';
      icon = <CheckCircle className="mr-1 h-3 w-3" />;
      className = 'bg-green-500 hover:bg-green-600';
      break;
    case 'Cancelled':
      text = 'Cancelada';
      icon = <XCircle className="mr-1 h-3 w-3" />;
      className = 'bg-destructive hover:bg-destructive/80'; // Use destructive variant color
      break;
    default:
      text = status;
      icon = null;
      className = 'bg-secondary hover:bg-secondary/80'; // Use secondary variant color
      break;
  }
  return <Badge variant={status === 'Cancelled' ? 'destructive' : 'default'} className={cn(className, status !== 'Cancelled' && 'text-primary-foreground')}>{icon}{text}</Badge>;
};


export default function DailyLog() {
  if (todaysSurgeries.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay cirugías programadas para hoy.</p>;
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-md">
      <Table>
        <TableCaption>Una lista de los procedimientos quirúrgicos para hoy.</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Hora</TableHead>
            <TableHead>Nombre Paciente</TableHead>
            <TableHead>Procedimiento</TableHead>
            <TableHead>Cirujano</TableHead>
            <TableHead>Quirófano</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
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
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={surgery.status !== 'Scheduled'}>
                       <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como Completada
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={surgery.status === 'Cancelled' || surgery.status === 'Completed'}>
                       <Trash2 className="mr-2 h-4 w-4" />
                      Cancelar Cirugía
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
