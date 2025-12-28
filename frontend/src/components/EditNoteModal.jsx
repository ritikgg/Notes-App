import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import ColorPalette from "./ColorPalette";

function EditNoteModal({ note, onClose, onUpdate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [imageUrl, setImageUrl] = useState(""); // 1. State exists (Good)

  // Sync modal state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags?.join(", ") || "");
      setBgColor(note.style?.backgroundColor || "#ffffff");
      setImageUrl(note.imageUrl || ""); // 2. FIX: Sync Image URL
    }
  }, [note]);

  const handleSave = () => {
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onUpdate(note._id, {
      title,
      content,
      tags: tagArray,
      style: { backgroundColor: bgColor },
      imageUrl, // 3. FIX: Send Image URL to Backend
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        className="rounded-lg w-full max-w-[500px] shadow-xl relative transition-colors duration-200 overflow-hidden" // Added overflow-hidden for image
        style={{ backgroundColor: bgColor }}
      >
        
        {/* 4. FIX: IMAGE PREVIEW (Top of card) */}
        {imageUrl && (
            <img 
                src={imageUrl} 
                alt="Note attachment"
                className="w-full h-48 object-cover" 
            />
        )}

        {/* Inner Padding Container */}
        <div className="p-5 relative">
            
            {/* Close Button */}
            <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black bg-white/50 rounded-full p-1"
            >
            <MdClose className="text-xl" />
            </button>

            {/* Title Input */}
            <input
            type="text"
            className="w-full text-xl font-bold outline-none mb-3 text-gray-800 bg-transparent placeholder-gray-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />

            {/* Content Textarea */}
            <textarea
            className="w-full text-gray-700 outline-none resize-none mb-3 bg-transparent placeholder-gray-500"
            rows={5}
            placeholder="Note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />

            {/* Tags Section */}
            <div className="bg-black/5 p-2 rounded mb-4">
            <label className="text-xs text-gray-500 font-bold uppercase">
                Tags
            </label>
            <input
                type="text"
                className="w-full bg-transparent text-sm text-gray-700 outline-none"
                placeholder="comma, separated, tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            </div>

            {/* 5. FIX: IMAGE URL INPUT */}
            <div className="bg-black/5 p-2 rounded mb-4">
                <label className="text-xs text-gray-500 font-bold uppercase">
                    Image Link
                </label>
                <input
                    type="text"
                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                    placeholder="Paste image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            {/* Color Palette Section */}
            <div className="mb-4">
            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Change Color</p>
            <ColorPalette selectedColor={bgColor} onSelectColor={setBgColor} />
            </div>

            {/* Action Buttons (Cancel / Save) */}
            <div className="flex justify-end gap-2">
            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-black/10 rounded"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Save Changes
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default EditNoteModal;