import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const AddMemberForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    state: '',
    district: '',
    city: '',
  });

  // Sample options for select boxes
  const roles = ['State Franchise', 'District Franchise', 'City Franchise', 'Marketing Manager', 'School', 'Teacher'];
  const states = ['Haryana', 'Rajesthan', 'Punjab'];
  const districts = ['Hisar', 'Jind', 'Hansi'];
  const cities = ['Hisar', 'Agraha', 'Barwala']; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("🚀 ~ e:", e)
    try {
      const response = await axios.post( "http://3.108.59.193/company/addNewMember", formData, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
    } );
      const result = response.data;
      const { success, message, user, error } = result;
      if(success){
        toast.success(message);
        setTimeout(()=>{
          navigate('/dashboard')
        , 100})
      } else if(error){
        const details = error?.details[0].message;
        toast.error(details);
      } else if(!success){
        toast.error(message);
      }
  } catch (error) {
    console.error("Unexpected error during login:", error);
    toast.error("Something went wrong. Please try again.");
  }
    console.log('Form submitted with data: ', formData);
  };

  return (
    <div className=" flex justify-center items-center w-full">
  <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300 ">
    <h2 className="text-lg font-semibold mb-3">Create New Member</h2>
    <form onSubmit={handleSubmit}>
      {/* Name and Phone Number */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="w-full md:w-1/2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Email and Password */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="w-full md:w-1/2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
      </div>

      {/* Gender and Date of Birth */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="w-full md:w-1/2">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Role and State */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="w-full md:w-1/2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* District and City */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <div className="w-full md:w-1/2">
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">
            District
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-500"
      >
        Submit
      </button>
    </form>
  </div>
</div>
  );
};

export default AddMemberForm;
