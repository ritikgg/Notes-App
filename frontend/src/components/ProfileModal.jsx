import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { data } from "react-router-dom";
import { toast } from "react-toastify"

const ProfileModal = ({ user, onClose, onUpdate }) => {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        if (!name || !email) {
            toast.error("Name and Email are required");
            return;
        }

        try {
            const token = user.token;

            const response = await fetch("https://notes-app-backend-ydhk.onrender.com/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, password: password || undefined }),
            });

            if (response.ok) {
                const data = await response.json();
                const updatedUser = { ...data, token: token };
                onUpdate(updatedUser);
                onClose();
            }
            else {
                const err = await response.json();
                toast.error(err.error || "Update failed")
            }
        }
        catch (error) {
            console.error("PROFILE UPDATE ERROR:", error)
            toast.error("Something went wrong");
        }
    }

    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[90%] max-w-md p-6 relative shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-black">
                    <MdClose className="text-2xl" />
                </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">

                {/* Name */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-500 outline-none transition-colors"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-500 outline-none transition-colors"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                        New Password <span className="text-gray-300 font-normal">(Optional)</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Leave empty to keep current"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-b-2 border-gray-200 py-2 focus:border-blue-500 outline-none transition-colors"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>

            </div>
        </div>
    </div>
    )
};

export default ProfileModal;