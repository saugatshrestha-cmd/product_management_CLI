import { loadData, saveData } from '../utils/fileHelper.js';
import FILE_PATHS from '../constants/filePaths.js';

let users = loadData(FILE_PATHS.USERS).data;

let userIdCounter = users.length ? users[users.length - 1].id + 1 : 1;

function getNewId() {
    return userIdCounter++;
}

// Save users to JSON file
function saveUsers() {
    saveData(FILE_PATHS.USERS, { data: users });
}

function addUser(userData) {
    const newUser = { ...userData, id: getNewId() }; 
}

export { users, addUser, saveUsers}