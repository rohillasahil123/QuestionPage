import React, { useEffect } from "react";
import "./Footer.css";

const Footer = () => {
  useEffect(() => {
    const countTo = (element, options) => {
      let { from, to, speed, refreshInterval } = options;
      const loops = Math.ceil(speed / refreshInterval);
      const increment = (to - from) / loops;
      let value = from;
      let loopCount = 0;

      const interval = setInterval(() => {
        value += increment;
        loopCount++;
        element.textContent = value.toFixed(0);

        if (loopCount >= loops) {
          clearInterval(interval);
          element.textContent = to;
        }
      }, refreshInterval);
    };

    document.querySelectorAll(".count-number").forEach((element) => {
      const to = parseInt(element.dataset.to, 10);
      const speed = parseInt(element.dataset.speed, 10);

      countTo(element, { from: 0, to, speed, refreshInterval: 30 });
    });
  }, []);
  return (
    <footer className="footer text-white text-center text-lg-start">
      {/* Grid container */}
      <div className="container p-4">
        {/* Grid row */}
        <div className="row">
          {/* Column 1 */}
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0 content-center">
            <h1 style={{fontSize:'20px', fontWeight:'bold'}} className="mb-4 text-uppercase ">Footer Content</h1>
            <p>Welcome to Quizzy, your ultimate quiz app for both single and multiplayer gameplay! Whether you’re here to learn, challenge yourself, or compete with friends, Quizzy offers an interactive and engaging experience.</p>
          </div>
          {/* Column 2 */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0 content-center">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-white">
                  Link 1
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Link 2
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Link 3
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Link 4
                </a>
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#!" className="text-white">
                  Link 1
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Link 2
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Link 3
                </a>
              </li>
              <li>
                <a href="#!" className="text-white">
                  Link 4
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center p-3 copyright">
        © 2020 Copyright: MDBootstrap.com 
      </div>
    </footer>
  );
};

export default Footer;
