import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
          <h5 className='mb-3 mt-0 text-center absolute top-2' onClick={() => {
              props.setVehiclePanelOpen(false)
              props.setPanelOpen(true)
          }}><i className="ri-arrow-down-wide-fill"></i></h5>
          <h3 className='text-2xl font-semibold mb-3 mt-0'>Choose a Ambulance</h3>
          <div onClick={()=>{
            props.setConfirmRidePanel(true)
            props.setVehiclePanelOpen(false)
            props.selectService('Basic')
          }}
          className='flex  border-5 active:border-black bg-gray-100 mb-2 rounded-xl w-[90%] p-3 items-center justify-between '>
              <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
             
              <div className='ml-2 w-full'>
                  <h4 className='font-medium text-xs mt-1 mb-1'>Basic</h4>
                  <h5 className='font-medium text-xs mt-0 mb-0'>2 min away</h5>
                  <p className='font-normal text-xs mb-0 mt-1'>Affordable, compact ride</p>
              </div>
              <div>
                  <h2 className=' text-lg font-semibold '>₹{props.fare?.Basic}</h2>
              </div>
          </div>
          <div onClick={() => {
              props.setConfirmRidePanel(true)
              props.setVehiclePanelOpen(false)
              props.selectService('Advanced')
          }} className='flex  border-5 active:border-black bg-gray-100 mb-2 rounded-xl  p-3 items-center justify-between w-[90%]'>
              <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
              <div className='ml-2 w-[90%]'>
                  <h4 className='font-medium text-xs mt-1 mb-1'>Advanced</h4>
                  <h5 className='font-medium text-xs mt-0 mb-0'>2 min away</h5>
                  <p className='font-normal text-xs mb-0 mt-1'>Affordable, compact ride</p>
              </div>
              <div>
                  <h2 className=' text-lg font-semibold '>₹{props.fare?.Advanced}</h2>
              </div>
          </div>
          <div onClick={() => {
              props.setConfirmRidePanel(true)
              props.setVehiclePanelOpen(false)
              props.selectService('Mortuary')
          }} className='flex  border-5 active:border-black bg-gray-100 mb-2 rounded-xl  p-3 items-center justify-between w-[90%]'>
              <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
              <div className='ml-2 w-[90%]'>
                  <h4 className='font-medium text-xs mt-1 mb-1'>Mortuary Van</h4>
                  <h5 className='font-medium text-xs mt-0 mb-0'>2 min away</h5>
                  <p className='font-normal text-xs mb-0 mt-1'>Affordable, compact ride</p>
              </div>
              <div>
                  <h2 className=' text-lg font-semibold '>₹{props.fare?.Mortuary}</h2>
              </div>
          </div>
          {/* <div onClick={() => {
              props.setConfirmRidePanel(true)
              props.setVehiclePanelOpen(false)
              props.selectService('ICU')
          }} className='flex  border-5 active:border-black bg-gray-100 mb-2 rounded-xl w-[90%] p-3 items-center justify-between '>
              <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
              <div className='ml-2 w-[90%]'>
                  <h4 className='font-medium text-xs mt-1 mb-1'>ICU</h4>
                  <h5 className='font-medium text-xs mt-0 mb-0'>2 min away</h5>
                  <p className='font-normal text-xs mb-0 mt-1'>Affordable, compact ride</p>
              </div>
              <div>
                  <h2 className=' text-lg font-semibold '>₹{props.fare?.ICU}</h2>
              </div>
          </div> */}
          <div onClick={() => {
              props.setConfirmRidePanel(true)
              props.setVehiclePanelOpen(false)
              props.selectService('Air')
          }} className='flex  border-5 active:border-black bg-gray-100 mb-2 rounded-xl w-[90%] p-3 items-center justify-between '>
              <img className='h-20' src="https://5.imimg.com/data5/SELLER/Default/2021/2/CM/VP/DW/16385410/icu-force-ambulance-500x500.jpg" alt="" />
              <div className='ml-2 w-[90%]'>
                  <h4 className='font-medium text-xs mt-1 mb-1'>Air</h4>
                  <h5 className='font-medium text-xs mt-0 mb-0'>2 min away</h5>
                  <p className='font-normal text-xs mb-0 mt-1'>Affordable, compact ride</p>
              </div>
              <div>
                  <h2 className=' text-lg font-semibold '>₹{props.fare?.Air}</h2>
              </div>
          </div>
    </div>
  )
}

export default VehiclePanel
