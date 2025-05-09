import { FileMetadata } from '@mytypes/fileTypes';
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

export const FileModel = mongoose.model<FileMetadata & mongoose.Document>('File', fileSchema);
