import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata";
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/mongo_routes';
import { errorMiddleware } from "@middleware/errorMiddleware";
import cookieParser from 'cookie-parser';
import { logger } from '@utils/logger';
import { autoLogger } from '@middleware/autoLogger';


const app = express();
app.use(autoLogger());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(express.json());
app.use(cookieParser());

app.use("", routes);
app.use(errorMiddleware);

mongoose.connect(MONGO_URI)
    .then(() => {
        logger.info('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection failed', {
            error: error.message
        });;
    });
