// import React,{useContext,useEffect, useState} from 'react';
// import { userDataContext } from '../context/userContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';



// const UserProtectWrapper = ({children}) => {
//   const token=localStorage.getItem('token');
//   const {user,setUser}=useContext(userDataContext);
//   const [isLoading,setIsLoading]=useState(true);

  
//   const navigate=useNavigate();
//   useEffect(()=>{
//     console.log(token);
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//   },[token]);
//   axios.get("http://localhost:4000/api/v1/user/profile",{
//     headers:{
//       Authorization:`Bearer ${token}`
//     }
//   })
//   .then((response)=>{
//     if(response.status===200){
//       setUser(response.data)
//       setIsLoading(false)
//     }
//   }).catch(err=>{
//     console.log(err);
//     localStorage.removeItem('token');
//     navigate('/login')
//   })
//   if(isLoading){
//     return (
//       <div>Loading...</div>
//     )
//   }
//   return (
//     <>
//     {children}
//     </>
//   )
// }

// export default UserProtectWrapper

import React, { useContext, useEffect, useState } from 'react';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const { user, setUser } = useContext(userDataContext);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and fetch user data
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed the header key
          },
        });
        if (response.status === 201) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
