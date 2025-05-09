import mongoose from 'mongoose';
import { ProductStatus } from '@mytypes/enumTypes';
import { Product } from '@mytypes/productTypes';

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
    images: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File', 
        required: true 
    },
    sellerId: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: Object.values(ProductStatus),
        default: ProductStatus.ACTIVE,
        required: true
    },
    deletedAt: {
        type: Date,
        required: false,
    }
},
{ timestamps: true }
);

export const ProductModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);
