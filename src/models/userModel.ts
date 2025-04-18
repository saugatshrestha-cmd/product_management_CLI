import mongoose from 'mongoose';
import { PasswordManager } from '../utils/passwordUtils';

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
  }
});


userSchema.pre('save', function (next) {
  const user = this as any;

  if (!user.isModified('password')) return next();

  try {
    const salt = passwordManager.createSalt();
    const hashedPassword = passwordManager.hashPassword(user.password, salt);
    user.password = passwordManager.combineSaltAndHash(salt, hashedPassword);
    next();
  } catch (err) {
    next(err instanceof Error ? err : new Error('Error hashing password'));
  }
});

export const UserModel = mongoose.model('User', userSchema);
