import React, { useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

const Question = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setQuestion("")
    setOptions(["", "", "", ""])
    setCorrectAnswer("")

    try {
      const response = await axios.post("http://3.108.59.193/addquestiongk", {
        question,
        correctAnswer,
        options
      });
      console.log(response.data);
      toast.success("Question saved to database"); // Display success message

    } catch (error) {
      console.error("Error adding question:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center mt-9 p-4 sm:p-8">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[80%] bg-teal-100 rounded-2xl border text-center items-center justify-center  p-4 sm:p-8">
        <div className="h-[50px] w-full shadow-xl text-center items-center flex justify-between mb-6 ">
          <div className="bg-indigo-900 text-white w-[120px] sm:w-[150px] h-9 rounded-xl ml-4 cursor-pointer transform scale-110 animate-pulse">
            <h1 className="font-bold text-lg sm:text-2xl">GoQuizy</h1>
          </div>
            <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Add <span className="text-green-600">Gk</span> <span className="text-red-600">Question</span>
          </h1>
          </div>
          <div></div>
        </div>
       
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter Question ?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="h-[40px] border font-semibold w-full sm:w-[70%] rounded-lg mb-4 p-2"
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
                    className="w-[90%] sm:w-full h-10 rounded-md font-bold p-2"
                  />
                </div>
              ))}
              <button type="submit" className="w-full sm:w-[200px] rounded-xl h-9 text-white font-bold bg-red-700">
                Add Question
              </button>
            </div>
            <div className="w-full sm:w-[50%]">
              <input
                type="text"
                placeholder="Enter correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-[90%] sm:w-[50%] h-10 rounded-md font-bold p-2 mt-6"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Question;
