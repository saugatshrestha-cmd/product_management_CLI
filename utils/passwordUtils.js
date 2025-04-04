import crypto from 'crypto';

// Function to create a salt
function createSalt() {
    return crypto.randomBytes(16).toString('hex');
}

// Function to hash a password with a salt
function hashPassword(password, salt) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return hash;
}

// Function to combine salt and hash into one string
function combineSaltAndHash(salt, hash) {
    return `${salt}:${hash}`; // Combine salt and hash in a single string, separated by ':'
}

export { createSalt, hashPassword, combineSaltAndHash };
