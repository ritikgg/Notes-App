# 📝 Personal Notes App (MERN Stack)

> A full-stack, feature-rich note-taking application inspired by Google Keep. Built to demonstrate advanced CRUD operations, authentication, and state management.

🔴 **Live Demo:** https://notes-app-eta-bay.vercel.app/
⚙️ **Backend API:** https://notes-app-backend-ydhk.onrender.com/

<img width="1579" height="767" alt="image" src="https://github.com/user-attachments/assets/04a2cfa5-f0c5-447f-ac69-cc64924ad464" />


---

## 🚀 Features

### Core Functionality
- **Authentication:** Secure Login/Signup with JWT (JSON Web Tokens) & BCrypt password hashing.
- **CRUD Operations:** Create, Read, Update, and Delete notes seamlessly.
- **Search & Filter:** Real-time search by title, content, or tags.
- **Tagging System:** Organize notes with custom tags.

### Advanced Features
- **📌 Pinning:** Pin important notes to the top of your dashboard.
- **🗂️ Archiving:** Archive notes to declutter your workspace without deleting them.
- **🗑️ Trash Bin:** Soft delete feature with "Restore" and "Delete Forever" options.
- **🎨 Customization:** Change background colors of individual notes.
- **🖼️ Visuals:** Add image URLs to notes for visual reference.
- **👤 Profile Management:** Update user name and password inside the app.

---

## 🛠️ Tech Stack

**Frontend:**
- **React.js** (Vite)
- **Tailwind CSS** (Styling & Responsive Design)
- **React Router** (Navigation)
- **React Icons** (UI Elements)

**Backend:**
- **Node.js & Express.js** (RESTful API)
- **MongoDB & Mongoose** (Database & Schema)
- **JWT & BCrypt** (Security)
- **Cors** (Cross-Origin Resource Sharing)

**Deployment:**
- **Frontend:** Vercel
- **Backend:** Render

---

## 💻 Run Locally

Clone the project to your local machine:

git clone https://github.com/ritikgg/Notes-App.git

**Backend Setup**
Navigate to the backend folder and install dependencies:

cd backend
npm install
npm start

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_random_secret_string

Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

cd frontend
npm install
npm run dev

👨‍💻 Author
Ritik Goswami

GitHub: https://github.com/ritikgg

LinkedIn: https://www.linkedin.com/in/ritik-puri-goswami25/
