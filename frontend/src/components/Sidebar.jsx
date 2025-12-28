import React from "react";
import { MdLabelOutline, MdLightbulbOutline, MdDeleteOutline, MdArchive } from "react-icons/md";

function Sidebar({ tags, selectedTag, onSelectTag, onClear }) {
  return (
    <div className="w-[250px] flex-shrink-0 border-r border-gray-200 h-screen p-4 hidden md:flex flex-col bg-white">

      {/* 1. Main Notes Button */}
      <button
        onClick={onClear}
        className={`flex items-center gap-3 w-full p-3 rounded-r-full font-medium mb-2 transition-colors ${!selectedTag ? "bg-yellow-100 text-gray-800" : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        <MdLightbulbOutline className="text-xl" />
        Notes
      </button>

      {/* 2. Tag List */}
      <div className="mt-4 flex-grow overflow-y-auto">
        <h3 className="px-3 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Labels</h3>

        {tags.length === 0 && (
          <p className="px-3 text-xs text-gray-400 italic">No tags yet...</p>
        )}

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`flex items-center gap-3 w-full p-3 rounded-r-full font-medium mb-1 transition-colors ${selectedTag === tag ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <MdLabelOutline className="text-lg" />
            <span className="truncate">{tag}</span>
          </button>
        ))}
      </div>

      {/* 3. TRASH BUTTON (This is the new part!) */}
      <div className="border-t pt-2 mt-2">
        
        <button onClick={() => onSelectTag("ARCHIVE_SCREEN")}
          className={`flex items-center gap-3 w-full p-3 rounded-r-full font-medium transition-colors ${selectedTag === "ARCHIVE_SCREEN" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          <MdArchive className="text-xl" />
          Archive
        </button>
        <button
          onClick={() => onSelectTag("TRASH_SCREEN")}
          className={`flex items-center gap-3 w-full p-3 rounded-r-full font-medium transition-colors ${selectedTag === "TRASH_SCREEN" ? "bg-red-100 text-red-600" : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          <MdDeleteOutline className="text-xl" />
          Trash
        </button>

      </div>

    </div>
  );
}

export default Sidebar;