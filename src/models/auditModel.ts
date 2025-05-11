import mongoose, { Schema} from 'mongoose';
import { Audit } from '@mytypes/auditTypes';

const auditSchema = new mongoose.Schema({
    action: { type: String, required: true },
    entity: { type: String, required: true }, 
    entityId: { type: String, required: true },
    userId: { type: String },
    userRole: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    request: {
        method: {
            type: String,
            required: true,
            enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
        },
        endpoint: {
            type: String,
            required: true
        },
        params: {
            type: Schema.Types.Mixed,
            required: false
        }
    },
    message: { type: String },
    beforeState: { type: Schema.Types.Mixed },
    afterState: { type: Schema.Types.Mixed },
    status: { type: String, enum: ['success', 'failed'], required: true }
},
{ timestamps: true }
);




export const AuditModel = mongoose.model<Audit & mongoose.Document>('Audit', auditSchema);

