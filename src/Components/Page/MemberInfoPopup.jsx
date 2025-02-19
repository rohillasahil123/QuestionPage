import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function MemberInfoPopup({ id, onClose }) {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/company/franchise/getMemberDetails/${id}`, {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        });

        if (response.data.success) toast.success(response.data.message);

        setMemberData(response.data.userDetails);
        setEditedData(response.data.userDetails); // Initialize editable data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemberData();
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  // Save updated details
  const handleSave = async () => {
    try {
      const response = await axios.put(`${baseUrl}/company/franchise/updateMember/${id}`, editedData, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      if (response.data.success) {
        toast.success("Member details updated successfully!");
        setMemberData(editedData);
        setIsEditing(false);
      } else {
        toast.error("Failed to update member details.");
      }
    } catch (err) {
      toast.error("Error updating member details.");
    }
  };

  // Delete member
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      const response = await axios.delete(`${baseUrl}/company/franchise/deleteMember/${id}`, {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      if (response.data.success) {
        toast.success("Partner deleted successfully!");
        onClose(); // Close the popup after deleting
      } else {
        toast.error("Failed to delete the partner.");
      }
    } catch (err) {
      toast.error("Error deleting partner.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Member Details</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : memberData ? (
          <div className="space-y-2">
            {Object.entries(editedData).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <p className="text-gray-500">{key}</p>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-40"
                  />
                ) : (
                  <p>{value}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No details available.</p>
        )}

        <div className="mt-4 flex justify-between">
          {isEditing ? (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}

          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>

          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemberInfoPopup;
