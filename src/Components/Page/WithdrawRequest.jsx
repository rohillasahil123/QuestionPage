import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const WithdrawRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/company/withdraw/getAllRequests`,
        { withCredentials: true }
      );
      // Update this to match your response structure
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, transactionId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this request?"
    );
    if (!confirmApprove) return;

    try {
      const response = await axios.put(
        `${baseUrl}/company/withdraw/updateRequest/${id}`,
        { status: "approved", transactionId: transactionId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Request approved!");
        // Remove the approved request from the list
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        toast.error("Failed to approve request.");
      }
    } catch (error) {
      toast.error("Error approving request.");
    }
  };

  const handleReject = async (id, transactionId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (!confirmReject) return;

    try {
      const response = await axios.put(
        `${baseUrl}/company/withdraw/updateRequest/${id}`,
        { status: "rejected", transactionId: transactionId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Request rejected!");
        // Remove the rejected request from the list
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        toast.error("Failed to reject request.");
      }
    } catch (error) {
      toast.error("Error rejecting request.");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading)
    return (
      <p className="text-center text-lg font-semibold">
        Loading withdrawal requests...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold">Error: {error}</p>
    );

  return (
    <div className="max-w-7xl mx-auto sm:p-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-3">
        Withdrawal Requests
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white border-2 border-indigo-500 rounded-lg shadow-md p-4"
          >
            <h4 className="text-xl font-bold text-indigo-600">
              Request from {req.fullname}
            </h4>
            <p className="text-gray-800 flex items-center">
              <span className="font-semibold">Account:</span>{" "}
              <span className="ml-1">{req.accountNumber}</span>
              <button
                onClick={() => handleCopy(req.accountNumber)}
                className="ml-2 text-blue-700 font-bold rounded text-sm"
              >
                Copy
              </button>
            </p>
            <p className="text-gray-800 flex items-center">
              <span className="font-semibold">IFSC:</span>{" "}
              <span className="ml-1">{req.ifsc}</span>
              <button
                onClick={() => handleCopy(req.ifsc)}
                className="ml-2 text-blue-700 font-bold rounded text-sm"
              >
                Copy
              </button>
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Amount:</span> {req.amount}
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleApprove(req._id, req.transactionId)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(req._id, req.transactionId)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawRequest;
