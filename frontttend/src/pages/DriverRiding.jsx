import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState } from 'react'
import { Link,useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide';
import ReceiptPanel from '../components/ReceiptPanel';
import axios from 'axios'; 
// import LiveTracking from '../components/LiveTracking';

const DriverRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const [destinationCoordinate, setDestinationCoordinate] = useState('');
  const [destination, setDestination] = useState('');
  const finishRidePanelRef = useRef(null);
  const location=useLocation();
  const rideData=location.state?.ride;

  const fetchAddress = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(position.coords);
          const preciseLatitude = latitude.toFixed(6);
          const preciseLongitude = longitude.toFixed(6);
          // console.log(preciseLatitude, preciseLongitude); 
          setDestinationCoordinate({ preciseLatitude, preciseLongitude });
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/maps/get-address`, {
              params: {
                ltd: preciseLatitude,
                lng: preciseLongitude,
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

            const address = response.data.address || 'Unable to fetch address';
            // console.log(address);
            setDestination(address);
          } catch (err) {
            console.error('Error fetching address:', err.message);
            alert('Failed to get the address. Please try again.');
          }
        },
        (error) => {
          console.error('Error fetching current location:', error.message);
          alert('Failed to get your current location. Please enable location services and try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };


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
        {/* <LiveTracking/> */}
        <img className='h-full w-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABLUH3RR9WY4ogN9jIsbV0QTaQWXDvEWW1A&s" alt="" />
      </div>
      <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400' onClick={()=>{
        setFinishRidePanel(true)
      }}>
        <h5 className='mb-3 mt-0 text-xl text-white text-center absolute top-2' onClick={() => {
         
        }}><i className="ri-arrow-up-wide-fill"></i></h5>
       <h4 className='text-xl font-semibold'>4Km away</h4>
        <button className='flex mt-1 items-center justify-center rounded-lg bg-green-600 text-white font-semibold p-3 px-8'
        // onClick={()=>fetchAddress()}
        >Complete Ride</button>
      </div>
      <div ref={finishRidePanelRef} className='fixed  z-10 bottom-0 translate-y-full bg-white px-3 py-6'>
        <FinishRide
        ride={rideData}
        setFinishRidePanel={setFinishRidePanel}
        />
        </div>
      {/* <div ref={finishRidePanelRef} className='fixed  z-10 bottom-0 translate-y-full bg-white px-3 py-6'>
        <ReceiptPanel
          ride={rideData}
          setFinishRidePanel={setFinishRidePanel}
          destination={destination}
        />
      </div> */}

    </div>
  )
}

export default DriverRiding
