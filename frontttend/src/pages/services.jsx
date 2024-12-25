// import React from 'react'

// const services = () => {
//   return (
//     <div>
//       Services
//     </div>
//   )
// }

// export default services
import React from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
    const navigate = useNavigate(); // Hook for navigation

    // Function to handle emergency button click
    const handleEmergency = () => {
        // Navigate to the home page with an "emergency" context
        navigate("/SearchDriver", { state: { mode: "emergency" } });
    };

    // Function to handle regular button click
    const handleRegular = () => {
        // Navigate to the home page with a "regular" context
        navigate("/home", { state: { mode: "regular" } });
    };

    return (
        <div className="p-7 flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Choose a Mode</h1>
            <div className="flex space-x-4">
                {/* Emergency Button */}
                <button
                    onClick={handleEmergency}
                    className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:outline-none shadow-lg"
                >
                    Emergency
                </button>

                {/* Regular Button */}
                <button
                    onClick={handleRegular}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none shadow-lg"
                >
                    Regular
                </button>
            </div>
        </div>
    );
};

export default Services;

