import { Category } from '@mytypes/categoryTypes';
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

export const CategoryModel = mongoose.model<Category & mongoose.Document>('Category', categorySchema);
