import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repository/mongo_repo/userRepo';
import { PasswordManager } from '../utils/passwordUtils';
import { User } from '../types/userTypes';

export class AuthService {
    private userRepository: UserRepository;
    private passwordManager: PasswordManager;

    constructor() {
    this.userRepository = new UserRepository();
    this.passwordManager = new PasswordManager();
    }

    async login(email: string, password: string) {
        const users = await this.userRepository.getAll();
        const user = users.find(u => u.email === email);
        if (!user) {
        console.log('User not found');
        return { message: 'Invalid credentials' };
    }
    
        const passwordMatch = this.passwordManager.verifyPassword(password, user.password);
        console.log('Password comparison result:', passwordMatch);
    
        if (!passwordMatch) {
        return { message: 'Invalid credentials' };
    }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    
    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret as string, 
        { expiresIn } as SignOptions  
    );

    return { message: 'Login successful', token, user };
    }

    async register(userData: Omit<User, 'id'>) {
    const exists = await this.userRepository.getAll()
        .then(users => users.some(u => u.email === userData.email));
    if (exists) return { message: 'Email already registered' };

    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(userData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);

    console.log('Registration Salt:', salt);
    console.log('Registration Hash:', hashed);
    console.log('Stored Combined Hash:', combined);

    const finalUser = { ...userData, password: combined };
    await this.userRepository.addUser(finalUser);

    const user = await this.userRepository.getAll()
        .then(users => users.find(u => u.email === userData.email));
    if (!user) return { message: 'User creation failed' };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const token = jwt.sign(
        { id: user.id, email: user.email },
        secret as string,  
        { expiresIn } as SignOptions 
    );

    return { message: 'Registration successful', token, user };
    }
}
