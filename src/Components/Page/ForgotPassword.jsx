import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/forgotPassword/sendOtp`, {phone}, {
        validateStatus: (status) => status < 500,
      });
      const result = response.data;
      if (result.success) {
        toast.success("OTP sent successfully");
        setStep(2);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/forgotPassword/verifyOtp`, { phone, otp }, {
        validateStatus: (status) => status < 500,
      });
      const result = response.data;
      if (result.success) {
        toast.success("OTP verified successfully");
        await localStorage.setItem("resetToken", result.resetToken);
        navigate("/resetPassword", { state: { phone } });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-gray-100 px-10">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {step === 1 ? "Forgot Password" : "Verify OTP"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-md font-medium transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 transition"
                placeholder="Enter OTP"
              />
            </div>

            {/* Verify OTP Button */}
            <button
              type="submit"
              className={`w-full mt-4 bg-green-600 text-white py-2 rounded-md font-medium transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500"
              }`}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
