import { createSalt, hashPassword, combineSaltAndHash } from '../utils/passwordUtils.js';
import { users, addUser, deleteUserById, saveUsers } from '../repository/customerAccountRepo.js';

//Check if email is already registered
function isEmailRegistered(email) {
    return users.some(user => user.email === email);
}

//Find user by id
function findUserById(userId) {
    return users.find(user => user.id === userId);
}

// Create a new user
function createUser(userData) {

    const { firstName, lastName, email, password, phone, address } = userData;

    // Check if user already exists
    if (isEmailRegistered(email)) {
        return {message: "Email already registered"};
    }

    const salt = createSalt(); // Create a random salt
    const hashedPassword = hashPassword(password, salt); // Hash the password with the salt

    // Combine salt and hash into a single string
    const combinedSaltAndHash = combineSaltAndHash(salt, hashedPassword);

    const newUserData = {
        firstName,
        lastName,
        email,
        password: combinedSaltAndHash,
        phone,
        address
    };

    const newUser = addUser(newUserData);
    return {message: "User registered successfully"};
}

// Get user by ID
function getUserById(userId) {
    const user = findUserById(userId);
    return user || {message: "User not found"};
}

// Get all users
function getAllUsers() {
    return users;
}

// Update user information
function updateUser(userId, updatedInfo) {
    const user = findUserById(userId);
    if (!user) {
        return {message: "User not found"};
    }

    Object.assign(user, updatedInfo);
    saveUsers();
    return {message: "User updated successfully"};
}

// Update email
function updateEmail(userId, newEmail) {
    const user = findUserById(userId);
    if (!user) {
        return {message: "User not found"};
    }

    // Check if the new email is already in use
    if (isEmailRegistered(newEmail)) {
        return {message: "Email already in use"};
    }

    user.email = newEmail;
    saveUsers();
    return {message: "Email updated successfully"};
}

// Update password
function updatePassword(userId, newPassword) {
    const user = findUserById(userId);
    if (!user) {
        return {message: "User not found"};
    }

    const newSalt = createSalt(); // Generate a new salt
    const hashedNewPassword = hashPassword(newPassword, newSalt); // Hash the new password with the salt

    user.password = combineSaltAndHash(newSalt, hashedNewPassword); // Update the password with the hashed value
    saveUsers();
    return {message: "Password updated successfully"};
}

// Delete user
function deleteUser(userId) {
    const success = deleteUserById(userId);
    return { message: success ? "User deleted successfully" : "Not found" };
}

export {
    createUser,
    getUserById, 
    getAllUsers, 
    updateUser, 
    updateEmail, 
    updatePassword, 
    deleteUser
};

