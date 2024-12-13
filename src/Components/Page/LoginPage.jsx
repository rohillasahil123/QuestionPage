import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [phoneNumber, setphoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoader, setIsLoader] = useState(false);

  const isOtpFilled = otp.length === 4;
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); 
    if (otp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }
    setIsLoader(true);
     const phoneNumber = Cookies.get("phoneNumber")
    try {
      const response = await axios.post(
        "https://goquizzy.com/verify-otp",
        {
          phoneNumber: phoneNumber,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }

      );
      
      if (response.data.success) {
        const { token } = response.data;
        Cookies.set("userToken", token, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        toast.success("OTP verified successfully!");
        navigate("/");
      } else {
        toast.error(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoader(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      console.log(value);
      setOtp(value);
      console.log(value);
    }
  };

  const handleSendOtpClick = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phoneNumber number");
      return;
    }
    setIsLoader(true);
    try {
      const response = await axios.post("https://goquizzy.com/send-otp", {
        phoneNumber: phoneNumber,
      });

      if (response.status === 200) {
        toast.success("OTP sent successfully");
        Cookies.set("phoneNumber",phoneNumber, {
          secure: true,
          sameSite: "Strict",
          expires: 1,
        });
        setphoneNumber("");
        setName("");
        setIsOnScreen(true);

      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP sending:", error);
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountdownComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryCount]);

  const handleResendOtp = () => {
    if (retryCount < 5) {
      try {
        const response = axios.post(
          "https://credmantra.com/api/v1/auth/resend-otp",
          {
            phoneNumber: phoneNumber,
          }
        );
        console.log(response);
        toast.success(`OTP resent successfully your number ${phoneNumber}`);
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
      setCountdown(60);
      setIsCountdownComplete(false);
      setOtp(new Array(4).fill(""));
      setRetryCount((prev) => prev + 1);
    } else {
      toast.error("You have exceeded the maximum OTP resend attempts.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-800 from-opacity-50 to-green-500  to-opacity-75 ">
      <div className="h-full w-full flex justify-center items-center">
        {isOnScreen ? (
          <>
            {/* OTP Screen */}
            <div className="h-[80%] w-[90%] md:w-[30%] bg-transparent p-6 rounded-lg shadow-lg flex flex-col border items-center">
              <div className=" text-white text-center py-3 rounded-t-xl">
                <h1 className="font-bold text-lg md:text-2xl">OTP</h1>
              </div>
              <div className="text-center space-y-2">
                <h6 className="font-medium text-xs text-white  md:text-sm">
                  AUTHORIZATION IS REQUIRED TO YOU <br /> TO GET IN.
                </h6>
              </div>
              <div className="flex justify-center gap-2 my-4">
                <input
                  type="text"
                  className="h-12 w-[90%] border text-center text-xl font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleOtpChange}
                  value={otp}
                  maxLength={4}
                />
              </div>
              <div className="text-center space-y-4">
                {isCountdownComplete && !isOtpFilled ? (
                  <button
                    className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <button
                    className={`${
                      isOtpFilled
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white font-bold py-2 px-4 rounded-md`}
                    onClick={handleVerifyOtp}
                    disabled={!isOtpFilled}
                  >
                    Submit
                  </button>
                )}
                {countdown > 0 && (
                  <p className="text-sm text-white">{`Resend your OTP in ${countdown}s`}</p>
                )}
                <p className="text-xs text-white">
                  {retryCount < 5
                    ? `You have ${5 - retryCount} OTP resend attempts left.`
                    : "You have exceeded the maximum OTP resend attempts."}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="h-[80%] w-[90%] md:w-[30%] bg-transparent p-6 rounded-lg shadow-lg flex flex-col border items-center">
              <div className="text-2xl font-bold text-white mt-6 space-y-4 text-center">
                <h1 className="hover:text-orange-500">Login Here</h1>
                <h6 className="font-medium text-white text-sm">
                  AUTHORIZATION IS REQUIRED TO YOU <br /> TO GET IN.
                </h6>
              </div>
              <div className="space-y-4 mt-10 w-full ml-[10%]">
                <input
                  type="text"
                  className="h-10 w-[90%] border border-gray-300 text-white rounded-md px-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  className="h-10 w-[90%] border border-gray-300 text-white rounded-md px-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mobile Number"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setphoneNumber(e.target.value)}
                />
              </div>
              {isLoader ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent mt-6 rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-white">
                    Wait a few seconds
                  </p>
                </div>
              ) : (
                <button
                  className="w-[90%] bg-black mt-[10%] text-white font-bold py-2  rounded-md"
                  onClick={handleSendOtpClick}
                >
                  Send OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
