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
  iconName?: IconName; 
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

export interface StoredUser {
  nombreCompleto: string;
  email: string;
  password?: string; // Password is not always needed for logic outside auth/registration
  rol: 'cirujano' | 'administrador';
}

export interface ShiftAssignment {
  id: string;
  date: Date;
  shiftLabel: string;
  surgeons: string[]; 
  bgColorClass: string; 
  borderColorClass: string; 
}
