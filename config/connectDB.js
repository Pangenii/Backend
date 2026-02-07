import "dotenv/config"
import mongoose from "mongoose";

export const connectToDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("Successfully connected to DB")
    } catch (error) {
        console.log("Problem connecting to DB", error.message);
        process.exit(1);
    }
}