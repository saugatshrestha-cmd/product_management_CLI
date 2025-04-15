import { UserService } from '../services/userService';
import { User } from '../types/userTypes';
import { Command, ArgsType } from '../types/parseTypes';
import { ArgumentParser } from '../utils/parseArgs';

export class HandleUserCommand {
    private userService = new UserService();

    handleCommand(command: Command, args: ArgsType) {
        switch (command) {
            case 'list':
                console.log(this.userService.getAllUsers());
                break;

            case 'add': {
                const userData = new ArgumentParser(args).parse();
                const result = this.userService.createUser(userData as unknown as User);
                console.log(result);
                break;
            }

            case 'update': {
                const userId = Number(args[0]);
                const updatedInfo = new ArgumentParser(args.slice(1)).parse();
                const result = this.userService.updateUser(userId, updatedInfo as unknown as User);
                console.log(result);
                break;
            }

            case 'delete': {
                const userId = Number(args[0]);
                const result = this.userService.deleteUser(userId);
                console.log(result);
                break;
            }

            default:
                console.log(`Unknown user command: ${command}`);
        }
    }
}
