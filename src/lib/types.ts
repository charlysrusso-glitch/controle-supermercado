// Tipos para o Sistema de Controle Operacional

export type UserRole = 'admin' | 'manager' | 'employee';

export type TaskStatus = 'pending' | 'completed' | 'approved' | 'rejected';

export type ChecklistItemResponse = 'yes' | 'no' | 'na';

export type NCPriority = 'low' | 'medium' | 'high' | 'critical';

export type NCStatus = 'open' | 'in_progress' | 'closed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sector: string;
  shift: string;
  avatar?: string;
}

export interface Sector {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  isCritical: boolean;
  requiresPhoto: boolean;
  sector: string;
  order: number;
}

export interface ChecklistResponse {
  id: string;
  itemId: string;
  response: ChecklistItemResponse;
  photo?: string;
  observation?: string;
  timestamp: Date;
  userId: string;
}

export interface Checklist {
  id: string;
  date: string;
  sector: string;
  userId: string;
  status: TaskStatus;
  responses: ChecklistResponse[];
  managerApproval?: {
    managerId: string;
    status: 'approved' | 'rejected';
    timestamp: Date;
    comments?: string;
  };
  digitalSignature?: string;
  completedAt?: Date;
}

export interface NonConformity {
  id: string;
  checklistId: string;
  itemId: string;
  responsibleId: string;
  managerId: string;
  title: string;
  description: string;
  priority: NCPriority;
  status: NCStatus;
  dueDate: Date;
  createdAt: Date;
  evidencePhotos: string[];
  correctionPhoto?: string;
  correctionDescription?: string;
  closedAt?: Date;
}

export interface DashboardStats {
  totalChecklists: number;
  completedToday: number;
  pendingApproval: number;
  openNCs: number;
  conformityRate: number;
  sectorStats: {
    sector: string;
    conformityRate: number;
    totalTasks: number;
    completedTasks: number;
  }[];
}