import express, { Request, Response } from 'express';
import { OrderService } from '../../services/orderService';

const router = express.Router();
const orderService = new OrderService();


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = orderService.getOrderByUserId(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.body.userId);
    const result = orderService.createOrder(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
      const orderId = Number(req.params.id);
      const orderStatus = req.body;
      const result = orderService.updateOrderStatus(orderId, orderStatus);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category' });
    }
  });

export default router;
