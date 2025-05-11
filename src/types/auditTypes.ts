export interface Audit {
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  request?: {
    method: string;
    endpoint: string;
    params?: Record<string, unknown>;
  };
  message?:string,
  beforeState?: any;
  afterState?: any;
  status: 'success' | 'failed';
  timestamp: Date;
}

export interface AuditFilter {
  action?: string;
  entity?: string;
  entityId?: string;
  userId?: string;
  userRole?: string;
  status?: 'success' | 'failed';
  startDate?: Date;
  endDate?: Date;
}