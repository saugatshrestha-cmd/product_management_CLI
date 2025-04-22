import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/mongo_routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';


app.use(express.json());

app.use("", routes)

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
