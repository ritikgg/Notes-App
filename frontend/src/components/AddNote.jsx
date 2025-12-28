import { useState } from "react";
import ColorPalette from "./ColorPalette";

function AddNote({ onAdd }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState(""); // Initialize as String
    const [bgColor, setBgColor] = useState('#ffffff');
    const [imageUrl, setImageUrl] = useState("");

    const handleAdd = () => {
        if (!content && !title) return;

        const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)

        onAdd({
            title, 
            content, 
            tags: tagArray, 
            style: { backgroundColor: bgColor }, 
            imageUrl 
        });

        // RESET FORM
        setTitle("");
        setContent("");
        setTags(""); // <--- FIX: Reset to empty STRING, not Array []
        setImageUrl("");
        setBgColor("#ffffff");
        setIsExpanded(false);
    };

    return (
        <div className="mx-auto w-full max-w-[600px] mb-8">
            <div
                className="shadow-md rounded-lg border border-gray-200 overflow-hidden transition-colors duration-200"
                style={{ backgroundColor: bgColor }}
            >
                {isExpanded && (
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full p-3 font-bold text-gray-800 outline-none placeholder-gray-500 bg-transparent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                )}

                <textarea
                    placeholder="Take a note..."
                    className="w-full p-3 text-gray-700 outline-none resize-none placeholder-gray-500 bg-transparent"
                    rows={isExpanded ? 3 : 1}
                    value={content}
                    onClick={() => setIsExpanded(true)}
                    onChange={(e) => setContent(e.target.value)}
                />

                {isExpanded && (
                    <div className="p-3 bg-black/5">
                        
                        {/* TAGS INPUT */}
                        <input
                            type="text"
                            placeholder="Add tags..."
                            className="text-sm bg-transparent outline-none w-full text-gray-600 mb-2 border-b border-gray-200 pb-1"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />

                        {/* IMAGE URL INPUT (Moved Up) */}
                        <div className="mb-2 mt-2">
                             <input 
                                type="text"
                                placeholder="Paste image URL here..."
                                className="w-full text-sm bg-gray-50 p-2 rounded border border-gray-200 focus:outline-blue-500"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>

                        {/* COLOR PALETTE */}
                        <div className="mt-2">
                            <ColorPalette selectedColor={bgColor} onSelectColor={setBgColor} />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-600 hover:bg-black/10 px-4 py-1 rounded text-sm font-medium"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleAdd}
                                className="bg-blue-500 text-white px-4 py-1 rounded text-sm font-medium hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default AddNote;