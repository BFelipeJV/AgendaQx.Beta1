
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  icon: IconName;
}

interface DashboardSection {
  id: string;
  sectionTitle: string;
  sectionIcon: React.ElementType;
  sectionDescription: string;
  actionItems: ActionItem[];
}

// Helper to get icon component by name
// Map a subset of Lucide icon names to their components. Using `Partial` so the
// object is not required to include every available Lucide icon name.
const IconComponents: Partial<Record<IconName, React.ElementType>> = {
  FilePlus2,
  BedDouble,
  FileClock,
  ClipboardEdit,
  ListChecks,
  History,
  CalendarClock,
  FilePenLine,
  LayoutDashboard: Edit2, // Placeholder
  ListPlus: Edit2, // Placeholder
  LogOut: Edit2, // Placeholder
  UserPlus: Edit2, // Placeholder
  UserCircle: Edit2, // Placeholder
  Settings: Edit2, // Placeholder
  HelpCircle: Edit2, // Placeholder
  Home: Edit2, // Placeholder
};

const dashboardSectionsData: DashboardSection[] = [
  {
    id: 'registrar',
    sectionTitle: 'REGISTRAR',
    sectionIcon: Edit2,
    sectionDescription: 'Añada nuevas cirugías, ingresos, procedimientos pendientes o novedades del turno.',
    actionItems: [
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
    ]
  },
  {
    id: 'libro',
    sectionTitle: 'LIBRO',
    sectionIcon: BookOpen,
    sectionDescription: 'Consulte la hoja diaria de actividades y el historial de registros.',
    actionItems: [
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
    ]
  },
  {
    id: 'gestionTurnos',
    sectionTitle: 'GESTIÓN DE TURNOS',
    sectionIcon: Settings2,
    sectionDescription: 'Visualice el calendario de turnos y gestione las solicitudes de permisos.',
    actionItems: [
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
    ]
  }
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-2xl py-6 px-4 space-y-8">
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          {APP_HEADER_TITLE}
        </h1>
      </header>

      <OnCallSurgeonsDisplay />

      <Accordion type="multiple" defaultValue={['registrar']} className="w-full space-y-4">
        {dashboardSectionsData.map((section) => {
          const SectionIcon = section.sectionIcon;
          return (
            <AccordionItem value={section.id} key={section.id} className="border rounded-lg shadow-md bg-card overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3 w-full">
                  <SectionIcon className="h-7 w-7 text-primary flex-shrink-0" />
                  <div className="flex-grow text-left">
                    <h2 className="text-xl font-semibold text-primary">{section.sectionTitle}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{section.sectionDescription}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 border-t bg-background/50">
                <div className="space-y-3">
                  {section.actionItems.map((action) => {
                    const ActionIcon = IconComponents[action.icon];
                    return (
                      <Link key={action.title} href={action.href} passHref legacyBehavior>
                        <a className="block no-underline">
                          <Button
                            variant="outline"
                            className="w-full h-auto py-4 px-5 flex items-center justify-between text-left rounded-lg shadow-md hover:shadow-lg transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <div className="flex items-center gap-4">
                              {ActionIcon && <ActionIcon className="h-8 w-8 text-primary flex-shrink-0" />}
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
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
