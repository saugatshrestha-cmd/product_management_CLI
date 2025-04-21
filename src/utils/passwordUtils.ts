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

    const inputHash = this.hashPassword(inputPassword, storedSalt);

    return storedHash === inputHash;
  } 

}
