import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const AddContestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contestName: '',
    numberOfQuestions: '',
    prizeMoney: '',
    feeAmount: '',
    startTime: '',
    duration: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/contests/add`, formData, {
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
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300">
        <h2 className="text-lg font-semibold mb-3">Create a New Contest</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Contest Name</label>
              <input
                type="text"
                name="contestName"
                value={formData.contestName}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
              <input
                type="number"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Prize Money</label>
              <input
                type="number"
                name="prizeMoney"
                value={formData.prizeMoney}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Fee Amount</label>
              <input
                type="number"
                name="feeAmount"
                value={formData.feeAmount}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
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
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="datetime-local"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-xl text-white py-2 px-4 rounded-md hover:bg-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddContestForm;
