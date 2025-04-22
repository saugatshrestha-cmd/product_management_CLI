import mongoose from 'mongoose';

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
    }
});

export const ProductModel = mongoose.model('Product', productSchema);
