import {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
} from '../services/userService.js';
import parseArgs from '../utils/parseArgs.js';
import { Command, ArgsType } from '../types/parseTypes.js';
import  { User } from '../types/userTypes.js'

export function handleUserCommand(command: Command, args: ArgsType) {
    // console.log(args);
    switch (command) {
        case 'list': {
            const users = getAllUsers();
            console.log(users);
            break;
        }
        case 'add': {
            const userData = parseArgs(args);
            console.log(userData)
            const result = createUser(userData as unknown as User);
            console.log(result);
            break;
        }
        case 'update': {
            const userId = Number(args[0]);
            const updatedInfo = parseArgs(args.slice(1));
            const result = updateUser(userId, updatedInfo as unknown as User);
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