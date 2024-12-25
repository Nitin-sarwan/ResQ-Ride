import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide';

const DriverRinding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null);
  const location=useLocation();
  const rideData=location.state?.ride;

  useGSAP(function () {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [finishRidePanel]);

  return (
    <div className='h-screen'>
      <div>
        <Link to='/driver-home' className='fixed  right-2 top-2 h-10 w-10 bg-white flex  items-center justify-center rounded-full  '>
          <i className="text-lg font-medium ri-home-3-line"></i>
        </Link>
      </div>

      <div className='h-4/5'>
        <img className='h-full w-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABLUH3RR9WY4ogN9jIsbV0QTaQWXDvEWW1A&s" alt="" />
      </div>
      <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400' onClick={()=>{
        setFinishRidePanel(true)
      }}>
        <h5 className='mb-3 mt-0 text-xl text-white text-center absolute top-2' onClick={() => {
         
        }}><i className="ri-arrow-up-wide-fill"></i></h5>
       <h4 className='text-xl font-semibold'>4Km away</h4>
        <button className='flex mt-1 items-center justify-center rounded-lg bg-green-600 text-white font-semibold p-3 px-8'>Complete Ride</button>
      </div>
      <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6'>
        <FinishRide
        ride={rideData}
        setFinishRidePanel={setFinishRidePanel}
        />
        </div>

    </div>
  )
}

export default DriverRinding
