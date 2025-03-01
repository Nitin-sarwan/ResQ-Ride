import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import EmergencyVehiclePanel from '../components/EmergencyVehiclePanel';
import ConfirmEmergencyPanel from '../components/ConfirmEmergencyPanel';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LookingEmergencyDriver from '../components/LookingEmergencyDriver';
import WaitingEmergencyDriver from '../components/WaitingEmergencyDriver';
import { SocketContext } from '../context/socketContext';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const SearchDriver = () => {

  const {socket}=useContext(SocketContext);
  const {user}=useContext(userDataContext);


  const [vehicles, setVehicles] = useState([]);
  const [pickupLocationCoordinate, setPickupLocationCoordinate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [enmergencyVehiclePanel, setEmergencyVehiclePanel] = useState(true);
  const [confirmEmergencyPanel, setConfirmEmergencyPanel] = useState(false);
  const [EmergencyVehicleFound, setEmergencyVehicleFound] = useState(false);
  const [waitingEmergencyDriver, setWaitingEmergencyDriver] = useState(false);
  const [service, setService] = useState(null);
  const emergencyVehicleRef = useRef(null);
  const confirmEmergencyPanelRef = useRef(null);
  const EmergencyVehicleFoundRef= useRef(null);
  const [ride, setRide] = useState(null);
  const waithingEmergencyDriverRef = useRef(null);
  const navigate = useNavigate();

  // useGSAP(function(){
  //   if(enmergencyVehiclePanel){
  //     gsap.to(emergencyVehicleRef.current,
  //        {y:'0%', duration: 1})
  //   }else{
  //     gsap.to(emergencyVehicleRef.current, 
  //       {y:'100%', duration: 1})
  //   }
  // }, [enmergencyVehiclePanel]);

   useEffect(() => {
    socket.emit('join', { userType: "user", userId: user._id });
  }, [user]);

  socket.on('emergency-ride-confirmed', (ride) => {
    setRide(ride);
    setEmergencyVehicleFound(false);
    setWaitingEmergencyDriver(true);
  });

  socket.on('ride-started', (ride) => {
    setWaitingEmergencyDriver(false);
    navigate('/riding', { state: { ride } });
  });

  
  useGSAP(function(){
    if(confirmEmergencyPanel){
      gsap.to(confirmEmergencyPanelRef.current,
         {y:'0%', duration: 1});
    }else{
      gsap.to(confirmEmergencyPanelRef.current, 
        {y:'100%', duration: 1});
    }
  },[confirmEmergencyPanel]);

  useGSAP(function () {
    if (EmergencyVehicleFound) {
      gsap.to(EmergencyVehicleFoundRef.current,
        { y: '0%', duration: 1 });
    } else {
      gsap.to(EmergencyVehicleFoundRef.current,
        { y: '100%', duration: 1 });
    }
  }, [EmergencyVehicleFound]);

  useGSAP(function () {
    if (waitingEmergencyDriver) {
      gsap.to(waithingEmergencyDriverRef.current, {
        transform: 'translateY(0)'
      });
    } else {
      gsap.to(waithingEmergencyDriverRef.current, {
        transform: 'translateY(100%)'
      });
    }
  }, [waitingEmergencyDriver]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const ltd = latitude.toFixed(2);
          const lng = longitude.toFixed(2);
          setPickupLocationCoordinate({ ltd, lng });
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/maps/available`, {
              params: {
                ltd: latitude,
                lng: longitude,
                radius: 30 
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            console.log(response.data.services);
            setVehicles(response.data.services);

            const addressResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/maps/get-address`, {
              params: {
                ltd: latitude,
                lng: longitude
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            setPickupLocation(addressResponse.data.address);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  

  async function createEmergencyRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/ride/request-emergency-ride`, {
      pickupLocation,
      service
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log(response.data);
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      <div className='h-screen w-full'>
        <img className='h-screen w-screen object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABLUH3RR9WY4ogN9jIsbV0QTaQWXDvEWW1A&s" alt="" />
      </div>
      <div  ref={emergencyVehicleRef} className='absolute bottom-0 w-full bg-white translate-y-full '>
        <EmergencyVehiclePanel
         vehicles={vehicles} 
         selectService={setService}
         setEmergencyVehiclePanel={setEmergencyVehiclePanel}
         setConfirmRidePanel={setConfirmEmergencyPanel}
         />
      </div>
      <div ref={confirmEmergencyPanelRef} className='fixed  z-10 bottom-0  bg-white px-3 py-6 '>
        <ConfirmEmergencyPanel
        setConfirmEmergencyPanel={setConfirmEmergencyPanel}
        pickupLocation={pickupLocation}
        createEmergencyRide={createEmergencyRide}
        setEmergencyVehicleFound={setEmergencyVehicleFound}
        />
      </div>
      <div ref={EmergencyVehicleFoundRef} className='fixed  z-10 bottom-0  bg-white px-3 py-6 '>
       <LookingEmergencyDriver
       createEmergencyRide={createEmergencyRide}
       setEmergecnyVehicleFound={setEmergencyVehicleFound}
       pickupLocation={pickupLocation}
       service={service}
        />
      </div>
      <div ref={waithingEmergencyDriverRef} className='fixed  z-10 bottom-0  bg-white px-3 py-6 '>
        <WaitingEmergencyDriver
          ride={ride}
          setEmergecnyVehicleFound={setEmergencyVehicleFound}
          pickupLocation={pickupLocation}
          service={service}
          setWaitingEmergencyDriver={setWaitingEmergencyDriver}
        />
      </div>


       
    </div>
  );
};

export default SearchDriver;
