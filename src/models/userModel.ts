import mongoose from 'mongoose';
import { Role } from '@mytypes/enumTypes';

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
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


export const UserModel = mongoose.model('User', userSchema);
