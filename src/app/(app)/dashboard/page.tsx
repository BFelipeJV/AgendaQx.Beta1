
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, BookOpen, Settings2, ListPlus, FilePlus2, BedDouble, FileClock, ClipboardEdit, ArrowRight } from 'lucide-react';
import OnCallSurgeonsDisplay from '@/components/dashboard/on-call-surgeons';
import { APP_HEADER_TITLE } from '@/lib/constants';

const registrationActions = [
  {
    title: 'Cirugía o Procedimiento',
    href: '/cirugias/registrar/procedimiento',
    icon: FilePlus2,
  },
  {
    title: 'Ingreso Paciente No Quirúrgico',
    href: '/cirugias/registrar/no-quirurgico',
    icon: BedDouble,
  },
  {
    title: 'Cirugía o Procedimiento Pendiente',
    href: '/cirugias/registrar/pendiente',
    icon: FileClock,
  },
  {
    title: 'Novedades del Turno',
    href: '/cirugias/registrar/novedades-turno',
    icon: ClipboardEdit,
  },
];

const logbookActions = [
  { title: 'Hoja Diaria', href: '/agenda/hoy' },
  { title: 'Histórico', href: '/historial' },
];

const shiftManagementActions = [
  { title: 'Calendario de Turnos', href: '/turnos' },
  { title: 'Solicitud de Permisos', href: '/turnos/solicitar-permiso' },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-lg py-6 px-4 space-y-8">
      <header className="text-center py-4">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          {APP_HEADER_TITLE}
        </h1>
      </header>

      <OnCallSurgeonsDisplay />

      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Edit2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">REGISTRAR</h2>
        </div>
        <div className="space-y-3">
          {registrationActions.map((action) => (
            <Link key={action.title} href={action.href} passHref>
              <Button variant="default" className="w-full h-12 text-base justify-start px-4 shadow-md hover:bg-primary/90">
                <action.icon className="mr-3 h-5 w-5" />
                {action.title}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">LIBRO</h2>
        </div>
        <div className="space-y-3">
          {logbookActions.map((action) => (
            <Link key={action.title} href={action.href} passHref>
              <Button variant="secondary" className="w-full h-12 text-base shadow-md hover:bg-secondary/90">
                {action.title}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">GESTIÓN DE TURNOS</h2>
        </div>
        <div className="space-y-3">
          {shiftManagementActions.map((action) => (
            <Link key={action.title} href={action.href} passHref>
              <Button variant="secondary" className="w-full h-12 text-base shadow-md hover:bg-secondary/90">
                {action.title}
              </Button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
