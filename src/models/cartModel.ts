import mongoose from 'mongoose';
import { Cart } from '@mytypes/cartTypes';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    }
});


const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [cartItemSchema]  
});


export const CartModel = mongoose.model<Cart & mongoose.Document>('Cart', cartSchema);

