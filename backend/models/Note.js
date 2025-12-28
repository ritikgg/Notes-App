import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: false,
        default: ""
    },
    content: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    style: {
        backgroundColor: {
            type: String,
            default: "white"
        }
    }, // <--- MAKE SURE THIS COMMA IS HERE!
    
    // The New Image Field
    imageUrl: {
        type: String,
        default: null
    },

    isTrash: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note;