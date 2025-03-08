import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../helper/useContext";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Static questions data (only available to Admins)
const staticQuestions = [
  {
    id: 1,
    questionText: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctOption: 2
  },
  {
    id: 2,
    questionText: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctOption: 1
  },
  {
    id: 3,
    questionText: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctOption: 1
  },
  {
    id: 4,
    questionText: "Who wrote Romeo and Juliet?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctOption: 1
  }
];

const teacherFixedValues = {
  prizeMoney: "1000",
  feeAmount: "10",
  numberOfQuestions: "1"
};

const AddContestForm = () => {
  const { user } = useUser();
  const isAdmin = user?.role === "Admin";
  const isTeacher = user?.role === "Teacher";
  const navigate = useNavigate();

  const initialFormData = {
    contestName: isAdmin ? 'Daily Contest' : 'Teacher Contest',
    contestType: isAdmin ? 'GK Contest' : 'Teacher Contest',
    prizeMoney: isTeacher ? teacherFixedValues.prizeMoney : '',
    feeAmount: isTeacher ? teacherFixedValues.feeAmount : '',
    startTime: '',
    numberOfQuestions: isTeacher ? teacherFixedValues.numberOfQuestions : '',
    // board: '',
    // class: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // For teachers: custom questions only; for admin, custom questions are added in addition to static ones.
  const [customQuestions, setCustomQuestions] = useState([]);
  const [customQuestionFormVisible, setCustomQuestionFormVisible] = useState(false);
  const [customQuestionData, setCustomQuestionData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Teachers cannot edit fixed fields
    if (isTeacher && (name === "prizeMoney" || name === "feeAmount" || name === "numberOfQuestions")) {
      return;
    }
    // When changing the number of questions (for non-teachers), clear previous selections
    if (name === "numberOfQuestions") {
      setSelectedQuestions([]);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle selection ensuring we don't exceed the allowed limit
  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions((prev) =>
        prev.filter((id) => id !== questionId)
      );
    } else {
      const limit = parseInt(formData.numberOfQuestions, 10);
      if (!isNaN(limit) && selectedQuestions.length < limit) {
        setSelectedQuestions((prev) => [...prev, questionId]);
      } else {
        toast.error(formData.numberOfQuestions ? `You can only select ${formData.numberOfQuestions || '0'} questions` : 'Add number of questions first');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const limit = parseInt(formData.numberOfQuestions, 10);
    if (isNaN(limit) || limit <= 0) {
      toast.error("Please enter a valid number of questions");
      return;
    }
    if (formData.contestType !== 'GK Contest' && selectedQuestions.length !== limit) {
      toast.error(`Please select exactly ${limit} questions`);
      return;
    }
    
    // Get complete details of selected questions
    const selectedQuestionObjects = availableQuestions.filter(q => selectedQuestions.includes(q.id));
    
    try {
      const payload = {
        ...formData,
        numberOfQuestions: limit,
        questions: selectedQuestionObjects,
      };
      
      console.log("Submitting contest with:", payload);
      const response = await axios.post(`${baseUrl}/company/contest/addContest`, payload, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      const result = response.data;
      const { success, message, error } = result;
      if (success) {
        toast.success(message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else if (error) {
        toast.error(error.details[0].message);
      } else {
        toast.error(message);
      }
      // toast.success("Contest created successfully!");
      // setTimeout(() => navigate('/dashboard'), 1000);
      
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Handlers for custom question form (only for teacher)
  const handleCustomQuestionChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "questionText") {
      setCustomQuestionData((prev) => ({
        ...prev,
        questionText: value,
      }));
    } else if (name.startsWith("option") && index !== null) {
      const newOptions = [...customQuestionData.options];
      newOptions[index] = value;
      setCustomQuestionData((prev) => ({
        ...prev,
        options: newOptions,
      }));
    }
  };

  const addCustomQuestion = () => {
    if (!customQuestionData.questionText.trim()) {
      toast.error("Question text is required");
      return;
    }
    for (let i = 0; i < customQuestionData.options.length; i++) {
      if (!customQuestionData.options[i].trim()) {
        toast.error(`Option ${i + 1} is required`);
        return;
      }
    }
    const newQuestion = {
      id: Date.now(), // generate a unique id
      ...customQuestionData,
    };
    setCustomQuestions((prev) => [...prev, newQuestion]);
    toggleQuestionSelection(newQuestion.id);
    setCustomQuestionData({
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0
    });
    setCustomQuestionFormVisible(false);
    toast.success("Custom question added");
  };

  // Remove a custom question (teacher only)
  const removeCustomQuestion = (questionId) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setSelectedQuestions((prev) => prev.filter((id) => id !== questionId));
    toast.success("Custom question removed");
  };

  // Define available questions based on role:
  // Teachers can only select their custom questions.
  // Admins can select from static questions and any custom questions.
  const availableQuestions = isTeacher ? customQuestions : [...staticQuestions, ...customQuestions];

  return (
    <div className="flex justify-center items-center w-full">
      <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300">
        {/* Header */}
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">
            Create <span className="text-blue-700">{formData.contestName}</span>
          </h2>
          {isAdmin && (
            <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between mb-4">
              <select
                name="contestType"
                value={formData.contestType}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md text-sm w-auto mr-5"
              >
                <option value="GK Contest">GK Contest</option>
                <option value="Syllabus Contest">Syllabus Contest</option>
              </select>
              <select
                name="contestName"
                value={formData.contestName}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md text-sm w-auto"
              >
                <option value="Daily Contest">Daily Contest</option>
                <option value="Weekly Contest">Weekly Contest</option>
                <option value="Monthly Contest">Monthly Contest</option>
                <option value="Mega Contest">Mega Contest</option>
              </select>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {(formData.contestType === 'Syllabus Contest' || isTeacher) && (
            <div className="flex flex-wrap -mx-2">
              {/* <div className="w-full sm:w-1/2 px-2 mb-3">
                <label className="block text-sm font-medium text-gray-700">Board</label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="HBSC">HBSC</option>
                  <option value="State Board">State Board</option>
                  <option value="Other">Other</option>
                </select>
              </div> */}

              {/* <div className="w-full sm:w-1/2 px-2 mb-3">
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select Class</option>
                  {[...Array(8)].map((_, i) => {
                    const grade = i + 3; // Start from 3rd class
                    return (
                      <option key={grade} value={grade === 3 ? '3rd' : `${grade}th`}>
                        {grade === 3 ? '3rd' : `${grade}th`} Class
                      </option>
                    );
                  })}
                </select>
              </div> */}
            </div>
          )}
          <div className="flex flex-wrap -mx-2">
            {/* Prize Money */}
            <div className="w-full sm:w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Prize Money</label>
              <input
                type="number"
                name="prizeMoney"
                value={formData.prizeMoney}
                onChange={handleChange}
                required
                disabled={isTeacher}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
            {/* Fee Amount */}
            <div className="w-full sm:w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Fee Amount</label>
              <input
                type="number"
                name="feeAmount"
                value={formData.feeAmount}
                onChange={handleChange}
                required
                disabled={isTeacher}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
            {/* Start Time */}
            <div className="w-full sm:w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            {/* Number of Questions */}
            <div className="w-full sm:w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
              <input
                type="number"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleChange}
                required
                disabled={isTeacher}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm bg-gray-100"
              />
            </div>
          </div>

          {(formData.contestType === 'Syllabus Contest' || isTeacher) && (
            <button
              type="button"
              onClick={() => setShowQuestionModal(true)}
              className="w-full bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300 mb-4"
            >
              Add Questions ({selectedQuestions.length} selected)
            </button>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-xl text-white py-2 px-4 rounded-md hover:bg-blue-500"
          >
            Submit
          </button>
        </form>

        {/* Question Selection Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[80vh] flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Select Questions</h3>
              <p className="mb-4 text-sm text-gray-700">
                Selected Questions: {selectedQuestions.length} / {formData.numberOfQuestions || 0}
              </p>
              
              <div className='overflow-scroll'>
                {/* For teachers, allow adding custom questions */}
                {(isTeacher || isAdmin) && (
                  <div className="mb-4">
                    {!customQuestionFormVisible ? (
                      <button
                        type="button"
                        onClick={() => setCustomQuestionFormVisible(true)}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                      >
                        Add Custom Question
                      </button>
                    ) : (
                      <div className="p-4 border rounded mb-4">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">Question Text</label>
                          <input
                            type="text"
                            name="questionText"
                            value={customQuestionData.questionText}
                            onChange={handleCustomQuestionChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">Options</label>
                          <div className="space-y-2">
                            {customQuestionData.options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  name={`option${index}`}
                                  value={option}
                                  onChange={(e) => handleCustomQuestionChange(e, index)}
                                  placeholder={`Option ${index + 1}`}
                                  className={`mt-1 p-2 flex-1 rounded-md text-sm ${
                                    customQuestionData.correctOption === index
                                      ? "border border-green-700 outline outline-2 outline-green-700 focus:ring-2 focus:ring-green-700 text-green-700"
                                      : "border border-gray-300"
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCustomQuestionData((prev) => ({
                                      ...prev,
                                      correctOption: index,
                                    }))
                                  }
                                  className={`mt-1 px-2 py-1 rounded-md text-sm ${
                                    customQuestionData.correctOption === index
                                      ? "bg-green-700 text-white"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {customQuestionData.correctOption === index ? "✔" : "Mark"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={addCustomQuestion}
                            className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
                          >
                            Save Question
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomQuestionFormVisible(false)}
                            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Display available questions based on role */}
                <div className="overflow-y-auto flex-grow">
                  {availableQuestions.length === 0 && isTeacher ? (
                    <p className="text-sm text-gray-600">
                      No custom questions available. Please add a custom question.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {availableQuestions.map((question) => (
                        <div
                          key={question.id}
                          onClick={() => !isTeacher && toggleQuestionSelection(question.id)}
                          className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${
                            selectedQuestions.includes(question.id) ? "bg-blue-50" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question.id)}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQuestionSelection(question.id);
                            }}
                            readOnly
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{question.questionText}</p>
                            <div className="mt-2 space-y-1">
                              {question.options.map((option, index) => (
                                <div key={index} className="text-sm flex items-center">
                                  {String.fromCharCode(65 + index)}. {option}
                                  {question.correctOption === index && (
                                    <span className="ml-2 text-green-500">✔️</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          {isTeacher && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomQuestion(question.id);
                              }}
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex flex-col md:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedQuestions([])}
                  className="w-full md:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Uncheck All
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="w-full md:w-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddContestForm;
