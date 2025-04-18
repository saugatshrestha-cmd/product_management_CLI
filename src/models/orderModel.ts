import mongoose from 'mongoose';
import { Status } from '../types/enumTypes';

const orderSchema = new mongoose.Schema({
    id: {
        type: Number,  
        required: true,
    },
    userId: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: Object.values(Status),
        required: true
    },
    items: [{
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
    }]
});

export const OrderModel = mongoose.model('Order', orderSchema);
