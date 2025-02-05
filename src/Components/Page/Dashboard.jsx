import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { FaChevronRight, FaSpinner, FaEye } from 'react-icons/fa';
import AddMemberForm from './AddMemberForm';
import AddShoppingPartnerForm from './AddShoppingPartnerForm';
import MemberInfoPopup from './MemberInfoPopup';
import toast from 'react-hot-toast';
import { useUser } from "../../helper/useContext";

const Dashboard = () => {
  const {user} = useUser();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('Franchise');
  const [activeForm, setActiveForm] = useState('member');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const scrollToFormRef = useRef(null);
  
  const companyData = [
    {
      name: user?.role ,
      level: 'user?.role',
      children: [],
      isFetched: false, 
    },
  ];

  const getFranchiseDetails = async (type, id) => {
    let payload = { role: type, id: id };
    const response = await axios.post(`http://3.108.59.193/company/getFranchiseDetails`, payload, {
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
  
    // if (response.data.success) toast.success(response.data.message);
  
    const levelMap = {
      'State Franchise': 'state',
      'District Franchise': 'district',
      'City Franchise': 'city',
      'School Franchise': 'school',
    };
    const mappedLevel = levelMap[type] || 'student';
    
    if (!response?.data?.users) return [];
    return response.data.users.map(user => ({
      name: user.name,
      level: user.role,
      id: user._id,
      region: user.region
    }));
  };

  const fetchStudents = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { name: 'Student 1', level: 'student', id: 1 },
      { name: 'Student 2', level: 'student', id: 2 },
    ];
  };

  useEffect(() => {
    setData(companyData);
    setIsLoading(false);
    
  }, []);

  const fetchChildren = async (node, level) => {
    switch (level) {
      case 'company':
        return getFranchiseDetails('State Franchise');
      case 'State Franchise':
        return getFranchiseDetails('District Franchise', node.id);
      case 'district':
        return getFranchiseDetails('City Franchise');
      case 'city':
        return getFranchiseDetails('School Franchise');
      case 'school':
        return fetchStudents();
      default:
        return [];
    }
  };

  const handleViewDetails = (id) => {
    setSelectedMember(id);
    setShowInfoPopup(true);
  };

  const handleFormShow = (formType) => {
    setActiveForm(formType);
    setTimeout(() => {  // Wait for re-render before scrolling
      scrollToFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100); 
  };

  const TreeNode = ({ node, level }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [children, setChildren] = useState(node.children || []);
    const [isLoading, setIsLoading] = useState(false);
    const [childrenFetched, setChildrenFetched] = useState(node.isFetched || false);

    const toggleExpand = async () => {
      if (!childrenFetched) {
        setIsLoading(true);
        const fetchedChildren = await fetchChildren(node, level); // Fetch children based on the current level
        setChildren(fetchedChildren); // Set fetched children
        setChildrenFetched(true); // Mark children as fetched
        setIsLoading(false);
      }
      setIsExpanded(!isExpanded);
    };

    return (
      <li className="tree-node p-2 cursor-pointer transition duration-200 hover:bg-gray-100 overflow-hidden">
        <div
          className="node-header flex items-center justify-between"
          onClick={toggleExpand}
        >
          <div className="flex items-center">
            {children.length > 0 || isLoading ? (
              <span
                className="expand-icon mr-2 text-lg transition-transform duration-200 ease-in-out"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : <FaChevronRight />}
              </span>
            ) : <FaChevronRight />}
            <span className="node-name font-medium">{node.region} {node.name}</span>
            <FaEye
              className="text-gray-600 cursor-pointer ml-4" 
              alt="View Details"
              onClick={() => handleViewDetails(node.id)}
            />
          </div>
        </div>
        {isExpanded && (children.length > 0 || childrenFetched) && (
          <ul
            className="tree-children list-none pl-2 m-0 border-l border-gray-200 transition-all duration-300 ease-in-out"
            style={{ maxHeight: isExpanded ? '500px' : '0', opacity: isExpanded ? 1 : 0 }}
          >
            {children.map((child) => (
              <TreeNode key={child.id} node={child} level={child.level} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="tree-container bg-white rounded-lg shadow-md p-4 h-min-[calc(100vh-80px)] flex flex-col lg:flex-row">
      <div className="left-panel w-full lg:w-80 border-b  lg:border-r lg:border-b-0  border-gray-300 lg:pr-4 mb-4 lg:mb-0">
        <div className="user-info bg-gray-50 p-3 rounded-lg shadow-sm flex flex-col gap-1">
          <p className="text-gray-900 font-bold">{user?.name}</p>  
          <p className="text-sm text-gray-500">{user?.email}</p>  
          <p className="text-gray-700 font-semibold">{user?.role}</p>  
        </div>        
        <div className="relative flex justify-evenly lg:space-x-4 mb-4 p-1 bg-gray-200 rounded-full">
          <div
            className={`absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out transform ${
              view === 'Franchise' ? 'translate-x-0 w-1/2' : 'translate-x-full w-1/2'
            }`}
          ></div>
          <button
            className={`relative z-0 text-lg font-medium py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
              view === 'Franchise' ? 'text-white' : 'text-gray-700'
            }`}
            onClick={() => setView('Franchise')}
          >
            Franchise
          </button>
          <button
            className={`relative z-0 text-lg font-medium py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
              view === 'Shopping' ? 'text-white' : 'text-gray-700'
            }`}
            onClick={() => setView('Shopping')}
          >
            Shopping
          </button>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <FaSpinner className="animate-spin text-center mx-auto" size={40} />
          </div>
        ) : view === 'Franchise' ? (
          <ul className="tree list-none p-0">
            {data.map((rootNode, index) => (
              <TreeNode key={index} node={rootNode} level="company" />
            ))}
          </ul>
        ) : (
          <ul className="tree list-none p-0">
            {/* You can add a different structure for "Shopping" here */}
            <li className="tree-node p-2 cursor-pointer transition duration-200 hover:bg-gray-100 overflow-hidden">
              <div className="node-header flex items-center justify-between">
                <span className="node-name font-medium">Shop 1</span>
              </div>
            </li>
          </ul>
        )}
      </div>

      {/* Right panel (75% on large screens, full width on smaller screens) */}
      <div className="right-panel w-full lg:w-3/4 lg:ml-4 flex flex-col items-start">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        {/* Buttons */}
        <div className="flex flex-col lg:flex-row w-full gap-4">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-5 rounded-lg w-full hover:scale-105 transition-all shadow-md hover:shadow-lg"
            onClick={() => handleFormShow('member')}
          >
            ➕ Add New Member
          </button>
          <button 
            className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-5 rounded-lg w-full hover:scale-105 transition-all shadow-md hover:shadow-lg"
            onClick={() => handleFormShow('shoppingPartner')}
          >
            🛍️ Add Shopping Partner
          </button>
          <button 
            className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-2 px-5 rounded-lg w-full hover:scale-105 transition-all shadow-md hover:shadow-lg"
          >
            ❓ Add Questions
          </button>
        </div>

        <div ref={scrollToFormRef} className='w-full pt-20'>
          {activeForm === 'member' && <AddMemberForm isOpen={true} />}
          {activeForm === 'shoppingPartner' && <AddShoppingPartnerForm isOpen={true} />}
        </div>
      </div>
      {showInfoPopup && selectedMember && <MemberInfoPopup id={selectedMember} onClose={() => setShowInfoPopup(false)} />}
    </div>
  );
};

export default Dashboard;