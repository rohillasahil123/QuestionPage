import React from "react";
import { FaWallet, FaShieldAlt, FaRupeeSign, FaClock, FaCertificate, FaHeadset } from "react-icons/fa";
import './FeaturesSection.css'

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: <FaWallet className="fa-icon" color="#012141" size={48} />, // Wallet icon
      label: "Instant Withdrawals",
    },
    {
      id: 2,
      icon: <FaShieldAlt className="fa-icon" color="#012141" size={48} />, // Shield icon
      label: "100% Secure & Legal",
    },
    {
      id: 3,
      icon: <FaRupeeSign className="fa-icon" color="#012141" size={48} />, // Rupee icon
      label: "Supreme Cashback",
    },
    {
      id: 4,
      icon: <FaClock className="fa-icon" color="#012141" size={48} />, // Clock icon
      label: "24/7 Tournaments",
    },
    {
      id: 5,
      icon: <FaCertificate className="fa-icon" color="#012141" size={48} />, // Certification icon
      label: "RNG Certified",
    },
    {
      id: 6,
      icon: <FaHeadset className="fa-icon" color="#012141" size={48} />, // Headset icon
      label: "Dedicated Customer Support",
    },
  ];

  return (
    <div className="features-section">
      <h2 className="section-title">WHY PLAY ONLINE MONEY GAMES ON GO QUIZZY?</h2>
      <div className="features">
        {features.map((feature) => (
          <div className="feature-item" key={feature.id}>
            <div className="icon">{feature.icon}</div>
            <p>{feature.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
