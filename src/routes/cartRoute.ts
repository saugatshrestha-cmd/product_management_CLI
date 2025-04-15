import { CartService } from '../services/cartService';
import { ProductService } from '../services/productService';
import { Command, ArgsType } from '../types/parseTypes';
import { ArgumentParser } from '../utils/parseArgs';

export class HandleCartCommand {
  private cartService: CartService;
  private productService: ProductService;

  constructor() {
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  handleCommand(command: Command, args: ArgsType) {
    switch (command) {
      case 'add': 
        this.addToCart(args);
        break;

      case 'view':
        this.viewCart(args);
        break;

      case 'remove':
        this.removeFromCart(args);
        break;

      case 'total':
        this.viewCartTotal(args);
        break;

      default:
        console.log(`Unknown cart command: ${command}`);
    }
  }

  private addToCart(args: ArgsType) {
    const { productId, quantity, userId } = this.parseArgs(args);
    if (!userId) return console.log('User Id is required.');

    const product = this.productService.getProductById(productId);
    if ('message' in product) {
      console.log('Product not found');
      return;
  }

    const result = this.cartService.createCart(product, quantity, userId);
    console.log(result);
  }

  private viewCart(args: ArgsType) {
    const { userId } = this.parseArgs(args);
    if (!userId) return console.log('User Id is required.');

    const cart = this.cartService.getCartByUserId(userId);
    if ('message' in cart) return console.log(cart.message);
    if (cart.items.length === 0) return console.log('Cart is empty!');

    console.log(cart);
  }

  private removeFromCart(args: ArgsType) {
    const { productId, userId } = this.parseArgs(args);
    if (!userId) return console.log('User Id is required.');

    const result = this.cartService.removeFromCart(productId, userId);
    console.log(result);
  }

  private viewCartTotal(args: ArgsType) {
    const { userId } = this.parseArgs(args);
    if (!userId) return console.log('User Id is required.');

    const total = this.cartService.calculateTotal(userId);
    console.log('Cart total:', total);
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
