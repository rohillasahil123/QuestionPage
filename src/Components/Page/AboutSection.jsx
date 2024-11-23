import React, { useEffect, useRef, useState } from "react";
import "./AboutSection.css";

const AboutSection = () => {
  const sectionRef = useRef(null); // Reference to the About Me section
  const [startCounting, setStartCounting] = useState(false); // Control when counting starts

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
    <div ref={sectionRef} className="about-me-section">
      <h1>About Me</h1>
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
  );
};

export default AboutSection;
