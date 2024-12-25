import React,{useState}from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const ConfirmRidePopUp = (props) => {
    const [otp,setOtp]=useState('');
    const navigate=useNavigate();



    const submitHandler= async(e)=>{
        e.preventDefault();
        const response=await axios.get('http://localhost:4000/api/v1/ride/start-ride',{
        params:{
             rideId: props.ride._id,
             otp: otp
        },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(response.status===200){
            props.setConfirmRidePopUpPanel(false);
            props.setRidePopUpPanel(false);
            navigate('/driver-riding',{state:{ride:props.ride}});
        }
    }
  return (
    <div className='h-screen w-full'>
          <h5 className='mb-4 mt-0 text-center absolute top-4 ' onClick={() => {
              props.setConfirmRidePopUpPanel(false)
          }}><i className="ri-arrow-down-wide-fill"></i></h5>
          <h3 className='text-2xl font-semibold mb-1 mt-2'>Confirm this ride to start</h3>
          <div className='flex items-center gap-44 px-4 mt-4'>
              <div className='flex items-center gap-3'>
                  <img className='h-12 w-12 rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                  <h2 className='text-lg font-medium capitalize'>{props.ride?.user.name}</h2>
              </div>
              <h5 className='text-lg font-semibold '>2.2 Km</h5>
          </div>

          <div className='flex flex-col justify-between items-center '>
              <div className='w-full'>
                  <div className='flex'>

                      <h5 className='mt-2 mr-1'><i className="text-xl ri-map-pin-user-fill"></i></h5>
                      <div className=' items-center gap-5'>
                          <h3 className='text-lg  font-bold m-0'>562/11-A</h3>
                          <p className='text-sm text-gray-600 m-0 '>{props.ride?.pickupLocation}</p>
                      </div>

                  </div>
                  <div className='flex'>
                      <h5 className='mt-2 mr-1'><i className="text-xl ri-map-pin-3-fill"></i> </h5>
                      <div className=' items-center gap-5'>
                          <h3 className='text-lg  font-bold m-0'>562/11-A</h3>
                          <p className='text-sm text-gray-600 m-0 '>{props.ride?.destination}</p>
                      </div>
                  </div>
                  <div className='flex'>
                      <h5 className='mt-3 mr-1'> <i className="ri-currency-line"></i></h5>
                      <div className=' items-center gap-5'>
                          <h3 className='text-lg  font-bold m-0'>₹{props.ride?.fare}</h3>
                          <p className='text-sm text-gray-600 m-0 '>Cash Cash</p>
                      </div>
                  </div>
              </div>
             <div className='mt-6 w-full'>
                <form onSubmit={submitHandler}>
                      <input className=' bg-[#eee] px-6 py-4 w-full font-mono text-lg rounded-lg  mt-3'
                      value={otp}
                      type="text"
                      placeholder='Enter OTP'
                      required
                      onChange={(e)=>setOtp(e.target.value)}
                       />
                <button className='flex items-center mt-5 justify-center w-full rounded-lg p-3 bg-green-600 text-white font-semibold'>Confirm</button>
                      
                <button onClick={() => {
                    props.setConfirmRidePopUpPanel(false)
                    props.setRidePopUpPanel(false)
                }} className='flex items-center mt-1 justify-center w-full rounded-lg p-3 bg-gray-600 text-white font-semibold'>Cancel</button>
                </form>
             </div>
          </div>
      
    </div>
  )
}

export default ConfirmRidePopUp
