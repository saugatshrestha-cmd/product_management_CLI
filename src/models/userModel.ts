import mongoose, { Schema } from 'mongoose';
import { Role } from '@mytypes/enumTypes';
import { User } from '@mytypes/userTypes';

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
    required: true,
    lowercase: true
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
    default: Role.CUSTOMER,
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
},
{ timestamps: true }
);


export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
