import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        required: true
    },
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
        type: Number, 
        required: true 
    }
});

export const ProductModel = mongoose.model('Product', productSchema);
