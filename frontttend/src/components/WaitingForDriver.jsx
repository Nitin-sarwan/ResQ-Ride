import React from 'react'

const WaitingForDriver = (props) => {
const handleCallDriver = () => {
    window.location.href = `tel:${props.ride?.driver.phoneNumber}`;
};

return (
        <div>
                <h5 className='mb-3 mt-0 text-center absolute top-2'
                onClick={() => {
                    props.waitingForDriver(false);
                }}><i className="ri-arrow-down-wide-fill"></i></h5>
                <div className='flex items-end w-full justify-between mb-2'>
                        <img className='h-10 left-2 rounded-full' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
                        <div className='text-right mr-7 '>
                                <h3 className='m-0 '>{props.ride?.driver.name}</h3>
                                <h4 className=' font-semibold m-0'>UP281458</h4>
                                <h1 className='text-lg font-semibold'>  {props.ride?.otp} </h1>
                                <h5 className='m-0'>{props.ride?.driver.ratings}</h5>
                        </div>
                </div>
                 <div className='flex items-center justify-evenly '>
                        <div>
                                <h2 className=' text-xl text-center mb-1 mt-1 rounded-xl'><i className="ri-map-pin-line"></i></h2>
                                <p className='mt-1 mb-1 p-2'>Share my ride</p>
                        </div>
                        <div onClick={handleCallDriver}>
                                <h2 className=' text-xl text-center mb-1 mt-1 rounded-xl'><i className="ri-phone-fill"></i></h2>
                                <p className='mt-1 mb-1 p-2'>Call Driver</p>
                        </div>
                 </div>
                <div className='flex flex-col justify-between items-center '>
                        <div className='w-full mt-3'>
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
                </div>
        </div>
);
}

export default WaitingForDriver
