import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/mongo_routes/productRoutes';
import userRoutes from './routes/mongo_routes/userRoutes';      
import orderRoutes from './routes/mongo_routes/orderRoutes';     
import cartRoutes from './routes/mongo_routes/cartRoutes';
import categoryRoutes from './routes/mongo_routes/categoryRoutes';
import authRoutes from './routes/mongo_routes/authRoutes'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';


app.use(express.json());


app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/carts', cartRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
        console.log(`API server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(' MongoDB connection failed:', error);
    });
