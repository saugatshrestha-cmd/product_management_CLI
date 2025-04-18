import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true},
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});

export const CategoryModel = mongoose.model('Category', categorySchema);
