import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});


const cartSchema = new mongoose.Schema({
    id: {
        type: Number,  
        required: true,
    },
    userId: {
        type: Number,
        required: true
    },
    items: [cartItemSchema]  
});


export const CartModel = mongoose.model('Cart', cartSchema);

