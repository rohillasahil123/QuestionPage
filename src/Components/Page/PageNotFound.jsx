import React from "react";
import Lottie from "lottie-react";
import animationData from "../Assets/404.json"; 
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Lottie animationData={animationData} loop={true} style={{ width: 300, height: 300 }} />
      <h2 className="text-2xl font-bold mt-4">Oops! Page Not Found</h2>
      <Link to="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Go Home</Link>
    </div>
  )
}

export default PageNotFound
