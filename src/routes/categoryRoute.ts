import {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
} from '../services/categoryService.js';
import parseArgs from '../utils/parseArgs.js';
import { Category } from '../types/categoryTypes.js';
import { Command, ArgsType } from '../types/parseTypes.js';

export function handleCategoryCommand(command: Command, args: ArgsType) {
    switch (command) {
        case 'list': {
            const categories = getAllCategory();
            console.log(categories);
            break;
        }
        case 'add': {
            const categoryData = parseArgs(args);
            const result = createCategory(categoryData as unknown as Category);
            console.log(result);
            break;
        }
        case 'update': {
            const categoryId = Number(args[0]);
            const updatedInfo = parseArgs(args.slice(1));
            const result = updateCategory(categoryId, updatedInfo as unknown as Category);
            console.log(result);
            break;
        }
        case 'delete': {
            const categoryId = Number(args[0]);
            const result = deleteCategory(categoryId);
            console.log(result);
            break;
        }
        default:
            console.log(`Unknown category command: ${command}`);
    }
}
