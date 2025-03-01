import React,{useState,useRef,useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import DriverDetails from '../components/DriverDetails'
import RidePopUp from '../components/RidePopUp'
import gsap from 'gsap'
import axios from 'axios';
import { useGSAP } from '@gsap/react'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import {SocketContext} from './../context/socketContext';
import { driverDataContext } from '../context/driverContext'
import LiveTracking from '../components/LiveTracking'


const DriverHome = () => {
  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef=useRef(null);
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [ride,setRide]=useState(null);
  const [confirmRidePopUpPanel,setConfirmRidePopUpPanel]=useState(false);

  const {socket} =useContext(SocketContext);
  const {driver}=useContext(driverDataContext);

  useEffect(()=>{
    socket.emit('join',{
      userType:'driver',
      userId:driver._id
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit('update-location-driver', {
            userId: driver._id,
            location:{
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }
    const locationInterval = setInterval(updateLocation,10000);
    updateLocation();
    
    //  return ()=>clearInterval(locationInterval);
  });

  socket.on('new-ride',(data)=>{
    // console.log(data);
    setRide(data);
    setRidePopUpPanel(true);
  });
  socket.on('new-emergency-ride',(data)=>{
    // console.log(data);
    setRide(data);
    setRidePopUpPanel(true);
  });

  socket.on('ride-accepted',(data)=>{
    setRidePopUpPanel(false);
  });
  socket.on('ride-already-accepted',(data)=>{
    setRidePopUpPanel(false);
  });

  async function confirmRide(){
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/ride/confirm `,{
      rideId:ride._id,
      driverId:driver._id,
    },{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('response of ride: ',response);
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  }

  async function confirmEmergencyRide(){
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/ride/confirm-emergency-ride `,{
      rideId:ride._id,
      driverId:driver._id,
    },{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('response of ride: ',response);
    setRidePopUpPanel(false);
    setConfirmRidePopUpPanel(true);
  }

  useGSAP(function () {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(0%)'
      })
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [ridePopUpPanel]);

  useGSAP(function () {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(0%)'
      })
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePopUpPanel]);


  return (
    <div className='h-screen w-full'>
     <div>
        <Link to='/driver-home' className='fixed  right-2 top-2 h-10 w-10 bg-white flex  items-center justify-center rounded-full  '>
          <i className="text-lg font-medium ri-home-3-line"></i>
        </Link>
     </div>

      <div className='h-3/5'>
       <LiveTracking/>
      </div>
      <div className='h-2/5 p-6' >
       <DriverDetails/>
      </div>
      <div ref={ridePopUpPanelRef} className='fixed  z-10 bottom-0 translate-y-full bg-white px-3 py-6'>
        <RidePopUp
         ride={ride}
         setRidePopUpPanel={setRidePopUpPanel} 
         setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
         confirmRide={confirmRide}
         confirmEmergencyRide={confirmEmergencyRide}
          />
      </div>
      <div ref={confirmRidePopUpPanelRef} className='fixed  z-10 bottom-0 translate-y-full bg-white px-3 py-6'>
        <ConfirmRidePopUp 
        ride={ride}
        setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} 
        setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  )
}

export default DriverHome
