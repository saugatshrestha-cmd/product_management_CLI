import { createOrder, getOrderByUserId, updateOrderStatus } from '../services/orderService.js';
import parseArgs from '../utils/parseArgs.js';
import { Command, ArgsType } from '../types/parseTypes.js';
import { OrderStatus } from '../types/orderTypes.js';

export function handleOrderCommand(command: Command, args: ArgsType) {
    switch (command) {
        case 'add': {
            const parsedArgs = parseArgs(args);
            const userId = Number(parsedArgs.userId);

            if (!userId) {
                console.log("User Id is required.");
                break;
            }

            const order = createOrder(userId);
            if ('message' in order) {
                console.log(order.message);
                break;
            }

            console.log(order);
            break;
        }

        case 'view': {
            const parsedArgs = parseArgs(args);
            const userId = Number(parsedArgs.userId);

            if (!userId) {
                console.log("User Id is required.");
                break;
            }

            const order = getOrderByUserId(userId);
            if ('message' in order) {
                console.log(order.message);
                break;
            }

            if (order.length === 0) {
                console.log("No orders found for this user.");
                break;
            }

            console.log(order);
            break;
        }
        case 'update-status': {
            const parsedArgs = parseArgs(args);
            const orderId = Number(parsedArgs.orderId);
            const status = parsedArgs.status as OrderStatus;
        
            if (!orderId || !status) {
                console.log("Order ID and status are required.");
                break;
            }
        
            const result = updateOrderStatus(orderId, status);
            console.log(result);
            break;
        }
        

        default:
            console.log(`Unknown order command: ${command}`);
    }
}
