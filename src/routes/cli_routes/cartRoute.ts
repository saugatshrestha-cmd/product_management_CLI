import { CartService } from '../../services/cartService';
import { ProductService } from '../../services/productService';
import { Command, ArgsType } from '../../types/parseTypes';
import { ArgumentParser } from '../../utils/parseArgs';

export class HandleCartCommand {
  private cartService: CartService;
  private productService: ProductService;

  constructor() {
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  async handleCommand(command: Command, args: ArgsType) {
    switch (command) {
      case 'add': {
        const { productId, quantity, userId } = this.parseArgs(args);
        try {
          const product = await this.productService.getProductById(productId); 
          if ('message' in product) {
            console.error(product.message); // Log error if product is not found
            return; // Exit early
          }
          const result = await this.cartService.createCart(product, quantity, userId); // await for cart creation
          console.log(result.message);
        } catch (error) {
          console.error('Error adding to cart:', error instanceof Error ? error.message : 'Unknown error');
        }
        break;
      }

      case 'view': {
        const { userId } = this.parseArgs(args);

        // Handle asynchronous call to view cart
        try {
          const cart = await this.cartService.getCartByUserId(userId); // await for cart fetch
          console.log(cart);
        } catch (error) {
          console.error('Error viewing to cart:', error instanceof Error ? error.message : 'Unknown error');
        }
        break;
      }

      case 'remove': {
        const { productId, userId } = this.parseArgs(args);

        // Handle asynchronous call to remove from cart
        try {
          const result = await this.cartService.removeFromCart(productId, userId); // await for remove action
          console.log(result.message);
        } catch (error) {
          console.error('Error removing from cart:', error instanceof Error ? error.message : 'Unknown error');
        }
        break;
      }

      case 'total': {
        const { userId } = this.parseArgs(args);

        // Handle asynchronous call to calculate total
        try {
          const total = await this.cartService.calculateTotal(userId); // await for total calculation
          if ('message' in total) {
            console.log(total.message);
          } else {
            console.log('Cart total:', total.total);
          }
        } catch (error) {
          console.error('Error calculating total:', error instanceof Error ? error.message : 'Unknown error');
        }
        break;
      }

      default:
        console.log(`Unknown cart command: ${command}`);
    }
  }

  private parseArgs(args: ArgsType) {
    const parsedArgs = new ArgumentParser(args).parse();
    return {
      productId: Number(args[0]),
      quantity: Number(parsedArgs.quantity),
      userId: Number(parsedArgs.userId),
    };
  }
}
