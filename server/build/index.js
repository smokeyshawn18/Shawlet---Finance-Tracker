"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const financial_records_1 = __importDefault(require("./routes/financial-records")); // ✅ Import the router
const cors_1 = __importDefault(require("cors")); // ✅ Import cors
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
// Middlewares
app.use(express_1.default.json()); // To parse JSON request bodies
// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "";
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.error("Failed to connect to mongodb ", err));
// Apply routes
app.use("/financial-records", financial_records_1.default); // ✅ Correct usage of router
// Start the server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
