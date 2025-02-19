import React, { useEffect, useRef, useState } from 'react';
import AddMemberForm from './AddMemberForm';
import AddShoppingPartnerForm from './AddShoppingPartnerForm';
import FranchiseSideBar from './FranchiseSideBar';
import ListOfShops from './ListOfShops';
import AddSchoolForm from './AddSchoolForm';
import AddTeacherForm from './AddTeacherForm';
import ListOfSchools from './ListOfSchools';
import { useUser } from "../../helper/useContext";
import ListOfTeachers from './ListOfTeachers';
import AddContestForm from './AddContestForm';

const Dashboard = () => {
  const { user } = useUser();
  const [activeForm, setActiveForm] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const scrollToFormRef = useRef(null);

  const roleButtons = {
    Admin: [
      { label: "➕ Add Member", type: "member", color: "blue" },
      { label: "🏫 Add School", type: "addSchool", color: "yellow" },
      { label: "🏫 Show School", type: "listOfSchools", color: "yellow" },
      { label: "📖 Add Teacher", type: "addTeacher", color: "blue" },
      { label: "📝 Create Contest", type: "addContest", color: "red" },
      { label: "📚 Show Contest", type: "showContest", color: "red" },
    ],
    "State Franchise": [
      { label: "➕ Add Member", type: "member", color: "blue" },
      { label: "🏫 Add School", type: "addSchool", color: "yellow" },
      { label: "🏫 Show School", type: "listOfSchools", color: "yellow" },
    ],
    "District Franchise": [
      { label: "➕ Add Member", type: "member", color: "blue" },
      { label: "🏫 Add School", type: "addSchool", color: "yellow" },
      { label: "🏫 Show School", type: "listOfSchools", color: "yellow" },
    ],
    "City Franchise": [
      { label: "➕ Add Member", type: "member", color: "blue" },
      { label: "🏫 Add School", type: "addSchool", color: "yellow" },
      { label: "🏫 Show School", type: "listOfSchools", color: "yellow" },
    ],
    "Marketing Manager": [
      { label: "🏫 Add School", type: "addSchool", color: "yellow" },
      { label: "🏫 Show School", type: "listOfSchools", color: "yellow" },
    ],
    School: [
      { label: "📖 Add Teacher", type: "addTeacher", color: "blue" },
      { label: "📖 Show Teacher", type: "listOfTeachers", color: "blue" },
    ],
    Teacher: [
      { label: "📝 Create Contest", type: "addContest", color: "green" },
      { label: "📚 Show Contest", type: "showContest", color: "red" },
    ],
  };

  const commonButtons = [
    { label: "🏪 Add Shop", type: "shoppingPartner", color: "green" },
    { label: "🛍️ List of Shops", type: "listOfShops", color: "green" },
  ];

  useEffect(() => {
    if (user?.role === 'School') {
      setSchoolId(user?.id);
      setSchoolName(user?.name);
      setActiveForm('listOfTeachers')
    } 
    else if (user?.role === 'Teacher') setActiveForm('showContest');
    else if (user?.role === 'Marketing Manager') setActiveForm('addSchool');
    else setActiveForm('member')
  }, [user]);

  const handleFormShow = (formType) => {
    setActiveForm(formType);
    setTimeout(() => {
      scrollToFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-700",
    yellow: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    red: "bg-gradient-to-r from-red-500 to-red-700",
    green: "bg-gradient-to-r from-green-500 to-green-700",
  };

  const Button = ({ label, type, color }) => (
    <button
      className={`${colorClasses[color]} text-white py-2 rounded-lg w-full hover:scale-105 transition-all shadow-md hover:shadow-lg`}
      onClick={() => handleFormShow(type)}
    >
      {label}
    </button>
  );

  return (
    <div className="tree-container bg-white rounded-lg shadow-md p-3 md:p-4 h-min-[calc(100vh-80px)] flex flex-col lg:flex-row">
      <FranchiseSideBar />
      <div className="right-panel w-full lg:w-3/4 lg:ml-4 flex flex-col items-start">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {(roleButtons[user?.role] || []).map((btn) => (
            <Button key={btn.type} {...btn} />
          ))}
          {commonButtons.map((btn) => (
            <Button key={btn.type} {...btn} />
          ))}
        </div>
        <div ref={scrollToFormRef} className='w-full pt-5 scroll-mt-16'>
          {activeForm === 'member' && <AddMemberForm isOpen={true} />}
          {activeForm === 'shoppingPartner' && <AddShoppingPartnerForm isOpen={true} />}
          {activeForm === 'listOfShops' && <ListOfShops isOpen={true} />}
          {activeForm === 'addSchool' && <AddSchoolForm isOpen={true} />}
          {activeForm === 'listOfSchools' && <ListOfSchools isOpen={true} setSchoolId={setSchoolId} setSchoolName={setSchoolName} handleFormShow={handleFormShow} />}
          {activeForm === 'addTeacher' && <AddTeacherForm isOpen={true} schoolId={schoolId} schoolName={schoolName} />}
          {activeForm === 'listOfTeachers' && <ListOfTeachers isOpen={true} schoolId={schoolId} schoolName={schoolName} />}
          {activeForm === 'addContest' && <AddContestForm isOpen={true} />}
          {/* {activeForm === 'showContest' && <ListOfContest isOpen={true} />} */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
