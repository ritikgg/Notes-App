import express from "express";
import { 
    getNotes, 
    createNote, 
    updateNote, 
    deleteNote, 
    updateTrash, 
    deleteNotePermanent, 
    toggleArchive
} from "../controllers/note.controller.js";
import protect from "../middleware/authMiddleware.js";
import { isPropertySignature } from "typescript";

const router = express.Router();

// The "/" means "/api/notes" because we link it that way in server.js
router.get("/", protect, getNotes);
router.post("/", protect, createNote);

router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote); // Soft Delete

router.put("/update-trash/:id", protect, updateTrash); // Restore
router.delete("/delete-permanent/:id", protect, deleteNotePermanent); // Hard Delete

router.put("/archive/:id", protect, toggleArchive);

export default router;