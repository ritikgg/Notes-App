import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-white text-center p-4">
            <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
            <p className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</p>
            <p className="text-gray-500 mt-2 mb-8">The page you are looking for doesn't exist or has been moved.</p>

            <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
                Go Back Home
            </button>
        </div>
    )
}

export default PageNotFound