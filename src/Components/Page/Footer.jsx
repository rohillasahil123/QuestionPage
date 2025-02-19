import React, { useEffect, useRef, useState } from "react";
import { FaHome, FaPhoneAlt, FaInfoCircle, FaFacebook, FaTwitter, FaInstagram, FaGoogle, FaMapMarkerAlt } from 'react-icons/fa';
import "./Footer.css";

const Footer = () => {
  const sectionRef = useRef(null); // Reference to the About Me section
  const [startCounting, setStartCounting] = useState(false); // Control when counting starts

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounting(true); // Start counting when the section is visible
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (startCounting) {
      const counters = document.querySelectorAll(".counter");
      counters.forEach((counter) => {
        const updateCounter = () => {
          const target = +counter.getAttribute("data-target");
          const count = +counter.innerText.replace("+", "");
          const increment = target / 200;

          if (count < target) {
            counter.innerText = Math.ceil(count + increment) + "+";
            setTimeout(updateCounter, 10);
          } else {
            counter.innerText = target + "+";
          }
        };
        updateCounter();
      });
    }
  }, [startCounting]);

  return (
    <footer className="footer text-white text-center text-lg-start">
      {/* Grid container */}
      <div className="container p-4">
        {/* Grid row */}
        
        <div className="row">
          {/* Column 1 */}
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0 content-center">
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }} className="mb-4 text-uppercase ">Go Quizzy</h1>
            <p>Welcome to Quizzy, your ultimate quiz app for both single and multiplayer gameplay! Whether you’re here to learn, challenge yourself, or compete with friends, Quizzy offers an interactive and engaging experience.</p>
          </div>
          {/* Column 2 */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0 content-center">
            <h5 className="text-uppercase mb-3">Company</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="/" className="text-white flex items-center">
                  <FaHome size={15} className="mr-2"/>
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-white flex items-center">
                  <FaInfoCircle  size={15} className="mr-2"/>
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white flex items-center">
                  <FaPhoneAlt  size={15} className="mr-2"/>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#!" className="text-blue flex items-center">
                  <FaGoogle  size={15} className="mr-2"/>
                  goquizzy@gmail.com
                </a>
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white flex items-center">
                  <FaFacebook  size={15} className="mr-2"/>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#!" className="text-white flex items-center">
                  <FaInstagram  size={15} className="mr-2"/>
                  Instagram
                </a>
              </li>
              <li>
                <a href="#!" className="text-white flex items-center">
                  <FaMapMarkerAlt  size={15} className="mr-2"/>
                  Location
                </a>
              </li>
              <li>
                <a href="#!" className="text-white flex items-center">
                  <FaTwitter  size={15} className="mr-2"/>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div ref={sectionRef} className="pb-5">
          <div className="counters">
            <div className="counter-box">
              <h2 className="counter" data-target="20">
                0+
              </h2>
              <p>Books Published</p>
            </div>
            <div className="counter-box">
              <h2 className="counter" data-target="10000">
                0+
              </h2>
              <p>Happy Readers</p>
            </div>
            <div className="counter-box">
              <h2 className="counter" data-target="12">
                0+
              </h2>
              <p>Awards</p>
            </div>
            <div className="counter-box">
              <h2 className="counter" data-target="54">
                0+
              </h2>
              <p>Literary Events</p>
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
