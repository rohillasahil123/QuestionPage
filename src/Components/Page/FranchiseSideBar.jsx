import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaChevronRight, FaSpinner, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useUser } from "../../helper/useContext";
import MemberInfoPopup from './MemberInfoPopup';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

function FranchiseSideBar() {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('Franchise');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const restrictedRoles = ["Teacher", "School", "Marketing Manager"];

  useEffect(() => {
    if (!restrictedRoles.includes(user?.role)) {
      setData([
        {
          name: user?.role,
          level: user?.role,
          id: user?.id,
          region: user?.region || '',
          children: [],
          isFetched: false,
        },
      ]);
    }
    setIsLoading(false);
  }, [user]);

  const handleViewDetails = (id) => {
    setSelectedMember(id);
    setShowInfoPopup(true);
  };

  const getFranchiseDetails = async (type, id) => {
    let payload = { role: type, id: id };
    const response = await axios.post(`${baseUrl}/company/franchise/getFranchiseDetails`, payload, {
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
    // if (response.data.success) toast.success(response.data.message);
    
    if (!response?.data?.users) return [];
    
    return response.data.users.map(user => ({
      name: user.name,
      level: user.role,
      id: user._id,
      region: user.region
    }));
  };

  const fetchChildren = async (node, level) => {
    switch (level) {
      case 'Admin':
        return getFranchiseDetails('State Franchise');
      case 'State Franchise':
        return getFranchiseDetails('District Franchise', node.id);
      case 'District Franchise':
        return getFranchiseDetails('City Franchise', node.id);
      case 'City Franchise':
        return getFranchiseDetails('Marketing Manager', node.id);
      case 'Marketing Manager':
        return getFranchiseDetails('School Franchise', node.id);
      case 'School Franchise':
        return getFranchiseDetails('Teacher Franchise', node.id);
      case 'Teacher Franchise':
        return fetchStudents();
      default:
        return [];
    }
  };

  // Modified TreeNode: Accepts a new `defaultExpanded` prop.
  const TreeNode = ({ node, level, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [children, setChildren] = useState(node.children || []);
    const [isLoadingChildren, setIsLoadingChildren] = useState(false);
    const [childrenFetched, setChildrenFetched] = useState(node.isFetched || false);

    // If defaultExpanded is true, fetch the children on mount.
    useEffect(() => {
      if (defaultExpanded && !childrenFetched) {
        setIsLoadingChildren(true);
        fetchChildren(node, level).then(fetchedChildren => {
          setChildren(fetchedChildren);
          setChildrenFetched(true);
          setIsLoadingChildren(false);
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleExpand = async () => {
      if (!childrenFetched) {
        setIsLoadingChildren(true);
        const fetchedChildren = await fetchChildren(node, level);
        setChildren(fetchedChildren);
        setChildrenFetched(true);
        setIsLoadingChildren(false);
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
            {(children.length > 0 || isLoadingChildren) ? (
              <span
                className="expand-icon mr-2 text-lg transition-transform duration-200 ease-in-out"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                {isLoadingChildren ? (
                  <FaSpinner className="animate-spin" />
                ) : <FaChevronRight />}
              </span>
            ) : <FaChevronRight />}
            <span className="node-name font-medium">{node.region} {node.name}</span>
            {!defaultExpanded && <FaEye
              className="text-gray-600 cursor-pointer ml-4"
              alt="View Details"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(node.id);
              }}
            />}
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
    <div className="left-panel w-full lg:w-80 border-b lg:border-r lg:border-b-0 border-gray-300 lg:pr-4 mb-4 lg:mb-0">
      <div className="user-info bg-gray-200 p-3 rounded-lg shadow-sm flex flex-col gap-1 mb-4">
        <p className="text-gray-900 font-bold">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <p className="text-gray-700 font-semibold">{user?.role}</p>
      </div>
      {!restrictedRoles.includes(user?.role) && (
        <>
          <div className="relative flex justify-evenly lg:space-x-4 mb-4 p-1 bg-gray-200 rounded-full">
          <div
            className={`absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out transform ${
              view === 'Franchise' ? 'translate-x-0 w-1/2' : 'translate-x-full w-1/2'
            }`}
          ></div>
          <button
            className={`relative z-0 text-lg font-medium py-2 px-4 w-full rounded-full transition-all duration-300 ease-in-out m-0 ${
              view === 'Franchise' ? 'text-white' : 'text-gray-700'
            }`}
            onClick={() => setView('Franchise')}
          >
            Franchise
          </button>
          <button
            className={`relative z-0 text-lg font-medium py-2 px-4 w-full rounded-full transition-all duration-300 ease-in-out m-0 ${
              view === 'Downline' ? 'text-white' : 'text-gray-700'
            }`}
            onClick={() => setView('Downline')}
          >
            Direct
          </button>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <FaSpinner className="animate-spin text-center mx-auto" size={40} />
          </div>
        ) : view === 'Franchise' ? (
          <ul className="tree list-none p-0">
            {data.map((rootNode, index) => (
              <TreeNode
                key={rootNode.id}
                node={rootNode}
                level={rootNode.level}
                defaultExpanded={index === 0}
              />
            ))}
          </ul>
        ) : (
          <DirectDownline handleViewDetails={handleViewDetails} />
        )}
        </>
      )}
      {showInfoPopup && selectedMember && (
        <MemberInfoPopup id={selectedMember} onClose={() => setShowInfoPopup(false)} />
      )}
    </div>
  );
}

export default FranchiseSideBar;

function DirectDownline({ handleViewDetails }) {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id;

  const getFranchiseDetails = async (id) => {
    let payload = { role: 'Direct Downline', id: id };
    const response = await axios.post(
      `${baseUrl}/company/franchise/getFranchiseDetails`,
      payload,
      {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      }
    );

    // if (response.data.success) toast.success(response.data.message);

    if (!response?.data?.users) return [];
    const directData = response.data.users.map((user) => ({
      name: user.name,
      level: user.role,
      id: user._id,
      region: user.region,
    }));
    setData(directData);
  };

  useEffect(() => {
    getFranchiseDetails(userId);
    setIsLoading(false);
  }, [userId]);

  return (
    <div>
      <ul className="tree list-none p-0">
        <li className="tree-node p-2 cursor-pointer transition duration-200 hover:bg-gray-100 overflow-hidden">
          <div className="node-header flex items-center">
            <span
              className="expand-icon mr-2 text-lg transition-transform duration-200 ease-in-out"
              style={{ transform: 'rotate(90deg)' }}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaChevronRight />}
            </span>
            <span className="node-name font-medium">Direct Downline</span>
          </div>
          <ul
            className="tree-children list-none pl-2 m-0 border-l border-gray-200 transition-all duration-300 ease-in-out"
            style={{ maxHeight: '500px', opacity: 1 }}
          >
            {data.map((item) => (
              <li
                key={item.id}
                className="tree-node p-2 cursor-pointer transition duration-200 hover:bg-gray-100"
              >
                <div className="node-header flex items-center justify-between">
                  <div className="flex items-center">
                    <FaChevronRight className="mr-2" />
                    <span className="node-name font-medium">
                      {item.region} {item.name}
                    </span>
                  </div>
                  <FaEye
                    className="text-gray-600 cursor-pointer ml-4"
                    alt="View Details"
                    onClick={() => handleViewDetails(item.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
