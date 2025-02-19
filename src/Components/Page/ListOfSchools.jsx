import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ListOfSchools = ({setSchoolId, setSchoolName, handleFormShow}) => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for editing a school
  const [editingSchool, setEditingSchool] = useState(null);
  const [editData, setEditData] = useState({});

  // States for filters and dropdown options
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    city: "",
  });

  const [options, setOptions] = useState({
    states: [],
    districts: [],
    cities: [],
  });

  // Fetch schools on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/company/school/getSchool`, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      const fetchedSchools = response.data.schools || [];
      setSchools(fetchedSchools);
      setFilteredSchools(fetchedSchools);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update states dropdown based on schools data
  useEffect(() => {
    const states = [...new Set(schools.map((school) => school.state))];
    setOptions((prev) => ({ ...prev, states }));
  }, [schools]);

  // Update districts based on selected state
  useEffect(() => {
    if (filters.state) {
      const stateSchools = schools.filter(
        (school) => school.state === filters.state
      );
      const districts = [
        ...new Set(stateSchools.map((school) => school.district)),
      ];
      setOptions((prev) => ({ ...prev, districts, cities: [] }));
      setFilters((prev) => ({ ...prev, district: "", city: "" }));
    } else {
      setOptions((prev) => ({ ...prev, districts: [], cities: [] }));
      setFilters((prev) => ({ ...prev, district: "", city: "" }));
    }
  }, [filters.state, schools]);

  // Update cities based on selected district
  useEffect(() => {
    if (filters.district) {
      const districtSchools = schools.filter(
        (school) =>
          school.state === filters.state &&
          school.district === filters.district
      );
      const cities = [
        ...new Set(districtSchools.map((school) => school.city)),
      ];
      setOptions((prev) => ({ ...prev, cities }));
      setFilters((prev) => ({ ...prev, city: "" }));
    } else {
      setOptions((prev) => ({ ...prev, cities: [] }));
      setFilters((prev) => ({ ...prev, city: "" }));
    }
  }, [filters.district, filters.state, schools]);

  // Apply filters to the school list
  useEffect(() => {
    let result = [...schools];
    if (filters.state)
      result = result.filter((school) => school.state === filters.state);
    if (filters.district)
      result = result.filter(
        (school) => school.district === filters.district
      );
    if (filters.city)
      result = result.filter((school) => school.city === filters.city);
    setFilteredSchools(result);
  }, [filters, schools]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit modal for a selected school
  const handleEdit = (school) => {
    setEditingSchool(school);
    setEditData({ ...school });
  };

  // Handle input change in the edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated school data
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/company/school/updateSchool/${editingSchool._id}`,
        editData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("School updated successfully!");
        setSchools((prev) =>
          prev.map((school) =>
            school._id === editingSchool._id
              ? { ...school, ...editData }
              : school
          )
        );
        setEditingSchool(null);
      } else {
        toast.error("Failed to update school.");
      }
    } catch (error) {
      toast.error("Error updating school.");
    }
  };

  // Delete a school
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?"))
      return;
    try {
      const response = await axios.delete(
        `${baseUrl}/company/school/deleteSchool/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("School deleted successfully!");
        setSchools((prev) => prev.filter((school) => school._id !== id));
      } else {
        toast.error("Failed to delete school.");
      }
    } catch (error) {
      toast.error("Error deleting school.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">
        Loading schools...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold">Error: {error}</p>
    );

  return (
    <div className="max-w-7xl mx-auto sm:p-4">
      {/* Page Heading */}
      <h2 className="text-2xl font-bold text-indigo-600 mb-3">
        List Of Schools
      </h2>

      {/* Filter Controls */}
      <div className="school-filter space-y-6 mb-6">
        <div className="filter-controls grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md border border-indigo-300">
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
        </div>
      </div>

      {/* School Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredSchools.map((school) => (
          <div
            key={school._id}
            className="bg-white border-2 border-indigo-500 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300"
          >
            {/* Card Header */}
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500">
              <h4 className="text-2xl font-bold text-white">
                {school.schoolName}
              </h4>
            </div>
            <div className="p-4">
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Principal:</span>{" "}
                {school.principalName}
              </p>
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Email:</span> {school.email}
              </p>
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Phone:</span> {school.phone}
              </p>
              <p className="text-base text-gray-800 mb-2">
                <span className="font-semibold">Location:</span>{" "}
                {school.city}, {school.district}, {school.state}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEdit(school)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setSchoolId(school._id)
                    setSchoolName(school.schoolName)
                    handleFormShow('addTeacher')
                  }}
                >
                  Add Teacher
                </button>
                <button
                  className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600"
                  onClick={() => {
                    setSchoolId(school._id)
                    setSchoolName(school.schoolName)
                    handleFormShow('listOfTeachers')
                  }}
                >
                  Show Teacher
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(school._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit School</h2>
            <input
              type="text"
              name="schoolName"
              value={editData.schoolName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="School Name"
            />
            <input
              type="text"
              name="principalName"
              value={editData.principalName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Principal Name"
            />
            <input
              type="text"
              name="phone"
              value={editData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Phone"
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
              name="city"
              value={editData.city}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="City"
            />
            <input
              type="text"
              name="district"
              value={editData.district}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="District"
            />
            <input
              type="text"
              name="state"
              value={editData.state}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="State"
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
                onClick={() => setEditingSchool(null)}
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

export default ListOfSchools;
