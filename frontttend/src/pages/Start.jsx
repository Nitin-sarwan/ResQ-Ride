import React from 'react'
import {Link} from 'react-router-dom';

const Start = () => {
  return (
    <div >
     <div className='h-screen  flex justify-between flex-col w-full'>
        {/* <h2 className='color-black w-14'>Ambulance</h2> */}
        <div className='bg-white py-5 pb-7 px-10'>
            <h2 className='text-2xl font-bold'>Get started with ResQ Ride</h2>
                  <Link to='/login' className='flex item-center justify-center link-no-decoration w-full bg-black text-white py-3 rounded mt-2'>Continue</Link>
        </div>
        <img className="h-[71%] w-full "
          src="https://annaiambulance.in/wp-content/uploads/2024/03/653c250e8c6372d5fb6f1927637ffa01.jpg"
       />
     </div>
    </div>
  )
}

export default Start
