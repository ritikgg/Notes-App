import { MdDeleteForever, MdOutlinePushPin, MdArchive, MdUnarchive } from "react-icons/md";

function Note({ note, onDelete, onEdit, onPin, onArchive }) {
  return (
    <div 
      onClick={onEdit}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white flex flex-col justify-between min-h-[150px] cursor-pointer overflow-hidden" // Added overflow-hidden
      style={{ backgroundColor: note.style?.backgroundColor || "white" }}
    >
      
      {/* 0. IMAGE DISPLAY (NEW) */}
      {note.imageUrl && (
        <img 
            src={note.imageUrl} 
            alt="attachment" 
            className="w-full h-48 object-cover -mt-4 -mx-4 mb-4" 
            style={{ width: "calc(100% + 2rem)" }} // Stretches explicitly to cover padding
        />
      )}

      {/* 1. Title & Pin Area */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800 break-words w-[90%]">
          {note.title}
        </h3>
        <button onClick={(e) => {
          e.stopPropagation();
          onPin(note._id);
        }}
          className={`text-xl hover:text-blue-500 transition-colors ${note.isPinned ? "text-blue-500" : "text-gray-300"}`}
        >
          <MdOutlinePushPin />
        </button>
      </div>

      {/* 2. Main Content */}
      <p className="text-gray-600 whitespace-pre-wrap break-words flex-grow">
        {note.content}
      </p>
      
      {/* TAGS DISPLAY */}
      <div className="flex flex-wrap gap-1 mb-2 mt-2">
        {note.tags && note.tags.map((tag, index) => (
          <span key={index} className="bg-black/10 text-gray-600 text-[10px] px-2 py-1 rounded-full uppercase font-bold">
            {tag}
          </span>
        ))}
      </div>

      {/* 3. Footer (Date + Action Buttons) */}
      <div className="flex justify-between items-center mt-4 pt-2 border-t border-black/10">
        <div className="text-xs text-gray-400">
          {new Date(note.createdOn || note.createdAt).toLocaleDateString()}
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1">
          
          {/* ARCHIVE/UNARCHIVE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${
              note.isArchived ? "text-purple-600" : "text-gray-400 hover:text-purple-500"
            }`}
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            {note.isArchived ? <MdUnarchive className="text-xl" /> : <MdArchive className="text-xl" />}
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Delete"
          >
            <MdDeleteForever className="text-xl"/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;