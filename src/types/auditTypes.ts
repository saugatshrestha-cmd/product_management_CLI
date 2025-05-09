import mongoose from "mongoose";

export interface Audit {
  entityType: string;         
  entityId: mongoose.Types.ObjectId | string;
  action: string;             
  performedBy: mongoose.Types.ObjectId | string;
  userRole: string;           
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  previousState: any;       
  newState: any;              
  details: any;               
  affectedFields?: string[];  
}