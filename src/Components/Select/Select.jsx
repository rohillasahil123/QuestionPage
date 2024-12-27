import React from 'react'
import { Link, useNavigate } from "react-router-dom";

const Select = () => {

    
  const navigate = useNavigate(); 

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue) {
          navigate(selectedValue);
        }
      };
  return (
    <div>
         <select onChange={handleSelectChange} defaultValue="">
              <option value="" disabled>
                Select option
              </option>
              <option value="/QuizzyGame"> <Link to='/QuizzyGame' >G_K Question</Link></option>
              <option value="/practice"> <Link to='/practice' >practice Question</Link></option>
             
            </select>
    </div>
  )
}

export default Select