import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import EmergencyVehiclePanel from '../components/EmergencyVehiclePanel';
import ConfirmEmergencyPanel from '../components/ConfirmEmergencyPanel';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SearchDriver = () => {
  const [vehicles, setVehicles] = useState([]);
  const [pickupLocationCoordinate, setPickupLocationCoordinate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [enmergencyVehiclePanel, setEmergencyVehiclePanel] = useState(true);
  const [confirmEmergencyPanel, setConfirmEmergencyPanel] = useState(false);
  const [service, setService] = useState(null);
  const emergencyVehicleRef = useRef(null);
  const confirmEmergencyPanelRef = useRef(null);

  // useGSAP(function(){
  //   if(enmergencyVehiclePanel){
  //     gsap.to(emergencyVehicleRef.current,
  //        {y:'0%', duration: 1})
  //   }else{
  //     gsap.to(emergencyVehicleRef.current, 
  //       {y:'100%', duration: 1})
  //   }
  // }, [enmergencyVehiclePanel]);

  useGSAP(function(){
    if(confirmEmergencyPanel){
      gsap.to(confirmEmergencyPanelRef.current,
         {y:'0%', duration: 1});
    }else{
      gsap.to(confirmEmergencyPanelRef.current, 
        {y:'100%', duration: 1});
    }
  },[confirmEmergencyPanel]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const ltd = latitude.toFixed(2);
          const lng = longitude.toFixed(2);
          setPickupLocationCoordinate({ ltd, lng });
          try {
            const response = await axios.get('http://localhost:4000/api/v1/maps/available', {
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

            const addressResponse = await axios.get('http://localhost:4000/api/v1/maps/get-address', {
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
    const response = await axios.post(`http://localhost:4000/api/v1/ride/request-emergency-ride`, {
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
      <div className='h-screen w-screen'>
        <img className='h-screen w-screen object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABLUH3RR9WY4ogN9jIsbV0QTaQWXDvEWW1A&s" alt="" />
      </div>
      <div  ref={emergencyVehicleRef} className='absolute bottom-0 w-full bg-white translate-y-full p-5 '>
        <EmergencyVehiclePanel
         vehicles={vehicles} 
         selectService={setService}
         setEmergencyVehiclePanel={setEmergencyVehiclePanel}
         setConfirmRidePanel={setConfirmEmergencyPanel}
         />
      </div>
      <div ref={confirmEmergencyPanelRef} className='fixed w-full z-10 bottom-0  bg-white px-3 py-6 '>
        <ConfirmEmergencyPanel
        setConfirmEmergencyPanel={setConfirmEmergencyPanel}
        pickupLocation={pickupLocation}
        createEmergencyRide={createEmergencyRide}
        />
      </div>

       
    </div>
  );
};

export default SearchDriver;
