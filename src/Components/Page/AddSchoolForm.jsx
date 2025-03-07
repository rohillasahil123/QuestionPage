import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function AddSchoolForm({ isOpen }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    schoolName: '',
    principalName: '',
    board: '',
    phone: '',
    email: '',
    password: '',
    state: '',
    district: '',
    city: '',
  });

  // State for fetched location data
  const [locationData, setLocationData] = useState({
    states: [],
    districts: [],
    cities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

  // Fetch locations on mount
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
      const fetchedLocation = response.data || { states: [], districts: [], cities: [] };
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

  // Filter locations based on input
  const filteredStates = (locationData.states || []).filter((s) =>
    s.toLowerCase().includes(formData.state.toLowerCase().trim())
  );
  const filteredDistricts = (locationData.districts || []).filter((d) =>
    d.toLowerCase().includes(formData.district.toLowerCase().trim())
  );
  const filteredCities = (locationData.cities || []).filter((c) =>
    c.toLowerCase().includes(formData.city.toLowerCase().trim())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/company/school/addSchool`, formData, {
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
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300">
        <h2 className="text-lg font-semibold mb-3">Register New School/Institute</h2>
        {loading && <p>Loading location data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* School Name & Principal Name */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">School/Institute Name</label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Principal Name</label>
              <input
                type="text"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-full sm:w-1/2">
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
            </div>
          </div>

          {/* Phone & Email */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
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
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Register School
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSchoolForm;