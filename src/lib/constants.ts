
import type { NavItem, IconName } from '@/lib/types';

export const NAV_ITEMS_MAIN: NavItem[] = [
  {
    title: 'Panel Principal',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Resumen y acciones rápidas agrupadas.',
  },
  {
    title: 'Registrar Cirugía/Procedimiento',
    href: '/cirugias/registrar/procedimiento',
    iconName: 'FilePlus2',
    description: 'Registrar una nueva intervención quirúrgica o procedimiento.',
  },
  {
    title: 'Registrar Ingreso No Quirúrgico',
    href: '/cirugias/registrar/no-quirurgico',
    iconName: 'BedDouble',
    description: 'Registrar el ingreso de un paciente que no requiere cirugía.',
  },
  {
    title: 'Registrar Procedimiento Pendiente',
    href: '/cirugias/registrar/pendiente',
    iconName: 'FileClock',
    description: 'Registrar o actualizar información de un procedimiento pendiente.',
  },
  {
    title: 'Registrar Novedades del Turno',
    href: '/cirugias/registrar/novedades-turno',
    iconName: 'ClipboardEdit',
    description: 'Anotar novedades relevantes ocurridas durante el turno.',
  },
  {
    title: 'Hoja Diaria',
    href: '/agenda/hoy',
    iconName: 'ListChecks', 
    description: 'Resumen de actividades y estado de pacientes para hoy.',
  },
  {
    title: 'Registro Histórico',
    href: '/historial',
    iconName: 'History',
    description: 'Consultar y descargar el historial de atenciones pasadas.',
  },
  {
    title: 'Calendario de Turnos',
    href: '/turnos',
    iconName: 'CalendarClock',
    description: 'Gestionar y visualizar los turnos de los cirujanos.',
  },
  {
    title: 'Solicitar Permiso',
    href: '/turnos/solicitar-permiso',
    iconName: 'FilePenLine',
    description: 'Gestionar solicitudes de permisos o cambios de turno.',
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
export const SHIFT_ASSIGNMENTS_STORAGE_KEY = 'mockShiftAssignments';
