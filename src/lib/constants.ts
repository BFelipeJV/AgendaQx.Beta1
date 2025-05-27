
import type { NavItem, IconName } from '@/lib/types';

export const NAV_ITEMS_MAIN: NavItem[] = [
  {
    title: 'Panel Principal',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Resumen y acciones rápidas.',
  },
  {
    title: 'Registro de Atenciones', // Title was already updated
    href: '/cirugias/registrar',    // Path remains to the new selection page
    iconName: 'ListPlus',         // Changed icon to be more generic for "atenciones"
    description: 'Seleccionar tipo de atención a registrar.',
  },
  {
    title: 'Agenda Quirúrgica',
    href: '/agenda',
    iconName: 'CalendarDays',
    description: 'Ver y gestionar las próximas cirugías.',
  },
  {
    title: 'Registro Diario',
    href: '/agenda/hoy',
    iconName: 'ListChecks',
    description: 'Procedimientos programados para hoy.',
  },
];

export const NAV_ITEMS_AUTH: NavItem[] = [
    {
    title: 'Cerrar Sesión',
    href: '/login', // Idealmente llamaría a una acción de cierre de sesión
    iconName: 'LogOut',
    description: 'Salir de tu cuenta.',
  }
]

export const APP_NAME = "AgendaQx";
export const APP_HEADER_TITLE = "AGENDA QX";
