import React,{useState,useContext} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {driverDataContext} from './../context/driverContext';
import axios from 'axios';

const driverSignup = () => {
   
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState('');
    const [service, setService] = useState('');
    const [plateNumber, setPlateNumber] = useState('');

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

    const navigate = useNavigate();
    const { driver, setDriver } = useContext(driverDataContext);




    const submitHandler = async(e) => {
        e.preventDefault();
        const formattedphoneNumber=validatePhoneNumber();
       const newDriver={
            name: name,
            phoneNumber:formattedphoneNumber,
            services:{
                plateNumber:plateNumber,
                service:service
            }
       }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/driver/signup`, newDriver);
            if (response.status === 200) {
                const data = response.data;
                setDriver(data.driver);
                localStorage.setItem('token', data.token);
                showMessage(data.message);
                navigate('/VerifyDriver');
            }
        } catch (error) {
            console.log(error.response);
            const errorMessage = error.response?.data?.errors?.[0]?.msg || error.response.data.message;
            showMessage(errorMessage);
        }
        setName('');
        setPhoneNumber('');
        setService('');
        setPlateNumber('');
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
                                <h3 className=' text-xl mb-2'>What's your name</h3>
                                <input type="text"
                                required
                                        placeholder='Enter driver name'
                                        value={name}
                                        onChange={(e) => {
                                        setName(e.target.value)
                                }} />
                                <h3 className=' text-xl mb-2'>What's your phone number</h3>
                                <input required
                                        value={phoneNumber}
                                        onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        }}
                                        type="number" placeholder='Enter driver number' 
                                />  
                                <h3 className='text-xl mb-2'>Service Type</h3>
                                <select
                                    required
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                >
                                    <option value="">Select Service Type</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Mortuary">Mortuary</option>
                                    <option value="Air">Air</option>
                                </select>

                                <h3 className='text-xl mb-2 '>Vehicle Plate Number</h3>
                                <input
                                    type="text"
                                    required
                                    placeholder='Enter vehicle plate number'
                                    value={plateNumber}
                                    onChange={(e) => setPlateNumber(e.target.value)}
                                />
                                <button className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Continue</button>
                        </form>
                        <p className='text-center'>Already have an account? <Link to='/driver-login' className='text-blue-600'>Login here</Link></p>
                </div>
                <div>
                        <p className='text-[10px] leading-tight'>
                                By proceeding, you consent to get calls, whatsapp or SMS messages, including by automated means from ResQ and its sffiliates number provided.
                        </p>
                </div>
        </div>

)
}

export default driverSignup
