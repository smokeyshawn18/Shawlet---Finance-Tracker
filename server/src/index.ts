import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records"; // ✅ Import the router
import cors from "cors"; // ✅ Import cors

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
app.use(cors());

// Middlewares
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
const mongoURI: string = process.env.MONGO_URI || "";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("Failed to connect to mongodb ", err));

// Apply routes
app.use("/financial-records", financialRecordRouter); // ✅ Correct usage of router

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
