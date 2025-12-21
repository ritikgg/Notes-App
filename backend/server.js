import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import "dotenv/config";
import Note from "./models/Note.js";
import User from "./models/User.js";
import generateToken from "./utils/generateTokens.js";
import protect from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Succesfully");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed:", error)
        process.exit(1);
    }
};

connectDB();

app.get("/", (req, res) => {
    res.send("API is running with Bun!");
});

app.get("/api/notes", protect, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: "Server Error" })
    }
});

app.post('/api/notes', protect, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: "Content required" });

        const newNote = new Note({
            content,
            user: req.user._id
        });

        await newNote.save();
        res.json(newNote);
    }
    catch (error) {
        console.log("❌ POST ERROR:", error)
        res.status(500).json({ error: "Server Error" });
    }
});

app.put("/api/notes/:id", protect, async (req, res) => {
    try {
        const { content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        );
        res.json(updatedNote);
    }
    catch (error) {
        res.status(500).json({ error: "Update failed" })
    }
});

app.post("/api/users/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please include all fields" });

        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" })
        }
    }
    catch (error) {
        console.log("❌ REGISTER ERROR:", error);

        res.status(500).json({ error: "Server Error" });
    }
});

app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),

            })
        } else {
            res.status(401).json({ error: "Invalid email or password" })
        }
    }
    catch (error) {
        console.log("❌ LOGIN ERROR:", error);
        res.status(500).json({ error: "Server Error" })
    }
})



app.delete('/api/notes/:id', protect, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted" })
    }
    catch (error) {
        res.status(500).json({ error: "Delete failed" })
    }
})


app.delete('/api/notes', protect, async (req, res) => { 
    try {
        await Note.deleteMany({ user: req.user._id }); // Only delete THIS user's notes
        res.json({ message: "All notes deleted" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});



const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});