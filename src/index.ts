import { HandleProductCommand } from './routes/productRoute';
import { HandleUserCommand } from './routes/userRoute';
import { HandleCategoryCommand } from './routes/categoryRoute';
import { HandleCartCommand } from './routes/cartRoute';
import { HandleOrderCommand } from './routes/orderRoute';

class CommandHandler {
  private productCommandHandler: HandleProductCommand;
  private userCommandHandler: HandleUserCommand;
  private categoryCommandHandler: HandleCategoryCommand;
  private cartCommandHandler: HandleCartCommand;
  private orderCommandHandler: HandleOrderCommand;

  constructor() {
    this.productCommandHandler = new HandleProductCommand();
    this.userCommandHandler = new HandleUserCommand();
    this.categoryCommandHandler = new HandleCategoryCommand();
    this.cartCommandHandler = new HandleCartCommand();
    this.orderCommandHandler = new HandleOrderCommand();
  }

  public handleCommand(resource: string, command: string, args: string[]): void {
    switch (resource) {
      case 'product':
        this.productCommandHandler.handleCommand(command, args);
        break;
      case 'user':
        this.userCommandHandler.handleCommand(command, args);
        break;
      case 'category':
        this.categoryCommandHandler.handleCommand(command, args);
        break;
      case 'cart':
        this.cartCommandHandler.handleCommand(command, args);
        break;
      case 'order':
        this.orderCommandHandler.handleCommand(command, args);
        break;
      default:
        console.log(`Unknown resource: ${resource}`);
    }
  }
}

// Main execution logic
const [, , resource, command, ...args] = process.argv;

// Create an instance of CommandHandler and call the handleCommand method
const commandHandler = new CommandHandler();
commandHandler.handleCommand(resource, command, args);

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

// node index.js cart add 1 --quantity 100 --userId 1
// node index.js cart view --userId 1
// node index.js cart remove 2 --userId 1
// node index.js cart total --userId 1

// node index.js order add --userId 1
// node index.js order view --userId 1
// node index.js order update-status --orderId 1 --status Shipped