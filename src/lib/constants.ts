import type { NavItem } from '@/lib/types';
import { LayoutDashboard, Stethoscope, CalendarDays, ListChecks, LogOut, UserPlus } from 'lucide-react';

export const NAV_ITEMS_MAIN: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and quick actions.',
  },
  {
    title: 'Register Surgery',
    href: '/cirugias/registrar',
    icon: UserPlus,
    description: 'Add a new surgical procedure.',
  },
  {
    title: 'Surgical Schedule',
    href: '/agenda',
    icon: CalendarDays,
    description: 'View and manage upcoming surgeries.',
  },
  {
    title: 'Daily Log',
    href: '/agenda/hoy',
    icon: ListChecks,
    description: "Today's scheduled procedures.",
  },
];

export const NAV_ITEMS_AUTH: NavItem[] = [
    {
    title: 'Logout',
    href: '/login', // Should ideally call a logout action
    icon: LogOut,
    description: 'Sign out of your account.',
  }
]

export const APP_NAME = "QX Scheduler";
export const APP_HEADER_TITLE = "AGENDA QX";
