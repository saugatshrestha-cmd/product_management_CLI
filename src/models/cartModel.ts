import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
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


export const CartModel = mongoose.model('Cart', cartSchema);

