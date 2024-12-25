import React, { useContext, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import axios from 'axios';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRidePanel from '../components/ConfirmRidePanel';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/socketContext';
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
// import LiveTracking from '../components/LiveTracking';

const Home = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupLocationCoordinate, setPickupLocationCoordinate] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useGSAP(null);
  const waitingForDriverRef = useRef(null);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [service, setService] = useState(null);
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(userDataContext);

  useEffect(() => {
    socket.emit('join', { userType: "user", userId: user._id });
  }, [user]);

  socket.on('ride-confirmed', (ride) => {
    setRide(ride);
    setVehicleFound(false);
    setWaitingForDriver(true);
  });

  socket.on('ride-started', (ride) => {
    setWaitingForDriver(false);
    navigate('/riding', { state: { ride } });  
  });

  const fetchAddress = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(position.coords);
          const preciseLatitude = latitude.toFixed(6);
          const preciseLongitude = longitude.toFixed(6);
          // console.log(preciseLatitude, preciseLongitude); 
          setPickupLocationCoordinate({preciseLatitude,preciseLongitude});
          try {
            const response = await axios.get('http://localhost:4000/api/v1/maps/get-address', {
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
            setPickupLocation(address);
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

  const handlePickupChange = async (e) => {
    setPickupLocation(e.target.value);
    try {
      const response = await axios.get("http://localhost:4000/api/v1/maps/get-suggestions", {
        params: { input: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPickupSuggestions(response.data);
    } catch (err) {
      console.error('Error fetching pickup suggestions:', err.message);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get("http://localhost:4000/api/v1/maps/get-suggestions", {
        params: { input: e.target.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDestinationSuggestions(response.data);
    } catch (err) {
      console.error('Error fetching destination suggestions:', err.message);
    }
  };

  const handleSuggestionClick = (suggestion, field) => {
    if (field === 'pickupLocation') {
      setPickupLocation(suggestion.description);
    } else {
      setDestination(suggestion.description);
    }
    //setPanelOpen(false);
  };

  const submitHandle = (e) => {
    e.preventDefault();
  };

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%'
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1
      });
    } else {
      gsap.to(panelRef.current, {
        height: '0%'
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0
      });
    }
  }, [panelOpen]);

  useGSAP(function () {
    if (vehiclePanelOpen) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      });
    }
  }, [vehiclePanelOpen]);

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      });
    }
  }, [confirmRidePanel]);

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      });
    }
  }, [vehicleFound]);

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      });
    }
  }, [waitingForDriver]);

  async function findAmbulance() {
    setVehiclePanelOpen(true);
    setPanelOpen(false);
    const response = await axios.get("http://localhost:4000/api/v1/ride/get-fare", {
      params: { pickupLocation, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setFare(response.data);
  }

  async function createRide() {
    const response = await axios.post(`http://localhost:4000/api/v1/ride/request-ride`, {
      pickupLocation,
      destination,
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
        {/* <LiveTracking/> */}
      </div>
      <div className='flex flex-col justify-end h-screen absolute top-0 w-full '>
        <div className='h-[30%] mt-2 bg-white relative'>
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false);
          }} className='absolute opacity-0 right-6 top-2 text-2xl mt-2 mb-2'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold mt-2 mb-2'>Find an Ambulance</h4>
          <form className='flex flex-col ' onSubmit={(e) => {
            submitHandle(e);
          }}>
            <input className='bg-[#eee] px-12 py-2 text-lg rounded-lg '
              type="text"
              name="pickupLocation"
              onClick={() => {
                fetchAddress();
                setPanelOpen(true);
                setActiveField('pickupLocation');
              }}
              value={pickupLocation}
              onChange={handlePickupChange}
              placeholder='Add a pick-up location'
            />
            <input className='bg-[#eee] px-12 py-2 text-lg rounded-lg mt-3'
              type="text"
              name="destination"
              onClick={() => {
                setPanelOpen(true);
                setActiveField('destination');
              }}
              value={destination}
              onChange={handleDestinationChange}
              placeholder='Enter Your destination'
            />
          </form>
          <button onClick={findAmbulance}
            className={`bg-black text-white font-xl p-4 w-full rounded-full mt-3 mb-2 ${!pickupLocation.trim() || !destination.trim() || destination.length < 4 || pickupLocation.length < 4 ? 'bg-gray-300 opacity-0 cursor-not-allowed' : ''}`}
            disabled={!pickupLocation.trim() || !destination.trim() || destination.length < 4 || pickupLocation.length < 4}
          >Find Ambulance</button>
        </div>
        <div ref={panelRef} className='bg-white h-0 '>
          <LocationSearchPanel
            suggestions={activeField === 'pickupLocation' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            handleSuggestionClick={handleSuggestionClick}
            activeField={activeField}
          />
        </div>
      </div>
      <div ref={vehiclePanelRef} className='fixed w-full z-10  bottom-0 translate-y-full bg-white px-3 py-6'>
        <VehiclePanel
          selectService={setService}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanelOpen={setVehiclePanelOpen}
          setPanelOpen={setPanelOpen}
        />
      </div>
      <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 '>
        <ConfirmRidePanel
          createRide={createRide}
          pickupLocation={pickupLocation}
          destination={destination}
          fare={fare}
          service={service}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>
      <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 '>
        <LookingForDriver
          createRide={createRide}
          pickupLocation={pickupLocation}
          destination={destination}
          fare={fare}
          service={service}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  );
};

export default Home;
