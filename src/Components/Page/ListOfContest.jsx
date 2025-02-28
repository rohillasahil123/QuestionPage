import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../helper/useContext";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const ListOfContests = () => {
  const { user } = useUser();
  const isAdmin = user?.role === "Admin";
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingContest, setEditingContest] = useState(null);
  const [editData, setEditData] = useState({});
  
  const [filterType, setFilterType] = useState(isAdmin?'Daily':'Teacher');

  const contestTypes = ["Teacher", "Weekly", "Mega", "Daily", "Monthly"];

  useEffect(() => {
    fetchContests();
  }, [filterType]); // Fetch contests whenever filterType changes

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/company/contest/getContest`, {
        params: { type: filterType || undefined }, // Send selected option
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      setContests(response.data.contests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contest) => {
    setEditingContest(contest);
    setEditData({ ...contest });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/contests/update/${editingContest._id}`,
        editData,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Contest updated successfully!");
        fetchContests(); // Refetch after update
        setEditingContest(null);
      } else {
        toast.error("Failed to update contest.");
      }
    } catch (error) {
      toast.error("Error updating contest.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    try {
      const response = await axios.delete(`${baseUrl}/contests/delete/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success("Contest deleted successfully!");
        fetchContests(); // Refetch after deletion
      } else {
        toast.error("Failed to delete contest.");
      }
    } catch (error) {
      toast.error("Error deleting contest.");
    }
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading contests...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto sm:p-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-3">List Of Contests</h2>

      {isAdmin && (
        <div className="mb-6">
          <select
            name="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-3 border-2 border-indigo-500 rounded-md font-semibold text-gray-700"
          >
            {contestTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contests.map((contest) => (
          <div key={contest._id} className="bg-white border-2 border-indigo-500 rounded-lg shadow-md p-4">
            {contest.key && (
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-indigo-700">Key: {contest.key}</h4>
                <button
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                  onClick={() => {
                    navigator.clipboard.writeText(contest.key);
                    toast.success("Key copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              </div>
            )}
            {(contest.joinAmount !== undefined || contest.amount !== undefined) && (
              <h4 className="text-xl font-bold text-indigo-700">Entry Fee: ₹{contest.joinAmount ?? contest.amount}</h4>
            )}
            {(contest.winningAmount !== undefined || contest.prizePoll !== undefined) && (
              <h4 className="text-xl font-bold text-indigo-700">
                Winning Amount: ₹{contest.winningAmount ?? contest.prizePoll}
              </h4>
            )}
            {contest.date && (
              <p className="text-gray-700">Date: {new Date(contest.date).toLocaleDateString()}</p>
            )}
            {(contest.combineId?.length > 0 || contest.participants?.length > 0) && (
                <p className="text-gray-700">
                  Participants: {contest.combineId?.length ?? contest.participants?.length}
                </p>
              )}
            {contest.maxParticipants !== undefined && (
              <p className="text-gray-700">Max Participants: {contest.maxParticipants}</p>
            )}
            {contest.isFull !== undefined && (
              <p className="text-gray-700">Is Full: {contest.isFull ? "Yes" : "No"}</p>
            )}
            <div className="flex justify-between mt-4">
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleEdit(contest)}>Edit</button>
              <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(contest._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingContest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Contest</h2>
            <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2" placeholder="Contest Name" />
            <select name="type" value={editData.type} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2">
              {contestTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
            </select>
            <input type="date" name="date" value={editData.date} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2" />
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSave}>Save</button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setEditingContest(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfContests;
