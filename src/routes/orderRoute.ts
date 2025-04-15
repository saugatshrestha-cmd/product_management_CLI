import { OrderService } from '../services/orderService';
import { Command, ArgsType } from '../types/parseTypes';
import { OrderStatus } from '../types/orderTypes';
import { ArgumentParser } from '../utils/parseArgs';

export class HandleOrderCommand {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  handleCommand(command: Command, args: ArgsType) {
    switch (command) {
      case 'add':
        this.addOrder(args);
        break;
      case 'view':
        this.viewOrder(args);
        break;
      case 'update-status':
        this.updateOrderStatus(args);
        break;
      default:
        console.log(`Unknown order command: ${command}`);
    }
  }

  private addOrder(args: ArgsType) {
    const parsedArgs = new ArgumentParser(args).parse();
    const userId = Number(parsedArgs.userId);

    if (!userId) {
      console.log("User Id is required.");
      return;
    }

    const order = this.orderService.createOrder(userId);
    console.log('message' in order ? order.message : order);
  }

  private viewOrder(args: ArgsType) {
    const parsedArgs = new ArgumentParser(args).parse();
    const userId = Number(parsedArgs.userId);

    if (!userId) {
      console.log("User Id is required.");
      return;
    }

    const order = this.orderService.getOrderByUserId(userId);
    console.log('message' in order ? order.message : (order.length ? order : "No orders found for this user."));
  }

  private updateOrderStatus(args: ArgsType) {
    const parsedArgs = new ArgumentParser(args).parse();
    const orderId = Number(parsedArgs.orderId);
    const status = parsedArgs.status as OrderStatus;

    if (!orderId || !status) {
      console.log("Order ID and status are required.");
      return;
    }

    const result = this.orderService.updateOrderStatus(orderId, status);
    console.log(result);
  }
}
