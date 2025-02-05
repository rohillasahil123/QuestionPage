import React, { useState } from 'react';

function AddShoppingPartnerForm({ isOpen }) {
  const [formData, setFormData] = useState({
    ownerName: '',
    phoneNumber: '',
    shopName: '',
    shopType: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    localAddress: '',
  });

  const shopTypes = ['Grocery', 'Clothing', 'Electronics', 'Other'];
  const states = ['State 1', 'State 2', 'State 3'];
  const districts = ['District 1', 'District 2', 'District 3'];
  const cities = ['City 1', 'City 2', 'City 3'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="popup-form bg-white p-4 rounded-lg shadow-lg w-full h-auto overflow-y-auto border border-gray-300 ">
        <h2 className="text-lg font-semibold mb-3">Create New Shopping Partner</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm" />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Shop Type</label>
              <select name="shopType" value={formData.shopType} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm">
                <option value="">Select Shop Type</option>
                {shopTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select name="state" value={formData.state} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm">
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="w-full md:w-1/2">
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
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
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Local Address</label>
            <textarea name="localAddress" value={formData.localAddress} onChange={handleChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"></textarea>
          </div>
            <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddShoppingPartnerForm;
