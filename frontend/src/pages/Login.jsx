import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // To show error messages
  const navigate = useNavigate(); // Hook for redirection

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS:
        console.log("Login Success:", data);
        
        // 1. Save the user info (Token) to localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        // 2. Redirect to Home Page
        navigate("/");
      } else {
        // FAIL:
        setError(data.error || "Login Failed");
      }
    } catch (err) {
      setError("Server not responding. Is it running?");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        
        {/* Error Message Alert */}
        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 text-sm rounded">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600">
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          New user? <Link to="/register" className="text-blue-500">Register Here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;