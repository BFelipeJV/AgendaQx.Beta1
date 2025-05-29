import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ListChecks, UserPlus, CalendarClock, History, ListPlus as ListPlusIcon } from 'lucide-react'; // Renamed ListPlus to avoid conflict
import { APP_NAME } from '@/lib/constants';

const dashboardFeatures = [
  {
    title: 'Registro de Atenciones',
    description: 'Añade un nuevo registro de atención seleccionando el tipo.',
    href: '/cirugias/registrar',
    icon: ListPlusIcon, // Use the renamed import
    cta: 'Registrar Atención',
  },
  {
    title: 'Registro Diario',
    description: 'Consulta la lista detallada de cirugías y procedimientos para hoy.',
    href: '/agenda/hoy',
    icon: ListChecks,
    cta: 'Ver Registro Diario',
  },
  {
    title: 'Calendario de Turnos',
    description: 'Visualiza y coordina los turnos de los cirujanos.',
    href: '/turnos',
    icon: CalendarClock,
    cta: 'Ver Calendario de Turnos',
  },
  {
    title: 'Registro Histórico',
    description: 'Consulta y descarga el historial de atenciones pasadas.',
    href: '/historial',
    icon: History,
    cta: 'Ver Historial',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Bienvenido a {APP_NAME}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tu centro de mando para gestionar emergencias y agendas quirúrgicas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dashboardFeatures.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold tracking-tight">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Link href={feature.href} passHref>
                <Button className="w-full h-11 text-base">
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Estadísticas Rápidas (Placeholder)</CardTitle>
          <CardDescription>Resumen de las actividades de hoy.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">5</p>
            <p className="text-sm text-muted-foreground">Cirugías Hoy</p>
          </div>
           <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">2</p>
            <p className="text-sm text-muted-foreground">Quirófanos Disponibles</p>
          </div>
           <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">8</p>
            <p className="text-sm text-muted-foreground">Procedimientos Pendientes</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}