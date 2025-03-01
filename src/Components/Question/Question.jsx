import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "../Select/Select";
import Modal from 'react-bootstrap/Modal';
import './Question.css'

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Question = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");

    try {
      const response = await axios.post(`${baseUrl}/addquestiongk`, {
        question,
        correctAnswer,
        options,
      });
      if(response) setShowModal(true);
      console.log(response.data);
      toast.success("Question saved to database");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      console.error(
        "Error adding question:",
        error.response?.data?.message || error.message
      );
    }
  };



  return (
    <div className="min-h-screen w-full flex justify-center mt-9 p-4 sm:p-8">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[80%] bg-white rounded-2xl border text-center items-center justify-center p-4 sm:p-8">
        <div className="h-[50px] w-full shadow-xl text-center items-center flex justify-between mb-6 rounded-2xl">
          <div className="bg-indigo-900 text-white w-[80px] sm:w-[150px] h-6 sm:h-9 rounded-xl ml-4 cursor-pointer transform scale-110 animate-pulse">
            <h1 className="font-bold text-sm  sm:text-2xl">GoQuizy</h1>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              <span className="text-green-600">Gk</span>{" "}
              <span className="text-red-600">Question</span>
            </h1>
          </div>
          <div className=" sm:mr-[3%]">
            <Select />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter Question ?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="h-[40px] border font-semibold w-full sm:w-[70%] rounded-lg mb-4 p-2  shadow-lg"
          />
          <div className="flex flex-wrap w-full items-center justify-center">
            <div className="space-y-6 w-full sm:w-[50%]">
              {options.map((option, index) => (
                <div className="flex justify-center" key={index}>
                  <input
                    type="text"
                    placeholder={`Enter Option ${String.fromCharCode(97 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-[90%] sm:w-full h-10 rounded-md font-bold p-2 border shadow-lg "
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full sm:w-[200px] rounded-xl h-9 text-white font-bold bg-red-700"
              >
                Add Question
              </button>
            </div>
            <div className="w-full sm:w-[50%]">
              <input
                type="text"
                placeholder="Enter correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-[90%] sm:w-[50%] h-10 rounded-md font-bold p-2 mt-6 border shadow-lg"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Modal Component */}
      {showModal && <PopUpModal passShowModal={showModal} passSetShowModal={setShowModal} />}
    </div>
  );
};

export default Question;



function PopUpModal({ passShowModal, passSetShowModal }) {
  const handleClose = () => passSetShowModal(false);

  return (
    <div>
      <Modal
        show={passShowModal}
        onHide={handleClose}
        aria-labelledby="download-modal"
        centered
        enforceFocus={false}
        keyboard={true}
      >
        <Modal.Header closeButton style={{ backgroundColor: '#ffffff', color: 'black', height: '60px' }}>
          <Modal.Title id="download-modal" style={{ color: 'black', textAlign: 'center' }}>
            <div className="modal-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ margin: '0 10px', fontSize: '20px', fontWeight: 'bold' }}>Question Added</span>
              <img
                style={{ width: '50px', height: '50px' }}
                src="https://cdn-icons-png.flaticon.com/128/2954/2954893.png"
                alt="App Icon"
              />
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            backgroundColor: '#01091b',
            color: 'white',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: "16px", marginBottom: "20px", lineHeight: "1.5" }}>
            Your question has been successfully added. Thank you
            for your contribution to Go Quizzy! 🌟
          </p>
          <p style={{ fontSize: "12px", color: "#ccc" }}>
            *Feel free to add more questions to make our quizzes even better!
          </p>
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: '#01091b', color: 'white', justifyContent: 'center' }}>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}