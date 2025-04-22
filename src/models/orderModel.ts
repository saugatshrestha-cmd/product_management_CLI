import mongoose from 'mongoose';
import { Status } from '../types/enumTypes';

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
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
    cancelledAt: {
        type: Date,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
    items: [{
        productId: {
            type: String,
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
