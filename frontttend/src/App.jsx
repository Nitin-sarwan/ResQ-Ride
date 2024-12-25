import React from 'react'
import { Routes,Route} from 'react-router-dom';
import Start from './pages/Start';
import Home from './pages/Home';
import UserLogin from './pages/userLogin';
import UserSignup from './pages/usersignup';
import DriverLogin from './pages/driverLogin';
import DriverSignup from './pages/driverSignup';
import VerifyOTP from './pages/verifyOTP';
import Riding from './pages/riding';
import UserProtectWrapper from './pages/UserProtectWrapper';
import UserLogout from './pages/userLogout';
import DriverDocument from './pages/driverDocument';
import Services from './pages/services';
import VerifyDriverOTP from './pages/verifyDriverOTP';
import DriverHome from './pages/driverHome';
import DriverRiding from './pages/DriverRiding';
import DriverProtectWrapper from './pages/DriverProtectWrapper';
import SearchDriver from './pages/SearchDriver';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/riding' element={<Riding/>} />
        <Route path='driver-riding' element={<DriverRiding/>} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/verify' element={<VerifyOTP/>}/>
        <Route path='/verifyDriver' element={<VerifyDriverOTP/>}/>
        <Route path='/driver-login' element={<DriverLogin />} />
        <Route path='/driver-signup' element={<DriverSignup />} />
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
         }/>
         <Route path='/SearchDriver' element={
          <UserProtectWrapper>
            <SearchDriver/>
          </UserProtectWrapper>
         }/>
          <Route path='/user/logout'  element={
            <UserProtectWrapper>
              <UserLogout/>
            </UserProtectWrapper>
            }/>
            <Route path="/driver/document" element={
              <DriverProtectWrapper>
                <DriverDocument/>
              </DriverProtectWrapper>
            }/>
            <Route path="/user/services" element={
          <UserProtectWrapper>
                <Services/>
            </UserProtectWrapper>
            }/>

            <Route path='/driver-home' element={
              <DriverProtectWrapper>
                 <DriverHome/>
             </DriverProtectWrapper>
            }
            />
      </Routes>
    </div>
  )
};

export default App
