
import type { NavItem, IconName } from '@/lib/types';

export const NAV_ITEMS_MAIN: NavItem[] = [
  {
    title: 'Panel Principal',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Resumen y acciones rápidas.',
  },
  {
    title: 'Registro de Atenciones',
    href: '/cirugias/registrar',
    iconName: 'ListPlus',
    description: 'Seleccionar tipo de atención a registrar.',
  },
  {
    title: 'Registro Diario',
    href: '/agenda/hoy',
    iconName: 'ListChecks', 
    description: 'Procedimientos programados para hoy.',
  },
  {
    title: 'Calendario de Turnos',
    href: '/turnos',
    iconName: 'CalendarClock',
    description: 'Gestionar y visualizar los turnos de los cirujanos.',
  },
  {
    title: 'Registro Histórico',
    href: '/historial',
    iconName: 'History',
    description: 'Consultar y descargar registros pasados.',
  },
  {
    title: 'Registrar Usuarios',
    href: '/admin/registrar-usuarios',
    iconName: 'UserPlus',
    description: 'Crear nuevas cuentas de usuario para la plataforma.',
  },
];

export const NAV_ITEMS_AUTH: NavItem[] = [
    {
    title: 'Cerrar Sesión',
    href: '/login',
    iconName: 'LogOut',
    description: 'Salir de tu cuenta.',
  }
]

export const APP_NAME = "AgendaQx";
export const APP_HEADER_TITLE = "AGENDA QX";
export const MOCK_USERS_STORAGE_KEY = 'mockRegisteredUsers';
export const MOCK_SURGERIES_STORAGE_KEY = 'mockRegisteredSurgeries';
export const MOCK_NON_SURGICAL_STORAGE_KEY = 'mockRegisteredNonSurgical';
export const MOCK_NOVELTIES_STORAGE_KEY = 'mockRegisteredNovelties';
