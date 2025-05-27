import type { NavItem, IconName } from '@/lib/types';
// Removed direct icon component imports as we now use names

export const NAV_ITEMS_MAIN: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Overview and quick actions.',
  },
  {
    title: 'Register Surgery',
    href: '/cirugias/registrar',
    iconName: 'UserPlus',
    description: 'Add a new surgical procedure.',
  },
  {
    title: 'Surgical Schedule',
    href: '/agenda',
    iconName: 'CalendarDays',
    description: 'View and manage upcoming surgeries.',
  },
  {
    title: 'Daily Log',
    href: '/agenda/hoy',
    iconName: 'ListChecks',
    description: "Today's scheduled procedures.",
  },
];

export const NAV_ITEMS_AUTH: NavItem[] = [
    {
    title: 'Logout',
    href: '/login', // Should ideally call a logout action
    iconName: 'LogOut',
    description: 'Sign out of your account.',
  }
]

export const APP_NAME = "QX Scheduler";
export const APP_HEADER_TITLE = "AGENDA QX";
