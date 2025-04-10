import { handleProductCommand } from './routes/productRoute.js';
import { handleUserCommand } from './routes/userRoute.js';
import { handleCategoryCommand } from './routes/categoryRoute.js';
import { handleCartCommand } from './routes/cartRoute.js';
import { handleOrderCommand } from './routes/orderRoute.js';

const [, , resource, command, ...args] = process.argv;

switch (resource) {
  case 'product':
    handleProductCommand(command, args);
    break;
  case 'user':
    handleUserCommand(command, args);
    break;
  case 'category':
    handleCategoryCommand(command, args);
    break;
  case 'cart':
    handleCartCommand(command, args);
    break;
  case 'order':
    handleOrderCommand(command, args);
    break;
  default:
    console.log(`Unknown resource: ${resource}`);
}

// node index.js user list
// node index.js user add --firstName "John" --lastName "Doe" --email "john@example.com" --password "pass123" --phone "1234567890" --address "123 Main St"
// node index.js user update 1 --email "john.doe@example.com"
// node index.js user delete 1

// node index.js product list
// node index.js product add --name "Laptop" --price 999.99 --quantity 10 --categoryId 1
// node index.js product update 1 --name "Gaming Laptop" --price 1299.99
// node index.js product delete 1

// node index.js category list
// node index.js category add --name "Electronics"
// node index.js category update 1 --name "Gadgets"
// node index.js category delete 1

// node index.js cart add 2 --quantity 100 --userId 1
// node index.js cart view --userId 1
// node index.js cart remove 2 --userId 1
// node index.js cart total --userId 1

// node index.js order add --userId 1
// node index.js order view --userId 1
// node index.js order update-status --orderId 1 --status Shipped