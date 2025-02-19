import React, { useState } from 'react';
import Question from './Components/Question/Question';
import Practice from './Components/Practice/Practice'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Page/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AboutPage from './Components/Page/AboutPage';
import ContactUsPage from './Components/Page/ContactUsPage';
import Navbar from './Components/Page/Navbar';
import Footer from './Components/Page/Footer';
// import LoginPage from './Components/Page/LoginPage';
import TeacherForm from './Components/Page/TeacherForm';
import Login from './Components/Page/Login';
import Dashboard from './Components/Page/Dashboard';
import RefreshHandler from './helper/RefreshHandler';
// import Protect from './Components/Page/Protect';
import { UserProvider, useUser } from './helper/useContext';
import Cookies from 'js-cookie';
import PageNotFound from "./Components/Page/PageNotFound";
import ListOfShops from './Components/Page/ListOfShops';
import ForgotPassword from './Components/Page/ForgotPassword';
import ResetPassword from './Components/Page/ResetPassword';

const App = () => {
  const PrivateRoute = ({ element }) => {
    // const { isLoggedIn } = useUser();
    return Cookies.get('userToken') ? element : <Navigate to="/login" />
  }

  return (
    <UserProvider>
      <BrowserRouter>
        <RefreshHandler />
        <Navbar />
        <div style={{ marginTop: '70px' }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/practice' element={<Practice />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path='/schoolform' element={<TeacherForm />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgotPassword' element={<ForgotPassword />} />
            <Route path='/resetPassword' element={<ResetPassword />} />


            <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />} />
            <Route path='/dashboard/addQuestion' element={<PrivateRoute element={<Question />} />} />
            <Route path='/dashboard/listOfShops' element={<PrivateRoute element={<ListOfShops />} />} />


            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
      <Footer />
    </UserProvider>
  );
};

export default App;
