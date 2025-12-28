import Note from "../models/Note.js";

// @desc    Get all notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id }).sort({ isPinned: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Create a new note
export const createNote = async (req, res) => {
    // 1. Destructure imageUrl
    const { title, content, tags, style, imageUrl } = req.body;
    const user = req.user;

    if (!title && !content) {
        return res.status(400).json({ error: "Title or Content required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            style: style || { backgroundColor: "white" },
            imageUrl: imageUrl || null, // 2. Save logic
            user: user._id,
        });

        await note.save();
        res.json(note);
    } catch (error) {
        console.error("Create Note Error:", error); // Log the real error to terminal
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc    Update a note
export const updateNote = async (req, res) => {
    // 1. Destructure imageUrl
    const { title, content, tags, isPinned, style, imageUrl } = req.body;
    const user = req.user;

    try {
        const note = await Note.findOne({ _id: req.params.id, user: user._id });

        if (!note) return res.status(404).json({ error: "Note not found" });

        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.style = style || note.style;
        if (isPinned !== undefined) note.isPinned = isPinned;
        
        // 2. Update logic
        if (imageUrl !== undefined) note.imageUrl = imageUrl;

        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};

// @desc    Archive Note
export const toggleArchive = async (req, res) => {
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: req.params.id, user: user._id });
        if (!note) return res.status(404).json({ error: "Note not found" });

        note.isArchived = !note.isArchived;
        
        if (note.isArchived) {
            note.isPinned = false;
            note.isTrash = false;
        }

        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: "Archive toggle failed" });
    }
};

// @desc    Soft Delete
export const deleteNote = async (req, res) => {
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: req.params.id, user: user._id });
        if (!note) return res.status(404).json({ error: "Note not found" });

        note.isTrash = true;
        await note.save();
        res.json({ message: "Note moved to trash" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
};

// @desc    Restore
export const updateTrash = async (req, res) => {
    const { isTrash } = req.body;
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: req.params.id, user: user._id });
        if (!note) return res.status(404).json({ error: "Note not found" });

        note.isTrash = isTrash;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};

// @desc    Permanent Delete
export const deleteNotePermanent = async (req, res) => {
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: req.params.id, user: user._id });
        if (!note) return res.status(404).json({ error: "Note not found" });

        await note.deleteOne();
        res.json({ message: "Note permanently deleted" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
};