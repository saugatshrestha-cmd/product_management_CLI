import { CategoryService } from '../services/categoryService';
import { Command, ArgsType } from '../types/parseTypes';
import { ArgumentParser } from '../utils/parseArgs';
import { Category } from '../types/categoryTypes';

export class HandleCategoryCommand {
  private categoryService = new CategoryService();

  handleCommand(command: Command, args: ArgsType) {
    switch (command) {
      case 'list':
        console.log(this.categoryService.getAllCategories());
        break;

      case 'add': {
        const categoryData = new ArgumentParser(args).parse();
        const result = this.categoryService.createCategory(categoryData as unknown as Category);
        console.log(result.message);
        break;
      }

      case 'update': {
        const categoryId = Number(args[0]);
        if (isNaN(categoryId)) return console.log('Invalid category ID.');
        const updatedInfo = new ArgumentParser(args.slice(1)).parse();
        const result = this.categoryService.updateCategory(categoryId, updatedInfo as unknown as Category);
        console.log(result.message);
        break;
      }

      case 'delete': {
        const categoryId = Number(args[0]);
        if (isNaN(categoryId)) return console.log('Invalid category ID.');
        const result = this.categoryService.deleteCategory(categoryId);
        console.log(result.message);
        break;
      }

      default:
        console.log(`Unknown category command: ${command}`);
    }
  }
}
