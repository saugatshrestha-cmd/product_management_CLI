import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';
import { User } from '../types/userTypes.js';

let users: User [] = loadData(FILE_PATHS.USERS).data;

function getNewId() {
    return users.length ? users[users.length - 1].id + 1 : 1;
}

// Save users to JSON file
function saveUsers() {
    saveData(FILE_PATHS.USERS, { data: users });
}

function addUser(userData: Omit<User, 'id'>) {
    const newUserId = getNewId();
    const newUser = {  id: newUserId, ...userData }; 
    users.push(newUser);
    saveUsers();

}

function deleteUserById(userId: number) {
    const initialLength = users.length;
    users = users.filter(user => user.id !== userId);

    saveUsers();
    return initialLength !== users.length;
}

export { User, users, addUser, deleteUserById, saveUsers}