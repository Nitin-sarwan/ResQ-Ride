import React from 'react';

const EmergencyVehiclePanel = ({ vehicles=[],
   selectService,
   setConfirmRidePanel,
   setEmergencyVehiclePanel
 }) => {
  const vehicleMap=new Map();
  vehicles.forEach(vehicle => {
    if(!vehicleMap.has(vehicle)){
      vehicleMap.set(vehicle,vehicle);
    }
  });
  const fare={
    "Basic":100,
    "Advanced":150,
    "ICU":200,
    "Air":250
  }
  const uniqueVehicles=Array.from(vehicleMap.values());
  return (
    <div className='h-[60%] '>
      <h5 className='mb-3 mt-0 text-center absolute top-2' onClick={() => {
         setEmergencyVehiclePanel(false)
      }}>
        {/* <i className="ri-arrow-down-wide-fill"></i> */}
      </h5>
      <h3 className='text-2xl font-semibold mb-3 mt-0'>Choose an Ambulance</h3>
      {
      uniqueVehicles.map(vehicle => (
        <div key={vehicle._id} onClick={()=>{
           selectService(vehicle),
           setConfirmRidePanel(true),
           setEmergencyVehiclePanel(false)
        }} className='flex items-center  p-4 border-b'>
          <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
          <div className='ml-2 w-[90%]'>
            <h4 className='font-medium text-xs mt-1 mb-1'>{vehicle}</h4>
            <h5 className='font-medium text-xs mt-0 mb-0'>2 min away</h5>
            <p className='font-normal text-xs mb-0 mt-1'>Affordable, compact ride</p>
          </div>
          <div>
            <h2 className='text-lg font-semibold'>₹{fare[vehicle]}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmergencyVehiclePanel;
