import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function MemberInfoPopup({ id, onClose }) {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(`http://3.108.59.193/company/getMemberDetails/${id}`, {
            withCredentials: true,
            validateStatus: (status) => status < 500,
        });
        if(response.data.success) toast.success(response.data.message);
        
        setMemberData(response.data.userDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemberData();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Member Details</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : memberData ? (
          <div className="space-y-2">
            {Object.entries(memberData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                <p className="text-gray-500">{key}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No details available.</p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default MemberInfoPopup;
