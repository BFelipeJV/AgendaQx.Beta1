
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Edit2, 
  BookOpen, 
  Settings2, 
  FilePlus2, 
  BedDouble, 
  FileClock, 
  ClipboardEdit, 
  ArrowRight,
  ListChecks,
  History,
  CalendarClock,
  FilePenLine
} from 'lucide-react';
import OnCallSurgeonsDisplay from '@/components/dashboard/on-call-surgeons';
import { APP_HEADER_TITLE } from '@/lib/constants';
import type { IconName } from '@/lib/types';

interface ActionItem {
  title: string;
  description: string;
  href: string;
  icon: IconName; // Using IconName type
}

const registrationActions: ActionItem[] = [
  {
    title: 'Cirugía o Procedimiento',
    description: 'Registrar una nueva intervención quirúrgica o procedimiento.',
    href: '/cirugias/registrar/procedimiento',
    icon: 'FilePlus2',
  },
  {
    title: 'Ingreso Paciente No Quirúrgico',
    description: 'Registrar el ingreso de un paciente que no requiere cirugía.',
    href: '/cirugias/registrar/no-quirurgico',
    icon: 'BedDouble',
  },
  {
    title: 'Cirugía o Procedimiento Pendiente',
    description: 'Registrar o actualizar información de un procedimiento pendiente.',
    href: '/cirugias/registrar/pendiente',
    icon: 'FileClock',
  },
  {
    title: 'Novedades del Turno',
    description: 'Anotar novedades relevantes ocurridas durante el turno.',
    href: '/cirugias/registrar/novedades-turno',
    icon: 'ClipboardEdit',
  },
];

const logbookActions: ActionItem[] = [
  { 
    title: 'Hoja Diaria', 
    description: 'Resumen de actividades y estado de pacientes para hoy.',
    href: '/agenda/hoy',
    icon: 'ListChecks' 
  },
  { 
    title: 'Registro Histórico', 
    description: 'Consultar y descargar el historial de atenciones pasadas.',
    href: '/historial',
    icon: 'History'
  },
];

const shiftManagementActions: ActionItem[] = [
  { 
    title: 'Calendario de Turnos', 
    description: 'Visualizar y coordinar los turnos de los cirujanos.',
    href: '/turnos',
    icon: 'CalendarClock'
  },
  { 
    title: 'Solicitud de Permisos', 
    description: 'Gestionar solicitudes de permisos o cambios de turno.',
    href: '/turnos/solicitar-permiso',
    icon: 'FilePenLine'
  },
];

// Helper to get icon component by name
const IconComponents: Record<IconName, React.ElementType> = {
  FilePlus2,
  BedDouble,
  FileClock,
  ClipboardEdit,
  ListChecks,
  History,
  CalendarClock,
  FilePenLine,
  // Add other icons used by NavLinks if necessary, or ensure NavLinks has its own lookup
  LayoutDashboard: Edit2, // Placeholder if not used directly here
  ListPlus: Edit2, // Placeholder
  LogOut: Edit2, // Placeholder
  UserPlus: Edit2, // Placeholder
  UserCircle: Edit2, // Placeholder
  Settings: Edit2, // Placeholder
  HelpCircle: Edit2, // Placeholder
  Home: Edit2, // Placeholder
};


export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-xl py-6 px-4 space-y-8"> {/* Adjusted max-w for better card display */}
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          {APP_HEADER_TITLE}
        </h1>
      </header>

      <OnCallSurgeonsDisplay />

      <section className="space-y-4">
        <div className="flex items-center space-x-3 mb-3">
          <Edit2 className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-semibold text-primary">REGISTRAR</h2>
        </div>
        <div className="space-y-3">
          {registrationActions.map((action) => {
            const Icon = IconComponents[action.icon];
            return (
              <Link key={action.title} href={action.href} passHref legacyBehavior>
                <a className="block no-underline">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 px-5 flex items-center justify-between text-left rounded-lg shadow-md hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-4">
                      {Icon && <Icon className="h-8 w-8 text-primary flex-shrink-0" />}
                      <div className="flex-grow">
                        <p className="font-semibold text-base text-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-3 flex-shrink-0" />
                  </Button>
                </a>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-semibold text-primary">LIBRO</h2>
        </div>
        <div className="space-y-3">
          {logbookActions.map((action) => {
            const Icon = IconComponents[action.icon];
            return (
            <Link key={action.title} href={action.href} passHref legacyBehavior>
                <a className="block no-underline">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 px-5 flex items-center justify-between text-left rounded-lg shadow-md hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-4">
                      {Icon && <Icon className="h-8 w-8 text-primary flex-shrink-0" />}
                      <div className="flex-grow">
                        <p className="font-semibold text-base text-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-3 flex-shrink-0" />
                  </Button>
                </a>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-3 mb-3">
          <Settings2 className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-semibold text-primary">GESTIÓN DE TURNOS</h2>
        </div>
        <div className="space-y-3">
          {shiftManagementActions.map((action) => {
            const Icon = IconComponents[action.icon];
            return (
             <Link key={action.title} href={action.href} passHref legacyBehavior>
                <a className="block no-underline">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 px-5 flex items-center justify-between text-left rounded-lg shadow-md hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center gap-4">
                      {Icon && <Icon className="h-8 w-8 text-primary flex-shrink-0" />}
                      <div className="flex-grow">
                        <p className="font-semibold text-base text-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-3 flex-shrink-0" />
                  </Button>
                </a>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
