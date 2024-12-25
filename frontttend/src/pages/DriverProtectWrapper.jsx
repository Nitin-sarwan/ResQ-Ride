// import React, { useContext, useEffect, useState } from 'react';
// import { DriverDataContext } from '../context/driverContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const DriverProtectWrapper = ({ children }) => {

//     const token = localStorage.getItem('token');
//     const [driver,setDriver]=useContext(DriverDataContext);
//     const [isLoading,setIsLoading]=useState(true);

//     const navigate = useNavigate();
//     useEffect(() => {
//         if (!token) {
//             navigate('/driver-login');
//             return;
//         }
//     }, [token]);

//     axios.get("http://localhost:4000/api/v1/driver/profile",{
//         headers:{
//             Authorization:`Bearer ${token}`
//         }
//     }).then((response)=>{
//         if(response.status===200){
//             setDriver(response.data)
//             setIsLoading(false)
//         }
//     }).catch(err=>{
//         console.log(err);
//         localStorage.removeItem('token');
//         navigate('/driver-login')
//     });
//     if(isLoading){
//         return (
//             <div>Loading...</div>
//         )
//     }
//     return (
//         <>
//             {children}
//         </>
//     )
// }

// export default DriverProtectWrapper
import React, { useContext, useEffect, useState } from 'react';
import { driverDataContext } from '../context/driverContext'; // Ensure case matches
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriverProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token');
    const { driver, setDriver, setIsLoading } = useContext(driverDataContext); // Correct usage
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/driver-login');
            return;
        }

        const fetchDriverData = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/v1/driver/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 201) {
                    setDriver(response.data); 
                }
            } catch (err) {
                console.error("Error fetching driver data:", err);
                localStorage.removeItem('token');
                navigate('/driver-login');
            } finally {
                setLoading(false);
            }
        };

        fetchDriverData();
    }, [token, navigate, setDriver]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default DriverProtectWrapper;

