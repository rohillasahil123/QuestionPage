import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../helper/useContext';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const AddMemberForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    state: '',
    district: '',
    city: '',
    gender: '',
    dob: '',
  });

  const roleHierarchy = {
    Admin: [
      "State Franchise",
      "District Franchise",
      "City Franchise",
      "Marketing Manager",
    ],
    "State Franchise": [
      "District Franchise",
      "City Franchise",
      "Marketing Manager",
    ],
    "District Franchise": ["City Franchise", "Marketing Manager"],
    "City Franchise": ["Marketing Manager"],
    "Marketing Manager": [],
  };

  // Dynamically set role options based on the user's role
  const availableRoles = roleHierarchy[user?.role] || [];
  
  // Fetch location data on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/company/locations`, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      // Assuming the API returns an object with keys: states, districts, cities
      const fetchedLocation = response.data || {};
      setLocationData(fetchedLocation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Local states for suggestion visibility
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Filter arrays based on input (using locationData)
  const filteredStates = (locationData?.states || []).filter((s) => {
    const normalizedInput = formData.state.replace(/\s+/g, '').toLowerCase();
    const normalizedState = s.replace(/\s+/g, '').toLowerCase();
    if (!normalizedInput) return false;
    return normalizedState.includes(normalizedInput);
  });

  const filteredDistricts = (locationData?.districts || []).filter((d) => {
    const normalizedInput = formData.district.replace(/\s+/g, '').toLowerCase();
    const normalizedDistrict = d.replace(/\s+/g, '').toLowerCase();
    if (!normalizedInput) return false;
    return normalizedDistrict.includes(normalizedInput);
  });

  const filteredCities = (locationData?.cities || []).filter((c) => {
    const normalizedInput = formData.city.replace(/\s+/g, '').toLowerCase();
    const normalizedCity = c.replace(/\s+/g, '').toLowerCase();
    if (!normalizedInput) return false;
    return normalizedCity.includes(normalizedInput);
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
      const response = await axios.post(`${baseUrl}/company/franchise/addNewMember`, formData, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      const result = response.data;
      const { success, message, error } = result;
      if(success){
        toast.success(message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
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
    <div className="flex justify-center items-center w-full">
      <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300">
        <h2 className="text-lg font-semibold mb-3">Create New Member</h2>
        {loading && <p>Loading location data...</p>}
        {error && <p className="text-red-500">{error}</p>}
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
                {availableRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {/* State Input with Suggestions */}
            <div className="w-full md:w-1/2 relative">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={(e) => {
                  handleChange(e);
                  setShowStateSuggestions(true);
                }}
                onFocus={() => setShowStateSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowStateSuggestions(false);
                    const valid = (locationData?.states || []).some(
                      (s) => s.toLowerCase() === formData.state.trim().toLowerCase()
                    );
                    if (!valid) {
                      setFormData((prev) => ({ ...prev, state: '' }));
                    }
                  }, 100);
                }}
                placeholder="Search state"
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
              {showStateSuggestions && formData.state && filteredStates.length > 0 && (
                <ul
                  className="absolute left-0 right-0 bg-white border border-gray-300 z-10 list-none p-0 m-0"
                  style={{ maxHeight: '175px', overflowY: 'auto' }}
                >
                  {filteredStates.map((s) => (
                    <li
                      key={s}
                      onMouseDown={() => {
                        setFormData({ ...formData, state: s });
                        setShowStateSuggestions(false);
                      }}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      style={{ height: '35px', display: 'flex', alignItems: 'center' }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* District and City */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            {/* District Input with Suggestions */}
            <div className="w-full md:w-1/2 relative">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={(e) => {
                  handleChange(e);
                  setShowDistrictSuggestions(true);
                }}
                onFocus={() => setShowDistrictSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowDistrictSuggestions(false);
                    const valid = (locationData?.districts || []).some(
                      (d) => d.toLowerCase() === formData.district.trim().toLowerCase()
                    );
                    if (!valid) {
                      setFormData((prev) => ({ ...prev, district: '' }));
                    }
                  }, 100);
                }}
                placeholder="Search district"
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
              {showDistrictSuggestions && formData.district && filteredDistricts.length > 0 && (
                <ul
                  className="absolute left-0 right-0 bg-white border border-gray-300 z-10 list-none p-0 m-0"
                  style={{ maxHeight: '175px', overflowY: 'auto' }}
                >
                  {filteredDistricts.map((d) => (
                    <li
                      key={d}
                      onMouseDown={() => {
                        setFormData({ ...formData, district: d });
                        setShowDistrictSuggestions(false);
                      }}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      style={{ height: '35px', display: 'flex', alignItems: 'center' }}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* City Input with Suggestions */}
            <div className="w-full md:w-1/2 relative">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => {
                  handleChange(e);
                  setShowCitySuggestions(true);
                }}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowCitySuggestions(false);
                    const valid = (locationData?.cities || []).some(
                      (c) => c.toLowerCase() === formData.city.trim().toLowerCase()
                    );
                    if (!valid) {
                      setFormData((prev) => ({ ...prev, city: '' }));
                    }
                  }, 100);
                }}
                placeholder="Search city"
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
              {showCitySuggestions && formData.city && filteredCities.length > 0 && (
                <ul
                  className="absolute left-0 right-0 bg-white border border-gray-300 z-10 list-none p-0 m-0"
                  style={{ maxHeight: '175px', overflowY: 'auto' }}
                >
                  {filteredCities.map((c) => (
                    <li
                      key={c}
                      onMouseDown={() => {
                        setFormData({ ...formData, city: c });
                        setShowCitySuggestions(false);
                      }}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      style={{ height: '35px', display: 'flex', alignItems: 'center' }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
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

export default AddMemberForm;
