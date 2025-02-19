import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const AddTeacherForm = ({schoolId, schoolName}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    class: '',
    subject: '',
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
      const response = await axios.post(`${baseUrl}/company/teacher/addTeacher/${schoolId}`, formData, {
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
        <h2 className="text-lg font-semibold mb-3">Create Teacher for {schoolName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Teacher Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-1/2 px-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
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

export default AddTeacherForm;
