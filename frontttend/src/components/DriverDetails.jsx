import React, { useContext, useState } from 'react';
import { driverDataContext } from '../context/driverContext';
import axios from 'axios';

const DriverDetails = () => {
    const { driver, setDriver } = useContext(driverDataContext);
    const [isAvailable, setIsAvailable] = useState(true);

    const toggleDriverStatus = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/v1/driver/status`, {
                isAvailable: !isAvailable
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                setIsAvailable(!isAvailable);
                setDriver({ ...driver, isAvailable: !isAvailable });
            }
        } catch (error) {
            console.error('Error updating driver status:', error);
        }
    };

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-between gap-2'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{driver.name}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold mb-1'>$124</h4>
                    <p className='text-sm text-gray-600 mt-1'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-6 bg-gray-100 justify-center gap-5'>
                <div className='text-center'>
                    <button
                        className={`px-4 py-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'} text-white`}
                        onClick={toggleDriverStatus}
                    >
                        {isAvailable ? 'Available' : 'Offline'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;
