
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListPlus, FilePlus2, BedDouble, FileClock, ClipboardEdit, ArrowRight } from 'lucide-react';

interface AttentionOption {
  title: string;
  description: string;
  href: string; // All options will now have an href
  icon: React.ElementType;
  disabled?: boolean; // Kept for potential future use, but not used now
}

export default function RegisterAttentionPage() {
  const attentionOptions: AttentionOption[] = [
    {
      title: 'Cirugía o Procedimiento',
      description: 'Registrar una nueva cirugía o procedimiento.',
      href: '/cirugias/registrar/procedimiento',
      icon: FilePlus2,
    },
    {
      title: 'Ingreso Paciente No Quirúrgico',
      description: 'Registrar el ingreso de un paciente que no requiere cirugía.',
      href: '/cirugias/registrar/no-quirurgico',
      icon: BedDouble,
    },
    {
      title: 'Cirugía o Procedimiento Pendiente',
      description: 'Registrar o actualizar información de un procedimiento pendiente.',
      href: '/cirugias/registrar/pendiente',
      icon: FileClock,
    },
    {
      title: 'Novedades del Turno',
      description: 'Anotar novedades relevantes ocurridas durante el turno.',
      href: '/cirugias/registrar/novedades-turno',
      icon: ClipboardEdit,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
          <ListPlus className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl font-bold">Registro de Atenciones</CardTitle>
            <CardDescription className="text-md">
              Seleccione el tipo de atención que desea registrar.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {attentionOptions.map((option) => (
            <Link href={option.href} key={option.title} passHref>
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex items-center justify-start text-left rounded-lg shadow-sm hover:shadow-md transition-shadow"
                disabled={option.disabled} 
              >
                <option.icon className="h-7 w-7 mr-4 text-primary flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-semibold text-base text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {!option.disabled && <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground" />}
              </Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

    