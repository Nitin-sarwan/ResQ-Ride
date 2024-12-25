import React,{useState,useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import axios from 'axios';

const userLogin = () => {

    const [phoneNumber,setPhoneNumber]= useState('');
    const [userData, setUserData]= useState({});
    const [message,setMessage]=useState('');
    
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

    const {user,setUser}= useContext(userDataContext);
    const navigate = useNavigate();

    const submitHandler= async(e)=>{
        e.preventDefault();
        const formattedphoneNumber = validatePhoneNumber();
        const userData={
            phoneNumber:formattedphoneNumber
        }
        try {
            const response = await axios.post("http://localhost:4000/api/v1/user/login", userData);
            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token',data.token);
                //localStorage.setItem('phoneNumber',formattedphoneNumber)
                showMessage(data.message);
                //navigate('/user/services');
                navigate('/verify')
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response.data.message;
            showMessage(errorMessage);
        }
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
        <form  onSubmit={(e)=>{
            submitHandler(e)
        }}>
            <h3 className=' text-xl mb-2'>What's your phone number</h3>
            <input required
             value={phoneNumber}
             onChange={(e)=>{
                setPhoneNumber(e.target.value);
             }}
             type="number" placeholder='Enter user number' />
            <button className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Continue</button>
        </form>
             <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account
             </Link></p>
      </div>
      <div>
              <Link to='/driver-login' className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Register as a Driver</Link>
      </div>
    </div>
  )
}

export default userLogin
