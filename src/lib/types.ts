
import type * as LucideIcons from 'lucide-react';

// This type will ensure that only valid Lucide icon names are used.
export type IconName = keyof typeof LucideIcons;

export type SurgeonRole = 'primer' | 'segundo' | 'becado' | 'interno' | 'volante';

export interface AssignedPersonnel {
  surgeonId: string; // Typically the email or a unique ID
  surgeonName: string;
  role: SurgeonRole;
}

export interface Surgery {
  id: string;
  // From form
  tipoIntervencion: 'cirugia' | 'procedimiento';
  patientName: string; // nombrePaciente
  patientId?: string; // rut
  edad?: number;
  ubicacionCama?: string;

  procedureType?: string; // cirugiaProcedimientoRealizado
  diagnosticoPreOperatorio?: string;
  diagnosticoPostOperatorio?: string;
  diagnosticoGeneral?: string; // 'diagnostico' from form in surgery-registration-form
  tratamientoIndicado?: string; // 'tratamiento' from form in surgery-registration-form
  comentariosAdicionales?: string; // from form in surgery-registration-form

  // For display/logic in DailyLog
  surgeon?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  operatingRoom?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  entryTimestamp: string; // ISO string, set on creation/update of status or details
}


export interface NavItem {
  title: string;
  href?: string;
  iconName?: IconName;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
  subItems?: NavItem[];
  adminOnly?: boolean; // Added for role-based visibility
}

export interface StoredUser {
  nombreCompleto: string;
  email: string;
  password?: string; // For mock purposes, not for production
  rol: 'cirujano' | 'administrador';
}

export interface ShiftAssignment {
  id: string; // Unique ID for this specific assignment on a date, can be `date.toISOString()`
  date: Date;
  shiftLabel: string; // e.g., "Turno Lunes", "Volante 1"
  assignedPersonnel: AssignedPersonnel[];
  bgColorClass: string;
  borderColorClass: string;
}

// For DailyLog Non-Surgical Patients
export interface NonSurgicalPatient {
  id: string;
  name: string;
  diagnosis: string;
  attending: string;
  entryTimestamp: string; // ISO string
  // Add other fields from NonSurgicalRegistrationForm if needed for display/editing
  patientId?: string; // Changed from rut for consistency
  edad?: number;
  ubicacionCama?: string;
  tratamiento?: string;
  comentarios?: string;
}

// For DailyLog Shift Novelties
export interface ShiftNovelty {
  id: string;
  time: string; // HH:MM
  text: string;
  reportedBy: string;
  entryTimestamp: string; // ISO string
  // date could be implicitly today for DailyLog, or stored if novelties can be for other days
}
