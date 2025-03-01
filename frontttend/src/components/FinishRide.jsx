import React from 'react'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'

const FinishRide = (props) => {
    const navigate=useNavigate()

    async function endRide(){
        const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/ride/end-Ride`,{
            rideId:props.ride._id
        },{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        if(response.status ===200){
            navigate('/driver-home')
        }
    }
  return (
      <div>
          <h5 className='mb-3 mt-0 text-center absolute top-2' onClick={() => {
              props.setRidePopUpPanel(false)
          }}><i className="ri-arrow-down-wide-fill"></i></h5>
          <h3 className='text-2xl font-semibold mb-3 mt-0'>Finish this ride</h3>
          <div className='flex items-center justify-between p-4 mt-4'>
              <div className='flex items-center gap-3'>
                  <img className='h-12 w-12 rounded-full' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                  <h2 className='text-lg font-medium capitalize'>{props.ride?.user.name}</h2>
              </div>
              <h5 className='text-lg font-semibold'>2.2 Km</h5>
          </div>

          <div className='flex flex-col justify-between items-center '>
              <div className='w-full'>
                  <div className='flex'>
                      <h5 className='mt-3 mr-1'><i className="text-xl ri-map-pin-user-fill"></i></h5>
                      <div className=' items-center gap-5'>
                          {/* <h3 className='text-lg  font-bold m-0'>562/11-A</h3> */}
                          <p className='text-sm text-gray-600 mt-1 font-semibold'>{props.ride?.pickupLocation}</p>
                      </div>

                  </div>
                  <div className='flex'>
                      <h5 className='mt-2 mr-1'><i className="text-xl ri-map-pin-3-fill"></i> </h5>
                      <div className=' items-center gap-5'>
                          {/* <h3 className='text-lg  font-bold m-0'>562/11-A</h3> */}
                          <p className='text-sm text-gray-600 mt-3 font-semibold '>Driver Choise</p>
                      </div>
                  </div>
                  <div className='flex'>
                      <h5 className='mt-3 mr-1'> <i className="ri-currency-line"></i></h5>
                      <div className=' items-center gap-5'>
                          <h3 className='text-lg  font-bold m-0'>₹Based on Per KM</h3>
                          <p className='text-sm text-gray-600 m-0 '>Cash Cash</p>
                      </div>
                  </div>
              </div>
              <div className='mt-6 w-full'>
                <button onClick={endRide} className='flex items-center mt-5 justify-center w-full rounded-lg p-3 bg-green-600 text-white font-semibold'>Finish Ride</button>
              </div>
          </div>

      </div>
  )
}

export default FinishRide
