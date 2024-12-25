import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/userContext.jsx';
import DriverContext from './context/driverContext.jsx'
import SocketProvider from './context/socketContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DriverContext>
     <UserContext>
      <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
        </SocketProvider>
     </UserContext>
    </DriverContext>
  </StrictMode>,
)

// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import { BrowserRouter } from 'react-router-dom';
// import UserContext from './context/userContext.jsx';
// import DriverContext from './context/driverContext.jsx';
// import SocketProvider from './context/socketContext.jsx';

// // Function to load the Google Maps script dynamically
// function loadGoogleMapsApi(apiKey) {
//   if (!document.querySelector(`script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"]`)) {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);
//   }
// }

// // Example usage of loadGoogleMapsApi function
// const apiKey = `${import.meta.env.VITE_GOOGLE_API_MAPS_KEY}`;
// loadGoogleMapsApi(apiKey);

// const root = createRoot(document.getElementById('root'));
// root.render(
//   <StrictMode>
//     <DriverContext>
//       <UserContext>
//         <SocketProvider>
//           <BrowserRouter>
//             <App />
//           </BrowserRouter>
//         </SocketProvider>
//       </UserContext>
//     </DriverContext>
//   </StrictMode>,
// );