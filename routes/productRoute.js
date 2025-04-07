import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} from '../services/productService.js';
import parseArgs from '../utils/parseArgs.js';

export function handleProductCommand(command, args) {
    switch (command) {
        case 'list': {
            const products = getAllProducts();
            console.log(products);
            break;
        }
        case 'add': {
            const productData = parseArgs(args);
            const result = createProduct(productData);
            console.log(result);
            break;
        }
        case 'update': {
            const productId = Number(args[0]);
            const updatedInfo = parseArgs(args.slice(1));
            const result = updateProduct(productId, updatedInfo);
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
