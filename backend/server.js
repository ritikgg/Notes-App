import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import userRoutes from "./routes/user.routes.js";
import noteRoutes from "./routes/note.routes.js"; 

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Succesfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};
connectDB();

app.get("/", (req, res) => {
    res.send("API is running with Bun!");
});

// --- CONNECT ROUTES ---
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});