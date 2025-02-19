import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ListOfShops = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for editing shop
  const [editingShop, setEditingShop] = useState(null);
  const [editData, setEditData] = useState({});

  // States for filter and dropdown options
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    city: "",
    category: "",
  });

  const [options, setOptions] = useState({
    states: [],
    districts: [],
    cities: [],
    categories: [],
  });

  // Fetch shops on mount
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/company/shop/getShoppingPartner`,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      const fetchedShops = response.data.shops || [];
      setShops(fetchedShops);
      // Initially, filtered shops should show all shops
      setFilteredShops(fetchedShops);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the "states" dropdown when shops change
  useEffect(() => {
    const states = [...new Set(shops.map((shop) => shop.state))];
    setOptions((prev) => ({ ...prev, states }));
  }, [shops]);

  // Update districts based on selected state
  useEffect(() => {
    if (filters.state) {
      const stateShops = shops.filter(
        (shop) => shop.state === filters.state
      );
      const districts = [...new Set(stateShops.map((shop) => shop.district))];
      setOptions((prev) => ({ ...prev, districts, cities: [], categories: [] }));
      setFilters((prev) => ({ ...prev, district: "", city: "", category: "" }));
    } else {
      // Reset districts if no state selected
      setOptions((prev) => ({ ...prev, districts: [], cities: [], categories: [] }));
      setFilters((prev) => ({ ...prev, district: "", city: "", category: "" }));
    }
  }, [filters.state, shops]);

  // Update cities based on selected district
  useEffect(() => {
    if (filters.district) {
      const districtShops = shops.filter(
        (shop) =>
          shop.state === filters.state && shop.district === filters.district
      );
      const cities = [...new Set(districtShops.map((shop) => shop.city))];
      setOptions((prev) => ({ ...prev, cities, categories: [] }));
      setFilters((prev) => ({ ...prev, city: "", category: "" }));
    } else {
      setOptions((prev) => ({ ...prev, cities: [], categories: [] }));
      setFilters((prev) => ({ ...prev, city: "", category: "" }));
    }
  }, [filters.district, filters.state, shops]);

  // Update categories based on selected city
  useEffect(() => {
    if (filters.city) {
      const cityShops = shops.filter(
        (shop) =>
          shop.state === filters.state &&
          shop.district === filters.district &&
          shop.city === filters.city
      );
      const categories = [...new Set(cityShops.map((shop) => shop.category))];
      setOptions((prev) => ({ ...prev, categories }));
      setFilters((prev) => ({ ...prev, category: "" }));
    } else {
      setOptions((prev) => ({ ...prev, categories: [] }));
      setFilters((prev) => ({ ...prev, category: "" }));
    }
  }, [filters.city, filters.district, filters.state, shops]);

  // Apply filters to the shop list
  useEffect(() => {
    let result = [...shops];
    if (filters.state)
      result = result.filter((shop) => shop.state === filters.state);
    if (filters.district)
      result = result.filter((shop) => shop.district === filters.district);
    if (filters.city)
      result = result.filter((shop) => shop.city === filters.city);
    if (filters.category)
      result = result.filter((shop) => shop.category === filters.category);
    setFilteredShops(result);
  }, [filters, shops]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Open Edit Modal
  const handleEdit = (shop) => {
    setEditingShop(shop);
    setEditData({ ...shop });
  };

  // Handle input change for edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Edited Shop
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/company/shop/updateShoppingPartner/${editingShop._id}`,
        editData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Shop updated successfully!");
        setShops((prev) =>
          prev.map((shop) =>
            shop._id === editingShop._id ? { ...shop, ...editData } : shop
          )
        );
        setEditingShop(null);
      } else {
        toast.error("Failed to update shop.");
      }
    } catch (error) {
      toast.error("Error updating shop.");
    }
  };

  // Delete Shop
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shop?")) return;

    try {
      const response = await axios.delete(
        `${baseUrl}/company/shop/deleteShoppingPartner/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Shop deleted successfully!");
        setShops((prev) => prev.filter((shop) => shop._id !== id));
      } else {
        toast.error("Failed to delete shop.");
      }
    } catch (error) {
      toast.error("Error deleting shop.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">
        Loading shops...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold">
        Error: {error}
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto sm:p-4">
      {/* Page Heading */}
      <h2 className="text-2xl font-bold text-indigo-600 mb-3">
        List Of Shops
      </h2>

      {/* Filter Controls */}
      <div className="shop-filter space-y-6 mb-6">
        <div className="filter-controls grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-md border border-indigo-300">
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="w-full p-3 border-2 border-indigo-500 rounded-md font-semibold text-gray-700"
          >
            <option value="">Select State</option>
            {options.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
            disabled={!filters.state}
            className="w-full p-3 border-2 border-indigo-500 rounded-md font-semibold text-gray-700"
          >
            <option value="">Select District</option>
            {options.districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            disabled={!filters.district}
            className="w-full p-3 border-2 border-indigo-500 rounded-md font-semibold text-gray-700"
          >
            <option value="">Select City</option>
            {options.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            disabled={!filters.city}
            className="w-full p-3 border-2 border-indigo-500 rounded-md font-semibold text-gray-700"
          >
            <option value="">All Categories</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <div
            key={shop._id}
            className="bg-white border-2 border-indigo-500 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300"
          >
            {/* Shop Card Header with Gradient */}
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500">
              <h4 className="text-2xl font-bold text-white">{shop.shopName}</h4>
            </div>
            <div className="p-4">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 bg-yellow-300 text-yellow-900 font-bold text-sm rounded-full mb-4">
                {shop.category}
              </span>
              {/* Shop Details */}
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Location:</span> {shop.city},{" "}
                {shop.district}, {shop.state}
              </p>
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Local Address:</span>{" "}
                {shop.localAddress}
              </p>
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Owner:</span> {shop.ownerName}
              </p>
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Email:</span> {shop.email}
              </p>
              <p className="text-base text-gray-800">
                <span className="font-semibold">Phone:</span> {shop.phoneNumber}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEdit(shop)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(shop._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Shop</h2>
            <input
              type="text"
              name="shopName"
              value={editData.shopName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Shop Name"
            />
            <input
              type="text"
              name="ownerName"
              value={editData.ownerName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Owner Name"
            />
            <input
              type="text"
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Phone Number"
            />
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Email"
            />
            <input
              type="text"
              name="category"
              value={editData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Category"
            />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setEditingShop(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfShops;
