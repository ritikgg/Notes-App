import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://notes-app-backend-ydhk.onrender.com/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registeration Success", data);
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate("/")
            }
            else {
                setError(data.error || "Registeration Failed");
            }
        }
        catch (err) {
            setError("Server Error")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
                <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 w-full mb-3 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-3 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600">
                    Sign Up
                </button>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                </p>
            </form>
        </div>
    )
}
export default Register;