import 'dotenv/config';
import express from "express";
import { connectToDB } from "../../config/connectDB.js";
import cors from "cors";

const app = express();
//middleware
app.use(express.json())
app.use(cors())

connectToDB(process.env.MONGO_URI);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on the port ${PORT}`)
})



