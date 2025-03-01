import React,{useState,useContext} from 'react'
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { driverDataContext } from '../context/driverContext';

const driverLogin = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [driverData, setdriverData] = useState({});
    const [message,setMessage]=useState('');

    const validatePhoneNumber=()=>{
        if(!phoneNumber.startsWith("+91")){
            return "+91"+ phoneNumber;
        }
        return phoneNumber;
    }

    const showMessage = (msg, duration = 5000) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, duration);
    };

    const { driver, setDriver } = useContext(driverDataContext);
    const navigate = useNavigate();


    const submitHandler = async(e) => {
        e.preventDefault();
        const formattedphoneNumber=validatePhoneNumber();
        const driverData={
            phoneNumber:formattedphoneNumber
        }
        //console.log(driverData);
        try{
            const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/driver/login`,driverData);
            if (response.status === 200) {
                const data = response.data;
                setDriver(data.driver);
                localStorage.setItem('token', data.token);
                showMessage(data.message);
                navigate('/verifyDriver');
            }

        }catch(error){
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
              <form onSubmit={(e) => {
                  submitHandler(e)
              }}>
                  <h3 className=' text-xl mb-2'>Whats your phone number</h3>
                  <input required
                      value={phoneNumber}
                      onChange={(e) => {
                          //console.log(e.target.value);
                          setPhoneNumber(e.target.value);
                      }}
                      type="number" placeholder='Enter driver phone number' />
                  <button className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Continue</button>
              </form>
              <p className='text-center'>New here? <Link to='/driver-signup' className='text-blue-600'>Register as Driver</Link></p>
          </div>
          <div>
              <Link to='/login' className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Sign in as User</Link>
          </div>
    </div>
      
         
  )
}

export default driverLogin
