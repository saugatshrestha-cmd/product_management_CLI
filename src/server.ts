import "reflect-metadata";
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/mongo_routes';
import { errorMiddleware } from "@middleware/errorMiddleware";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';


app.use(express.json());
app.use(cookieParser());

app.use("", routes);
app.use(errorMiddleware);

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
