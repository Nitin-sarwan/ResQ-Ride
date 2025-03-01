import React,{useContext, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {userDataContext} from './../context/userContext';

const userSignup = () => {
    const [name,setName]=useState('');
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message,setMessage]=useState('');
    const [userData, setUserData] = useState({});
    const validatePhoneNumber = () => {
        if (!phoneNumber.startsWith("+91")) {
            return "+91" + phoneNumber;
        }
        return phoneNumber;
    };

    const showMessage = (msg, duration = 5000) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, duration);
    };

    const navigate=useNavigate();
    const {user,setUser}=useContext(userDataContext);
   

    const submitHandler = async(e) => {
        e.preventDefault();
       const  formattedphoneNumber=validatePhoneNumber();
    //    console.log(formattedphoneNumber);

       const newUser={
            name:name,
            phoneNumber: formattedphoneNumber
        };
        //console.log(newUser);
        try{
        const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/signup`,newUser);
        if(response.status === 200){
            const data=response.data;
            setUser(data.user);
            localStorage.setItem('token',data.token);
            //localStorage.setItem('phoneNumber',formattedphoneNumber)
            showMessage(data.message);
            navigate('/verify');
        }
    } catch(error){
            const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response.data.message;
            showMessage(errorMessage);
    }
        setName('');
        setPhoneNumber('');  
    }
  return (
      <div className='p-7  flex flex-col justify-between'>
          <div>
              {message && (
                  <div className={`p-3 mb-4 rounded bg-black text-white`}>
                     {message}
                  </div>
              )}
              
              <form onSubmit={(e) => {
                  submitHandler(e)
              }}>
                  <h3 className=' text-xl mb-2'>Whats your name</h3>
                  <input type="text"
                  placeholder='Enter user name'
                  value={name}
                  required
                  onChange={(e)=>{
                 setName(e.target.value)
                  }} />
                  <h3 className=' text-xl mb-2'>Whats your phone number</h3>
                  <input required
                      value={phoneNumber}
                      onChange={(e) => {
                          setPhoneNumber(e.target.value);
                      }}
                      type="number" placeholder='Enter user phone number' />
                  <button className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Continue</button>
              </form>
              <p className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
          </div>
          <div>
             <p className='text-[10px] leading-tight'>
                By proceeding, you consent to get calls, whatsapp or SMS messages, including by automated means from ResQ and its sffiliates number provided.
             </p>
          </div>
      </div>

  )
}

export default userSignup
