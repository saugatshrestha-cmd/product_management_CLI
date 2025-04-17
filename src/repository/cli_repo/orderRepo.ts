import { FileService } from '../../utils/fileHelper';
import FILE_PATHS from '../../constants/filePaths';
import { Order } from '../../types/orderTypes';

export class OrderRepository {
  private fileService: FileService;
  private orders: Order[];

  constructor() {
    this.fileService = new FileService(FILE_PATHS.ORDERS);
    this.orders = this.fileService.load();
  }

  private getNewId(): number {
    return this.orders.length ? this.orders[this.orders.length - 1].id + 1 : 1;
  }

  public saveOrders(): void {
    this.fileService.save({ data: this.orders });
  }

  getAll(): Order[] {
    return this.orders;
  }

  // Get orders by user ID
  getOrdersByUserId(userId: number): Order[] {
    return this.orders.filter(order => order.userId === userId);
  }

  // Find an order by its ID
  findOrderById(orderId: number): Order | undefined {
    return this.orders.find(order => order.id === orderId);
  }

  addOrder(orderData: Omit<Order, 'id'>): Order {
    const newOrder: Order = {
      id: this.getNewId(),
      ...orderData,
    };

    this.orders.push(newOrder);
    this.saveOrders();
    return newOrder;
  }
}
