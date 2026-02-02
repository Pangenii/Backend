import 'dotenv/config';
import express from "express";
import { connectToDB } from "./config/connectDB";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())

connectToDB(process.env.MONGO_URI);

app.listen(PORT, () => {
    console.log(`server is running on the port ${PORT}`)
})



