import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} from '../services/productService.js';
import parseArgs from '../utils/parseArgs.js';
import { Command, ArgsType } from '../types/parseTypes.js';
import { Product } from '../types/productTypes.js';


export function handleProductCommand(command: Command, args: ArgsType) {
    switch (command) {
        case 'list': {
            const products = getAllProducts();
            console.log(products);
            break;
        }
        case 'add': {
            const productData = parseArgs(args);
            const result = createProduct(productData as unknown as Product);
            console.log(result);
            break;
        }
        case 'update': {
            const productId = Number(args[0]);
            const updatedInfo = parseArgs(args.slice(1));
            const result = updateProduct(productId, updatedInfo as unknown as Product);
            console.log(result);
            break;
        }
        case 'delete': {
            const productId = Number(args[0]);
            const result = deleteProduct(productId);
            console.log(result);
            break;
        }
        default:
        console.log(`Unknown product command: ${command}`);
    }
}
