import crypto from 'crypto';

export class PasswordManager {
  createSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  combineSaltAndHash(salt: string, hash: string): string {
    return `${salt}:${hash}`;
  }

  verifyPassword(inputPassword: string, storedCombined: string): boolean {
    const [storedSalt, storedHash] = storedCombined.split(':');
    
    console.log('Stored Salt:', storedSalt);
    console.log('Password:', inputPassword);
  
    const inputHash = this.hashPassword(inputPassword, storedSalt); // Use the stored salt during login
    console.log('Generated Hash:', inputHash);
    console.log('Stored Hash:', storedHash);
  
    return storedHash === inputHash; // Compare the generated hash with the stored hash
  } 

}
