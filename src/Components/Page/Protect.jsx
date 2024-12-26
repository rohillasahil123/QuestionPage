import React from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const navigate = useNavigate();


useEffact(()=>{
const token = Cookies.get("userToken");
if(!token){
    navigate("/loginteacher");
}
} ,[])



const Protect = (props) => {
 const component  = props.Component;



  return (
    <div>
        <component/>
    </div>
  )
}

export default Protect