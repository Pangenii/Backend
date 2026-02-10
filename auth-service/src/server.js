import 'dotenv/config';
import express from "express";
import cors from "cors";
import { connectToDB } from '../config/connectDB.js';
import helmet from "helmet";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const app = express();
connectToDB(process.env.MONGO_URI);
const redisClient = new Redis(process.env.REDIS_URL);
//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    logger.info(`${req.method} REQUEST TO ${req.url}`);
    next();
})

//DDOS PROTECTION
