import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function AddShoppingPartnerForm({ isOpen }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: '',
    phoneNumber: '',
    email: '',
    shopName: '',
    category: '',
    state: '',
    district: '',
    city: '',
    localAddress: '',
  });

  // Sample option for shop category
  const categories = ['Grocery', 'Clothing', 'Electronics', 'Other'];

  // State for fetched location data
  const [locationData, setLocationData] = useState({
    states: [],
    districts: [],
    cities: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Assuming the API returns an object with keys: states, districts, cities
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

  // Filter locations based on input (ignoring spaces and case)
  const filteredStates = (locationData.states || []).filter((s) => {
    const normalizedInput = formData.state.replace(/\s+/g, '').toLowerCase();
    const normalizedState = s.replace(/\s+/g, '').toLowerCase();
    if (!normalizedInput) return false;
    return normalizedState.includes(normalizedInput);
  });

  const filteredDistricts = (locationData.districts || []).filter((d) => {
    const normalizedInput = formData.district.replace(/\s+/g, '').toLowerCase();
    const normalizedDistrict = d.replace(/\s+/g, '').toLowerCase();
    if (!normalizedInput) return false;
    return normalizedDistrict.includes(normalizedInput);
  });

  const filteredCities = (locationData.cities || []).filter((c) => {
    const normalizedInput = formData.city.replace(/\s+/g, '').toLowerCase();
    const normalizedCity = c.replace(/\s+/g, '').toLowerCase();
    if (!normalizedInput) return false;
    return normalizedCity.includes(normalizedInput);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/company/shop/addShoppingPartner`, formData, {
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
        const details = error?.details[0].message;
        toast.error(details);
      } else if (!success) {
        toast.error(message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    }
    console.log('Form submitted with data: ', formData);
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300">
        <h2 className="text-lg font-semibold mb-3">Create New Shopping Partner</h2>
        {loading && <p>Loading location data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Owner Name & Phone Number */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Email & Shop Name */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Shop Category & State */}
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Shop Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select Shop Type</option>
                {categories.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {/* State Input with Suggestions */}
            <div className="w-full md:w-1/2 relative">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
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
                    const valid = (locationData.states || []).some(
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

          {/* District & City */}
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
                    const valid = (locationData.districts || []).some(
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
                    const valid = (locationData.cities || []).some(
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

          {/* Local Address */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Local Address</label>
            <textarea
              name="localAddress"
              value={formData.localAddress}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
            ></textarea>
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
}

export default AddShoppingPartnerForm;
