import 'dotenv/config';
import express from "express";
import cors from "cors";
import { connectToDB } from '../config/connectDB.js';
import helmet from "helmet";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import { authrouter } from './routes/auth-service.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT;

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
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: 10, // 10 requests
    duration: 1, // per 1 second by IP
})

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            logger.warn("REQUEST LIMIT EXCEEDED")
            res.status(429).json({
                success: false,
                message: "REQUEST LIMIT EXCEEDED"
            });
        });
};

app.use(rateLimiterMiddleware);

//Endpoints based rate limiting
const limiterEndpoints = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`REQUEST LIMIT EXCEEDED FOR IP : ${req.ip}`);
        res.status(429).json({
            success: false,
            message: "REQUEST LIMIT EXCEEDED"
        });
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })

})

//Implementing endpoints based rate limiting
app.use("/api/auth/register", limiterEndpoints);

//routes
app.use("/api/auth", authrouter)

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Identity Service is running on PORT : ${PORT}`)
})

//unhandled 
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at : ", promise, " reason : ", reason);
})
