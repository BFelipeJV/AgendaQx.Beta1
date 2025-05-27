import type { NavItem, IconName } from '@/lib/types';

export const NAV_ITEMS_MAIN: NavItem[] = [
  {
    title: 'Panel Principal',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Resumen y acciones rápidas.',
  },
  {
    title: 'Registrar Cirugía',
    href: '/cirugias/registrar',
    iconName: 'UserPlus',
    description: 'Añadir un nuevo procedimiento quirúrgico.',
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

export const APP_NAME = "QX Scheduler"; // QX Agendador
export const APP_HEADER_TITLE = "AGENDA QX";
