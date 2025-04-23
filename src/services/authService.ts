import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/mongo_repo/userRepo';
import { SellerRepository } from '../repository/mongo_repo/sellerRepo';
import { PasswordManager } from '../utils/passwordUtils';
import { User } from '../types/userTypes';
import { Role } from '../types/enumTypes';

export class AuthService {
    private userRepository: UserRepository;
    private sellerRepository: SellerRepository;
    private passwordManager: PasswordManager;

    constructor() {
    this.userRepository = new UserRepository();
    this.sellerRepository = new SellerRepository();
    this.passwordManager = new PasswordManager();
    }

    async login(email: string, password: string): Promise<{ token?: string; message: string }> {
        // Check if it's a user
        const user = await this.userRepository.findByEmail(email);
        const expiresIn = process.env.JWT_EXPIRES_IN;
        if (user && this.passwordManager.verifyPassword(password, user.password)) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
          return { token, message: 'Login successful' };
        }
    
        // Check if it's a seller
        const seller = await this.sellerRepository.findByEmail(email);
        if (seller && this.passwordManager.verifyPassword(password, seller.password)) {
          const token = jwt.sign(
            { _id: seller._id, role: seller.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );
          return { token, message: 'Login successful as seller' };
        }
    
        return { message: 'Invalid credentials' };
    }

    async register(userData: User) {
    const exists = await this.userRepository.findByEmail(userData.email);
    if (exists) return { message: 'Email already registered' };

    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(userData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);

    const finalUser = { ...userData, password: combined, role: Role.USER};
    await this.userRepository.addUser(finalUser);

    const user = await this.userRepository.getAll()
        .then(users => users.find(u => u.email === userData.email));
    if (!user) return { message: 'User creation failed' };

    return { message: 'Registration successful', user };
    }
}
