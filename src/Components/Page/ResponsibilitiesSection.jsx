import React, { useState } from 'react'
import './ResponsibilitiesSection.css'

function ResponsibilitiesSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleHeight = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle between opening and closing the current div
    };
    return (
        <>        
        <div className="infoSection">
        <hr/>
            <h1>Responsibilities</h1>
            <div className="p-4">

                <div className="accordion">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="accordion-item">
                            <button
                                className="accordion-button"
                                style={{ color: '#012141' }}
                                onClick={() => toggleHeight(index)}
                            >
                                Accordion Item #{index + 1}
                            </button>
                            <div
                                className={`accordion-body ${openIndex === index ? "expand" : ""}`}
                            >
                                <p>
                                    This is the body text of accordion item #{index + 1}. It will
                                    expand and collapse smoothly when clicked.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default ResponsibilitiesSection
