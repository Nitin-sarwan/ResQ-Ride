import React from 'react'
import {Link,useLocation} from 'react-router-dom';
import {useEffect,useContext} from 'react'
import { SocketContext } from '../context/socketContext';
import { useNavigate } from 'react-router-dom';
const riding = () => {
    const location=useLocation();
    const {ride}=location.state || {};

    const {socket}=useContext(SocketContext);
    const navigate=useNavigate();
    const destination=ride?.destination || "Driver's Choice";
    const fare=ride?.fare || `Based on  Per Km Rate: ₹10`;
     
   useEffect(()=>{
       socket.on('ride-ended', () => {
           navigate('/user/services')
       })
    });


  return (
    <div className='h-screen'>
        <Link  to ='/user/services'className='fixed  right-2 top-2 h-10 w-10 bg-white flex  items-center justify-center rounded-full  '>
              <i className="text-lg font-medium ri-home-3-line"></i>
        </Link>
          <div className='h-[60%]'>
              <img className='h-full w-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABLUH3RR9WY4ogN9jIsbV0QTaQWXDvEWW1A&s" alt="" />

          </div>
          <div >
              <div className='flex items-end w-full justify-between mt-2 mb-2'>
                  <img className='h-12 rounded-full left-2' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
                  <div className='text-right mr-7 '>
                      <h2 className='m-0 font-medium text-lg capitalize '>{ride?.driver.name}</h2>
                      <h4 className=' font-semibold m-0'>{ride?.driver.services.plateNumber}</h4>
                      <h5 className='m-0'>{ride?.driver.ratings}</h5>
                  </div>
              </div>
              <div className='flex flex-col justify-between items-center '>
                  <div className='w-full mt-3'>
                      <div className='flex'>
                          <h5 className='mt-2 mr-1'><i className="text-xl ri-map-pin-3-fill"></i> </h5>
                          <div className=' items-center gap-5'>
                              {/* <h3 className='text-lg  font-bold m-0'>562/11-A</h3> */}
                              <p className='text-sm text-gray-600 mt-3 font-semibold '>{destination}</p>
                          </div>
                      </div>
                      <div className='flex'>
                          <h5 className='mt-3 mr-1'> <i className="ri-currency-line"></i></h5>
                          <div className=' items-center gap-5'>
                              <h3 className='text-lg  font-bold m-0'>₹{fare}</h3>
                              <p className='text-sm text-gray-600 m-0 '>Cash Cash</p>
                          </div>
                      </div>
                  </div>
              </div>
            <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a payment</button>
          </div>
    </div>
  )
}

export default riding
