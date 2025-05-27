
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListPlus, FilePlus2, BedDouble, FileClock, ClipboardEdit, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttentionOption {
  title: string;
  description: string;
  href?: string;
  icon: React.ElementType;
  action?: () => void;
  disabled?: boolean;
}

export default function RegisterAttentionPage() {
  const { toast } = useToast();

  const handlePlaceholderClick = (optionTitle: string) => {
    toast({
      title: 'Funcionalidad Pendiente',
      description: `La opción "${optionTitle}" aún no está implementada.`,
    });
  };

  const attentionOptions: AttentionOption[] = [
    {
      title: 'Cirugía o Procedimiento',
      description: 'Registrar una nueva cirugía o procedimiento programado.',
      href: '/cirugias/registrar/procedimiento',
      icon: FilePlus2,
    },
    {
      title: 'Ingreso Paciente No Quirúrgico',
      description: 'Registrar el ingreso de un paciente que no requiere cirugía.',
      icon: BedDouble,
      action: () => handlePlaceholderClick('Ingreso Paciente No Quirúrgico'),
      disabled: true,
    },
    {
      title: 'Cirugía o Procedimiento Pendiente',
      description: 'Registrar o actualizar información de un procedimiento pendiente.',
      icon: FileClock,
      action: () => handlePlaceholderClick('Cirugía o Procedimiento Pendiente'),
      disabled: true,
    },
    {
      title: 'Novedades del Turno',
      description: 'Anotar novedades relevantes ocurridas durante el turno.',
      icon: ClipboardEdit,
      action: () => handlePlaceholderClick('Novedades del Turno'),
      disabled: true,
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
            option.href ? (
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
            ) : (
              <Button
                key={option.title}
                variant="outline"
                className="w-full h-auto py-4 flex items-center justify-start text-left rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onClick={option.action}
                disabled={option.disabled}
              >
                <option.icon className="h-7 w-7 mr-4 text-primary flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-semibold text-base text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {option.disabled && <span className="ml-auto text-xs text-muted-foreground">(Próximamente)</span>}
              </Button>
            )
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
