import { UserRepository } from '../repository/cli_repo/userRepo';
import { User } from '../types/userTypes';
import { PasswordManager } from '../utils/passwordUtils';

export class UserService {
  private userRepository: UserRepository;
  private passwordManager: PasswordManager;

  constructor() {
    this.userRepository = new UserRepository();
    this.passwordManager = new PasswordManager();
  }

  // Check if email is already registered
  private isEmailRegistered(email: string): boolean {
    return this.userRepository.getAll().some(user => user.email === email);
  }

  // Find user by ID
  private findUserById(userId: number): User | undefined {
    return this.userRepository.getAll().find(user => user.id === userId);
  }

  // Create a new user
  createUser(userData: Omit<User, 'id'>): { message: string } {
    const { firstName, lastName, email, password, phone, address } = userData;

    // Check if email already exists
    if (this.isEmailRegistered(email)) {
      return { message: "Email already registered" };
    }

    const salt = this.passwordManager.createSalt();
    const hashedPassword = this.passwordManager.hashPassword(password, salt);
    const combinedSaltAndHash = this.passwordManager.combineSaltAndHash(salt, hashedPassword);

    const newUserData = {
      firstName,
      lastName,
      email,
      password: combinedSaltAndHash,
      phone,
      address
    };

    this.userRepository.addUser(newUserData);
    return { message: "User registered successfully" };
  }

  // Get user by ID
  getUserById(userId: number) {
    const user = this.findUserById(userId);
    return user || { message: "User not found" };
  }

  // Get all users
  getAllUsers(): User[] {
    return this.userRepository.getAll();
  }

  // Update user information
  updateUser(userId: number, updatedInfo: User): { message: string } {
    const { email } = updatedInfo;
    const user = this.findUserById(userId);

    if (!user) {
      return { message: "User not found" };
    }

    // Check if the email is already in use
    if (this.isEmailRegistered(email)) {
      return { message: "Email already in use" };
    }

    Object.assign(user, updatedInfo);
    this.userRepository.saveUsers();
    return { message: "User updated successfully" };
  }

  // Update email
  updateEmail(userId: number, newEmail: string): { message: string } {
    const user = this.findUserById(userId);

    if (!user) {
      return { message: "User not found" };
    }

    // Check if the new email is already in use
    if (this.isEmailRegistered(newEmail)) {
      return { message: "Email already in use" };
    }

    user.email = newEmail;
    this.userRepository.saveUsers();
    return { message: "Email updated successfully" };
  }

  // Update password
  updatePassword(userId: number, newPassword: string): { message: string } {
    const user = this.findUserById(userId);

    if (!user) {
      return { message: "User not found" };
    }

    const newSalt = this.passwordManager.createSalt();
    const hashedNewPassword = this.passwordManager.hashPassword(newPassword, newSalt);
    user.password = this.passwordManager.combineSaltAndHash(newSalt, hashedNewPassword);
    this.userRepository.saveUsers();
    return { message: "Password updated successfully" };
  }

  // Delete user
  deleteUser(userId: number): { message: string } {
    const success = this.userRepository.deleteUserById(userId);
    return { message: success ? "User deleted successfully" : "Not found" };
  }
}
