import { useState } from "react";
import App from "./App";

function Note({content, onDelete, onUpdate}) {

     const [isEditing, setIsEditing] = useState(false);
     const [newContent, setNewContent] = useState(content);
     const handleSave = () => {
        onUpdate(newContent);
        setIsEditing(false);
     }
     return (
        <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
            {isEditing ? (
                    <div className="flex gap-2 w-full">
                        <input 
                        type="text"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="border p-1 rounded w-full" 
                        
                        //listen for ENTER key
                        onKeyDown={(e) => {
                            if(e.key ==="Enter") {
                                handleSave();
                            }
                        }}
                        
                        />

                        <button onClick={handleSave} className="bg-green-500 text-white px-2 rounded">
                            Save
                        </button>
                    </div>
            ) : (
                <>
                <span onClick={() => setIsEditing(true)}>{content}</span>
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(true)} className="text-blue-500">
                        Edit
                    </button>
                    <button onClick={onDelete} className="text-red-500 font-bold">
                        X
                    </button>
                </div>
                </>
            )}
        </div>
     );
}
export default Note;