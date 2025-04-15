import { FileService } from '../utils/fileHelper';
import FILE_PATHS from '../constants/filePaths';
import { Cart, CartItem } from '../types/cartTypes';

export class CartRepository {
  private fileService: FileService;
  private carts: Cart[];

  constructor() {
    this.fileService = new FileService(FILE_PATHS.CART);
    this.carts = this.fileService.load();
  }

  private getNewId(): number {
    return this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1;
  }

  public saveCarts(): void {
    this.fileService.save({ data: this.carts });
  }

  getAll(): Cart[] {
    return this.carts;
  }

  findCartByUserId(userId: number): Cart | undefined {
    return this.carts.find(cart => cart.userId === userId);
  }
  
  removeCartByUserId(userId: number): boolean {
    const cartIndex = this.carts.findIndex(cart => cart.userId === userId);
    if (cartIndex !== -1) {
        this.carts.splice(cartIndex, 1);  // Remove the cart
        this.saveCarts();  // Save the updated cart data
        return true; // Return true if cart was removed
      }
    return false;
  }

  addCart(cartData: Omit<Cart, 'id'>): Cart {
    const newCart: Cart = {
      id: this.getNewId(),
      ...cartData,
    };

    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  updateCart(userId: number, updatedItems: CartItem[]): Cart | { message: string } {
    const userCart = this.carts.find(cart => cart.userId === userId);

    if (!userCart) {
      return { message: `Cart not found for userId: ${userId}` };
    }

    userCart.items = updatedItems;
    this.saveCarts();
    return userCart;
  }
}
