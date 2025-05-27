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
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}
