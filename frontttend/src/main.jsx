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
);