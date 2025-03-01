import React,{useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyDriverOTP = () => {
    const [otp, setOtp] = useState(""); // State for the OTP input
    const [message, setMessage] = useState(""); // State for messages
    const navigate = useNavigate();
    const showMessage = (msg, duration = 5000) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, duration);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            showMessage("Please enter a valid 6-digit OTP.");
            return;
        }
        const token = localStorage.getItem('token');
        //console.log(token);
        //const phoneNumber = localStorage.getItem('phoneNumber');
        //console.log(phoneNumber);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                //phoneNumber: phoneNumber,
            },
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/driver/verify`, {
                otp
            }, config
            );
            if (response.status === 200) {
                showMessage("OTP verified successfully!");
                navigate("/driver-home");
            }
        } catch (error) {
            setMessage(
                error.response?.data?.message || "An error occurred while verifying the OTP."
            );
        }
    };

    return (
        <div className="p-7 flex flex-col items-center justify-center">
            <h2 className="text-2xl mb-4">verify OTP</h2>
            {message && <p className="text-red-500 mb-4">{message}</p>} {/* Display messages */}
            <form onSubmit={handleVerify} className="flex flex-col items-center">
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your 6-digit OTP"
                    maxLength="6" // Restrict input length to 6 digits
                    className="border border-gray-400 p-2 rounded w-64 text-center mb-4"
                />
                <button
                    type="submit"
                    className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default VerifyDriverOTP
