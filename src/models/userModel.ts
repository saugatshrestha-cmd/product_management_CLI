// src/models/userModel.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import { PasswordManager } from '../utils/passwordUtils';  // Import PasswordManager

const passwordManager = new PasswordManager();

// Define the User interface (this includes the TypeScript types for validation)
interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;  // Store hashed passwords
  phone: string; // User phone number
  address: string; // User address
}


const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure the email is unique in the database
    match: [/.+@.+\..+/, 'Please enter a valid email address'],  // Simple regex for email validation
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) return next();  // Skip if the password is not modified
    
    try {
      const salt = passwordManager.createSalt();  // Generate a salt
      const hashedPassword = passwordManager.hashPassword(this.password, salt);  // Hash the password using the salt
      this.password = passwordManager.combineSaltAndHash(salt, hashedPassword);  // Combine the salt and hashed password
      next();
    } catch (error) {
      // TypeScript infers `error` as `unknown`, so we must cast it to an Error
    if (error instanceof Error) {
        next(error);  // Pass the error to the next middleware
      } else {
        next(new Error('An unknown error occurred during password hashing'));  // If it's not an instance of Error, create a new Error object
      }
    }
  });


const UserModel: Model<UserDocument>  = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
