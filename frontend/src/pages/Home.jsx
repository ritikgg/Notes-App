import { useEffect, useState } from "react";
import Note from "../Notes";
import { useNavigate } from "react-router-dom";
import AddNote from "../components/AddNote";
import EditNoteModal from "../components/EditNoteModal";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import ProfileModal from "../components/ProfileModal";
import EmptyCard from "../components/EmptyCard"; // Import EmptyCard

function Home() {
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  // 1. THE GATEKEEPER & INITIAL LOAD
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      navigate("/login");
    } else {
      const userData = JSON.parse(userInfo);
      setUser(userData);

      const fetchNotes = async () => {
        try {
          const response = await fetch("https://notes-app-backend-ydhk.onrender.com/api/notes", {
            headers: { Authorization: `Bearer ${userData.token}` },
          });

          if (response.status === 401) {
            localStorage.removeItem("userInfo");
            navigate("/login");
            return;
          }

          const data = await response.json();
          if (Array.isArray(data)) {
            setNotes(data);
          } else {
            setNotes([]);
          }
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchNotes();
    }
  }, [navigate]);

  // 2. LOGOUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // 3. ADD NOTE
  const addNote = async ({ title, content, tags, style, imageUrl }) => {
    if (!title && !content) return;

    try {
      const res = await fetch("https://notes-app-backend-ydhk.onrender.com/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, content, tags, style, imageUrl }),
      });

      const newNote = await res.json();
      if (newNote._id) {
        setNotes([...notes, newNote]);
      }
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  // 4. DELETE SINGLE NOTE (Soft Delete)
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`https://notes-app-backend-ydhk.onrender.com/api/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.ok) {
        const updatedNotes = notes.map((note) =>
          note._id === id ? { ...note, isTrash: true } : note
        );
        setNotes(updatedNotes);
        toast.error("Note moved to Trash");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // 5. UPDATE NOTE
  const updateNote = async (id, updatedData) => {
    const updatedNotes = notes.map((note) => {
      if (note._id === id) {
        return { ...note, ...updatedData };
      }
      return note;
    });
    setNotes(updatedNotes);

    try {
      await fetch(`https://notes-app-backend-ydhk.onrender.com/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 6. TOGGLE PIN
  const updateIsPinned = async (note) => {
    const id = note._id;
    const newIsPinned = !note.isPinned;

    const updatedNotes = notes.map((n) =>
      n._id === id ? { ...n, isPinned: newIsPinned } : n
    );
    setNotes(updatedNotes);
    try {
      await fetch(`https://notes-app-backend-ydhk.onrender.com/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isPinned: newIsPinned }),
      });
    } catch (error) {
      console.error("Pin update failed:", error);
    }
  };

  // 7. RESTORE NOTE (From Trash)
  const restoreNote = async (id) => {
    try {
      const response = await fetch(`https://notes-app-backend-ydhk.onrender.com/api/notes/update-trash/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isTrash: false }),
      });
      if (response.ok) {
        const updatedNotes = notes.map((note) =>
          note._id === id ? { ...note, isTrash: false } : note
        );
        setNotes(updatedNotes);
        toast.success("Note restored!");
      }
    } catch (error) {
      console.error("Restore failed", error);
    }
  };

  // 8. PERMANENT DELETE (Empty trash)
  const deletePermanent = async (id) => {
    if (!window.confirm("Delete forever? This cannot be undone.")) return;

    try {
      const response = await fetch(
        `https://notes-app-backend-ydhk.onrender.com/api/notes/delete-permanent/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.ok) {
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes);
      }
    } catch (error) {
      console.error("Permanent delete failed:", error);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    toast.success("Profile Updated Successfully!");
  };

  // ARCHIVE/UNARCHIVE NOTE
  const archiveNote = async (id) => {
    try {
      const response = await fetch(
        `https://notes-app-backend-ydhk.onrender.com/api/notes/archive/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.ok) {
        const updatedNote = await response.json();

        // Update local state: replace the old note with the updated one from server
        const updatedNotes = notes.map((note) =>
          note._id === id ? updatedNote : note
        );

        setNotes(updatedNotes);

        // Feedback
        if (updatedNote.isArchived) {
          toast.success("Note Archived");
        } else {
          toast.success("Note moved to Inbox");
        }
      }
    } catch (error) {
      toast.error("Failed to archive note");
      console.error("Archive error:", error);
    }
  };

  // --- FILTERING LOGIC ---

  // 1. Get Tags only from Active Notes
  const allTags = notes
    .filter((note) => !note.isTrash && !note.isArchived)
    .flatMap((note) => note.tags);
  const uniqueTags = [...new Set(allTags)];

  // 2. Are we in Trash View?
  const isTrashView = selectedTag === "TRASH_SCREEN";
  const isArchiveView = selectedTag === "ARCHIVE_SCREEN";

  // 3. Main Filter
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const isTrash = note.isTrash === true;
    const isArchived = note.isArchived === true;

    // GATE 1: Trash vs Normal View
    if (isTrashView) {
      return isTrash;
    }

    if (isArchiveView) {
      return isArchived && !isTrash;
    }

    if (isTrash || isArchived) return false;

    // GATE 2: Search Query
    const matchesSearch =
      note.title?.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(query));

    // GATE 3: Tag Selection
    const matchesTag =
      selectedTag && selectedTag !== "TRASH_SCREEN" && selectedTag !== "ARCHIVE_SCREEN"
        ? note.tags.includes(selectedTag)
        : true;

    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const otherNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* SIDEBAR */}
      <Sidebar
        tags={uniqueTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        onClear={() => setSelectedTag(null)}
      />

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto h-full p-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {isTrashView ? "Trash" : isArchiveView ? "Archive" : "My Notes"}
          </h1>

          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full border border-gray-300 rounded-lg p-2 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span
              onClick={() => setOpenProfile(true)}
              className="text-gray-600 font-medium hidden sm:block cursor-pointer hover:underline"
            >
              {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* INPUT AREA - Hide when in Trash or Archive View */}
        {!isTrashView && !isArchiveView && <AddNote onAdd={addNote} />}

        {/* NOTES LIST */}
        <div className="mt-5">
          {/* === A. TRASH VIEW RENDER === */}
          {isTrashView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className="border border-red-200 bg-red-50 rounded-lg p-4 flex flex-col justify-between min-h-[150px]"
                >
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">{note.title}</h3>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-red-100">
                    <button
                      onClick={() => restoreNote(note._id)}
                      className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deletePermanent(note._id)}
                      className="text-xs font-bold text-red-600 hover:bg-red-100 px-2 py-1 rounded"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))}
              {filteredNotes.length === 0 && (
                <EmptyCard
                  message="Trash is empty. Good job keeping things clean!"
                  type="trash"
                />
              )}
            </div>
          ) : isArchiveView ? (
            /* === B. ARCHIVE VIEW RENDER === */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredNotes.map((note) => (
                <Note
                  key={note._id}
                  note={note}
                  onDelete={() => deleteNote(note._id)}
                  onEdit={() => setSelectedNote(note)}
                  onPin={() => updateIsPinned(note)}
                  onArchive={() => archiveNote(note._id)}
                />
              ))}
              {filteredNotes.length === 0 && (
                <EmptyCard
                  message="Your archive is empty. Move notes here to clear your workspace without deleting them."
                  type="archive"
                />
              )}
            </div>
          ) : (
            /* === C. NORMAL VIEW RENDER === */
            <>
              {/* PINNED SECTION */}
              {pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">
                    Pinned
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pinnedNotes.map((note) => (
                      <Note
                        key={note._id}
                        note={note}
                        onDelete={() => deleteNote(note._id)}
                        onEdit={() => setSelectedNote(note)}
                        onPin={() => updateIsPinned(note)}
                        onArchive={() => archiveNote(note._id)} // Fixed: added onArchive
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* OTHERS SECTION */}
              {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">
                  Others
                </h3>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherNotes.map((note) => (
                  <Note
                    key={note._id}
                    note={note}
                    onDelete={() => deleteNote(note._id)}
                    onEdit={() => setSelectedNote(note)}
                    onPin={() => updateIsPinned(note)}
                    onArchive={() => archiveNote(note._id)}
                  />
                ))}
              </div>

              {/* EMPTY STATE */}
              {filteredNotes.length === 0 && (
                <EmptyCard
                  message={
                    searchQuery
                      ? "Oops! No notes found matching your search."
                      : "Start your journey! Click the box above to create your first note."
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedNote && (
        <EditNoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={updateNote}
        />
      )}

      {/* Profile Modal Logic */}
      {openProfile && (
        <ProfileModal
          user={user}
          onClose={() => setOpenProfile(false)}
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}

export default Home;