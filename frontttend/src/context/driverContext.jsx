// import React,{createContext,useState} from 'react';

// export const driverDataContext = createContext();

// const driverContext = ({children}) => {
//     const [driver,setDriver]=useState(null);
//     const [isLoading,setIsLoading]=useState(false);
//     const [error,setError]=useState(null);
    
//     const updateDriver=(driverData)=>{
//         setDriver(driverData);
//     };
//     const value={
//         driver,
//         setDriver,
//         isLoading,
//         setIsLoading,
//         error,
//         setError,
//         updateDriver
//     };
//   return (
//      <driverDataContext.Provider value={value}>
//          {children}
//      </driverDataContext.Provider>
//   )
// }

// export default driverContext
import React, { createContext, useState } from 'react';

export const driverDataContext = createContext();

const DriverContextProvider = ({ children }) => {
    const [driver, setDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateDriver = (driverData) => {
        setDriver(driverData);
    };

    const value = {
        driver,
        setDriver,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateDriver,
    };

    return (
        <driverDataContext.Provider value={value}>
            {children}
        </driverDataContext.Provider>
    );
};

export default DriverContextProvider;

