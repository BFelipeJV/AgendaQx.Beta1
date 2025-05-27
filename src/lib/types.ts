import type * as LucideIcons from 'lucide-react';

// This type will ensure that only valid Lucide icon names are used.
export type IconName = keyof typeof LucideIcons;

export interface Surgery {
  id: string;
  patientName: string;
  patientId: string;
  procedureType: string;
  surgeon: string;
  date: string; // Consider using Date type or a robust date string format like ISO 8601
  time: string; // Consider using a more structured time format
  operatingRoom: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface NavItem {
  title: string;
  href: string;
  iconName?: IconName; // Changed from 'icon' to 'iconName' and type to IconName (string key of LucideIcons)
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}
