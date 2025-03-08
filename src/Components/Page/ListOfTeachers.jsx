import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ListOfTeachers = ({ schoolId }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/company/teacher/getTeacher/${schoolId}`,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      setTeachers(response.data.teachers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setEditData({ ...teacher });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/company/teacher/updateTeacher/${schoolId}/${editingTeacher._id}`,
        editData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Teacher updated successfully!");
        setTeachers((prev) =>
          prev.map((t) =>
            t._id === editingTeacher._id ? { ...t, ...editData } : t
          )
        );
        setEditingTeacher(null);
      } else {
        toast.error("Failed to update teacher.");
      }
    } catch (error) {
      toast.error("Error updating teacher.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      const response = await axios.delete(
        `${baseUrl}/company/teacher/deleteTeacher/${schoolId}/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Teacher deleted successfully!");
        setTeachers((prev) => prev.filter((t) => t._id !== id));
      } else {
        toast.error("Failed to delete teacher.");
      }
    } catch (error) {
      toast.error("Error deleting teacher.");
    }
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading teachers...</p>;
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold">Error: {error}</p>
    );

  return (
    <div className="max-w-7xl mx-auto sm:p-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">
        List of Teachers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher._id}
            className="bg-white border-2 border-indigo-500 rounded-lg shadow-md p-4"
          >
            <h4 className="text-xl font-bold text-indigo-600">{teacher.name}</h4>
            <p className="text-gray-800">
              <span className="font-semibold">Class:</span> {teacher.class}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Subject:</span> {teacher.subject}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Email:</span> {teacher.email}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Phone:</span> {teacher.phone}
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleEdit(teacher)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(teacher._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className="w-full p-2 border mb-2"
            />
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleInputChange}
              className="w-full p-2 border mb-2"
            />
            <input
              type="number"
              name="phone"
              value={editData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="class"
              value={editData.class}
              onChange={handleInputChange}
              className="w-full p-2 border mb-2"
            />
            <input
              type="text"
              name="subject"
              value={editData.subject}
              onChange={handleInputChange}
              className="w-full p-2 border mb-2"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
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

export default ListOfTeachers;