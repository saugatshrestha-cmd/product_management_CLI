import { Router } from "express";
import productRoutes from './productRoutes';
import userRoutes from './userRoutes';      
import orderRoutes from './orderRoutes';     
import cartRoutes from './cartRoutes';
import categoryRoutes from './categoryRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import sellerRoutes from './sellerRoutes';
import auditRoutes from './auditRoutes';

const routes = Router();

routes.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

routes.use('/products', productRoutes);
routes.use('/users', userRoutes);
routes.use('/orders', orderRoutes);
routes.use('/carts', cartRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/auth', authRoutes);
routes.use('/admin', adminRoutes);
routes.use('/sellers', sellerRoutes);
routes.use('/audit', auditRoutes);

export default routes;