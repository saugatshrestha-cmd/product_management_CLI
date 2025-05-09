import { Audit } from '@mytypes/auditTypes';
import mongoose, { Schema } from 'mongoose';

const auditSchema = new mongoose.Schema({
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    action: { type: String, required: true, index: true },
    performedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    userRole: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    previousState: { type: Schema.Types.Mixed },
    newState: { type: Schema.Types.Mixed },
    details: { type: Schema.Types.Mixed },
    affectedFields: [{ type: String }]
},
{ timestamps: true }
);

export const AuditModel = mongoose.model<Audit & mongoose.Document>('Audit', auditSchema);
