import { injectable, inject } from "tsyringe";
import jwt from 'jsonwebtoken';
import { UserService } from "@services/userService";
import { SellerService } from "@services/sellerService";
import { PasswordManager } from '@utils/passwordUtils';
import { AppError } from "@utils/errorHandler";
import { User } from '@mytypes/userTypes';
import { Role } from '@mytypes/enumTypes';
import { NotificationService } from "./notificationService";

@injectable()
export class AuthService {
    constructor(
      @inject("NotificationService") private notificationService: NotificationService,
      @inject("UserService") private userService: UserService,
      @inject("SellerService") private sellerService: SellerService,
      @inject("PasswordManager") private passwordManager: PasswordManager
    ) {
    }

    async login(email: string, password: string): Promise<{ token?: string; message: string }> {
        // Check if it's a user
        const user = await this.userService.findByEmail(email);
        if (user && this.passwordManager.verifyPassword(password, user.password)) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
          return { token, message: 'Login successful' };
        }
        // Check if it's a seller
        const seller = await this.sellerService.findByEmail(email);
        if (seller && this.passwordManager.verifyPassword(password, seller.password)) {
          const token = jwt.sign(
            { _id: seller._id, role: seller.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
          return { token, message: 'Login successful as seller' };
        }
        throw AppError.unauthorized("Invalid credentials");
    }

    async register(userData: User) {
    const exists = await this.userService.findByEmail(userData.email);
    if (exists) return { message: 'Email already registered' };
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(userData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
    const finalUser = { ...userData, password: combined, role: Role.CUSTOMER};
    await this.userService.addUser(finalUser);
    const user = await this.userService.getAllUsers()
        .then(users => users.find(u => u.email === userData.email));
    if (!user) return { message: 'User creation failed' };
      await this.notificationService.sendWelcomeEmail(user);
    return { message: 'Registration successful', user };
    }
}
