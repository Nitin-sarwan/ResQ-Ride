import React from 'react'

const ConfirmEmergencyPanel = (props) => {
  return (
    <div>
      <h5 className='mb-3 mt-0 text-center absolute top-2' onClick={() => {
        props.setConfirmEmergencyPanel(false)
        // props.setVehiclePanelOpen(true)
      }}><i className="ri-arrow-down-wide-fill"></i></h5>
      <h3 className='text-2xl font-semibold mb-3 mt-0'>Confirm Your Ride</h3>
      <div className='flex flex-col justify-between items-center '>
        <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
        <div className='w-full'>
          <div className='flex'>
           
            <h5 className='mt-2 mr-1'><i className="text-xl ri-map-pin-user-fill"></i></h5>
            <div className=' items-center gap-5'>
              {/* <h3 className='text-lg  font-bold m-0'>562/11-A</h3> */}
              <p className='text-sm text-gray-600 mt-3 font-semibold capitalize'>{props.pickupLocation}</p>
            </div>
          
          </div>
          <div className='flex'>
            {/* <h5 className='mt-2 mr-1'><i className="text-xl ri-map-pin-3-fill"></i> </h5>
            <div className=' items-center gap-5'>
              {/* <h3 className='text-lg  font-bold m-0'>562/11-A</h3> */}
              {/* <p className='text-sm text-gray-600 m-0 capitalize'>{props.destination}</p> */}
            {/* </div>  */}
          </div>
          <div className='flex'>
            <h5 className='mt-3 mr-1'> <i className="ri-currency-line"></i></h5>
            <div className=' items-center gap-5'>
              <h3 className='text-lg  font-bold m-0'>Based on Km</h3>
              <p className='text-sm text-gray-600 m-0 '>Cash Cash</p>
            </div>
          </div>
        </div>
        <button onClick={()=>{
          props.setEmergencyVehicleFound(true)
          props.setConfirmEmergencyPanel(false)
          props.createEmergencyRide()
        }} className='flex items-center justify-center w-full rounded-lg bg-green-600 text-white font-semibold'>Confirm</button>
      </div>
      
    </div>
  )
}

export default ConfirmEmergencyPanel
