import {
    createCart,
    removeFromCart,
    calculateTotal,
    getCartByUserId,
} from '../services/cartService.js';
import parseArgs from '../utils/parseArgs.js';
import { Command, ArgsType } from '../types/parseTypes.js';
import { getProductById } from '../services/productService.js';

export function handleCartCommand(command: Command, args: ArgsType) {
    switch (command) {
        case 'add': {
            const parsedArgs = parseArgs(args);
            const productId = Number(args[0]);
            const quantity = Number(parsedArgs.quantity);
            const userId = Number(parsedArgs.userId);
            const product = getProductById(productId);

            if (!userId) {
                console.log("User Id is required.");
                break;
            }
            if (!product || 'message' in product) {
                console.log("Product not found");
                return;
            }

            const result = createCart(product, quantity, userId);
            console.log(result);
            break;
        }
        case 'view': {
            const parsedArgs = parseArgs(args);
            const userId = Number(parsedArgs.userId);
        
            if (!userId) {
                console.log("User Id is required.");
                break;
            }
        
            const cart = getCartByUserId(userId);
            if ('message' in cart) {
                console.log(cart.message);
                break;
            }
        
            if (cart.items.length === 0) {
                console.log("Cart is empty!!");
                break;
            }
        
            console.log(cart);
            break;
        }
        case 'remove': {
            const parsedArgs = parseArgs(args);
            const productId = Number(args[0]);
            const userId = Number(parsedArgs.userId);

            if (!userId) {
                console.log("User Id is required.");
                break;
            }

            const result = removeFromCart(productId, userId);
            console.log(result);
            break;
        }
        case 'total': {
            const parsedArgs = parseArgs(args);
            const userId = Number(parsedArgs.userId);

            if (!userId) {
                console.log("User Id is required.");
                break;
            }

            const total = calculateTotal(userId);
            console.log("Cart total:", total);
            break;
        }
        default:
            console.log(`Unknown cart command: ${command}`);
    }
}
