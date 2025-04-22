import mongoose from 'mongoose';
import { Role } from '../types/enumTypes';

const sellerSchema = new mongoose.Schema({
  storeName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: Number, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: 'user',
    required: true
  }
});


export const SellerModel = mongoose.model('Seller', sellerSchema);
