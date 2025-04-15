import { ProductService } from '../services/productService';
import { Command, ArgsType } from '../types/parseTypes';
import { ArgumentParser } from '../utils/parseArgs';
import { Product } from '../types/productTypes';

export class HandleProductCommand {
  private productService = new ProductService();

  handleCommand(command: Command, args: ArgsType) {
    switch (command) {
      case 'list':
        console.log(this.productService.getAllProducts());
        break;

      case 'add': {
        const productData = new ArgumentParser(args).parse();
        const result = this.productService.createProduct(productData as unknown as Product);
        console.log(result);
        break;
      }

      case 'update': {
        const productId = Number(args[0]);
        if (isNaN(productId)) return console.log('Invalid product ID.');

        const productData = new ArgumentParser(args.slice(1)).parse();
        const result = this.productService.createProduct(productData as unknown as Product);
        console.log(result);
        break;
      }

      case 'delete': {
        const productId = Number(args[0]);
        if (isNaN(productId)) return console.log('Invalid product ID.');
        const result = this.productService.deleteProduct(productId);
        console.log(result);
        break;
      }

      default:
        console.log(`Unknown product command: ${command}`);
    }
  }
}
