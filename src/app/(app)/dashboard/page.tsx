import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CalendarDays, ListChecks, UserPlus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const dashboardFeatures = [
  {
    title: 'Register New Surgery',
    description: 'Quickly add a new surgical procedure to the schedule.',
    href: '/cirugias/registrar',
    icon: UserPlus,
    cta: 'Register Surgery',
  },
  {
    title: 'View Surgical Schedule',
    description: 'Access the main calendar to view and manage all upcoming surgeries.',
    href: '/agenda',
    icon: CalendarDays,
    cta: 'View Schedule',
  },
  {
    title: 'Today\'s Surgical Log',
    description: 'See a detailed list of all surgeries and procedures scheduled for today.',
    href: '/agenda/hoy',
    icon: ListChecks,
    cta: 'View Daily Log',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Welcome to {APP_NAME}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your central hub for managing surgical emergencies and schedules.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardFeatures.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
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
          <CardTitle>Quick Stats (Placeholder)</CardTitle>
          <CardDescription>Overview of today's activities.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">5</p>
            <p className="text-sm text-muted-foreground">Surgeries Today</p>
          </div>
           <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">2</p>
            <p className="text-sm text-muted-foreground">Available ORs</p>
          </div>
           <div className="p-4 bg-secondary/10 rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">8</p>
            <p className="text-sm text-muted-foreground">Pending Procedures</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
