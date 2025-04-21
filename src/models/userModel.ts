import mongoose from 'mongoose';
import { PasswordManager } from '../utils/passwordUtils';
import { Role } from '../types/enumTypes';

const passwordManager = new PasswordManager();

const userSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true
  },
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
  }
});


export const UserModel = mongoose.model('User', userSchema);
