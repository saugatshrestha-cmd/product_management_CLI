import express, { Request, Response } from 'express';
import { OrderService } from '../../services/orderService';

const router = express.Router();
const orderService = new OrderService();


router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await orderService.getOrderByUserId(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.body.userId);
    const result = await orderService.createOrder(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
      const orderId = Number(req.params.id);
      const updatedInfo = req.body;
      const result = await orderService.updateOrderStatus(orderId, updatedInfo);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order' });
    }
  });

export default router;
