import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const userLogout = () => {
    const token=localStorage.getItem('token');
    const navigate=useNavigate();
    axios.get("http://localhost:4000/api/v1/user/logout",{
        header:{
            Authorization:`Bearer ${token}`

        }
    }).then((response)=>{
        if(response.status===200){
            localStorage.removeItem('token');
            navigate('/login');
        }
    })
  return (
    <div>
      
    </div>
  )
}

export default userLogout
