import mongoose from 'mongoose';
import { ProductStatus } from '@mytypes/enumTypes';

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    categoryId: { 
        type: String, 
        required: true 
    },
    sellerId: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: Object.values(ProductStatus),
        default: 'active',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    }
});

export const ProductModel = mongoose.model('Product', productSchema);
