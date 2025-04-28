import { Router } from "express";
import productRoutes from './productRoutes';
import userRoutes from './userRoutes';      
import orderRoutes from './orderRoutes';     
import cartRoutes from './cartRoutes';
import categoryRoutes from './categoryRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import sellerRoutes from './sellerRoutes';


const routes = Router();

routes.use('/products', productRoutes);
routes.use('/users', userRoutes);
routes.use('/orders', orderRoutes);
routes.use('/carts', cartRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/auth', authRoutes);
routes.use('/admin', adminRoutes);
routes.use('/sellers', sellerRoutes);
//health endpoint server is up server is down

export default routes;