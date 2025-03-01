import React from 'react'
const RidePopUp = (props) => {
  return (
    <div className="w-full">
          <h5 className='mb-3 mt-0 text-center absolute top-2' onClick={() => {
            props.setRidePopUpPanel(false)
          }}><i className="ri-arrow-down-wide-fill"></i></h5>
          <h3 className='text-2xl font-semibold mb-3 mt-0'>New Ride Available!</h3>
          <div className='flex items-center gap-44  mt-4 w-full'>
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
              <div className='flex mt-5 w-full items-center justify-between'>
                  <button onClick={() => {
                      props.setRidePopUpPanel(false)
                  }} className='flex items-center mt-1 justify-center  rounded-lg bg-gray-600 text-white font-semibold p-3 px-8'>Ignore</button>

                  <button onClick={() => {
                      props.setConfirmRidePopUpPanel(true)
                      props.confirmRide();
                  }} className='flex mt-1 items-center justify-center rounded-lg bg-green-600 text-white font-semibold p-3 px-8'>Accept</button>
                 
              </div>
          </div>

    </div>
  )
}

export default RidePopUp
