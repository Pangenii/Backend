import path from "path";
import winston from "winston";

const logDir = path.join(process.cwd(), "logs");

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: "auth-service" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        //LOGS ERROR TO ERROR.LOG FILE
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error"
        }),
        //LOGS EVERYTHING(info,warn,error,debug) INSIDE COMBINED.LOG FILE
        new winston.transports.File({ filename: path.join(logDir, "combined.log") })
    ]
})

export default logger;