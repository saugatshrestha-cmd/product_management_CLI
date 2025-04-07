import {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
} from '../services/userService.js';
import parseArgs from '../utils/parseArgs.js';

export function handleUserCommand(command, args) {
    switch (command) {
        case 'list': {
            const users = getAllUsers();
            console.log(users);
            break;
        }
        case 'add': {
            const userData = parseArgs(args);
            const result = createUser(userData);
            console.log(result);
            break;
        }
        case 'update': {
            const userId = Number(args[0]);
            const updatedInfo = parseArgs(args.slice(1));
            const result = updateUser(userId, updatedInfo);
            console.log(result);
            break;
        }
        case 'delete': {
            const userId = Number(args[0]);
            const result = deleteUser(userId);
            console.log(result);
            break;
        }
        default:
            console.log(`Unknown user command: ${command}`);
    }
}