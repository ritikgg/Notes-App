import { useEffect, useState } from "react";
import Note from "../Notes"; 
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  // 1. THE GATEKEEPER & INITIAL LOAD
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) {
      // If no token exists, immediately redirect
      navigate("/login");
    } else {
      // BEST PRACTICE: Parse once into a local variable. 
      // If we use 'user.token' right after 'setUser', it will be null 
      // because React state updates are asynchronous.
      const userData = JSON.parse(userInfo);
      setUser(userData);

      const fetchNotes = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/notes", {
            headers: {
              // Using the local 'userData' variable fixed the ReferenceError
              Authorization: `Bearer ${userData.token}`},
          });

          if(response.status === 401) {
            localStorage.removeItem("userInfo");
            navigate("/login");
            return;
          }

          const data = await response.json();

          // Safety check to prevent .map() crashes
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
  const addNote = async () => {
    if (!text) return;
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      const newNote = await res.json();
      if (newNote._id) {
        setNotes([...notes, newNote]);
        setText("");
      }
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  // 4. CLEAR ALL NOTES
  const clearAll = async () => {
    const confirmed = window.confirm("Are you sure you want to DELETE All notes?");
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Backend delete failed");
      setNotes([]);
    } catch (error) {
      console.error("Clear all failed:", error);
    }
  };

  // 5. DELETE SINGLE NOTE
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // 6. UPDATE NOTE
  const updateNote = async (id, newText) => {
    // Optimistic Update: Change the UI immediately
    const updatedNotes = notes.map((note) => {
      if (note._id === id) {
        return { ...note, content: newText };
      }
      return note;
    });
    setNotes(updatedNotes);

    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: newText }),
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">
            Hello, {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a note..."
          className="border p-2 flex-grow rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") addNote();
          }}
        />
        <button
          onClick={addNote}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={clearAll}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Clear All
        </button>
      </div>

      {/* NOTES LIST */}
      <div className="mt-5 grid gap-4">
        {notes.map((note) => (
          <Note
            key={note._id}
            content={note.content}
            onDelete={() => deleteNote(note._id)}
            onUpdate={(newText) => updateNote(note._id, newText)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;