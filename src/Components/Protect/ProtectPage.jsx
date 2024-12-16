import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectPage = (props) => {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const token = getCookie('userToken'); 
    if (!token) {
      navigate('/loginteacher');
    }
  }, [navigate]);

  return (
    <div>
      <Component />
    </div>
  );
};

export default ProtectPage;