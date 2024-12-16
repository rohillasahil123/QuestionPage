import React, { Component } from 'react';
import Question from './Components/Question/Question';
import Practice from './Components/Practice/Practice'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/Page/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AboutPage from './Components/Page/AboutPage';
import ContactUsPage from './Components/Page/ContactUsPage';
import Navbar from './Components/Page/Navbar';
import Footer from './Components/Page/Footer';
// import LoginPage from './Components/Page/LoginPage';
import TeacherForm from './Components/Page/TeacherForm';
import LoginTteacher from './Components/Page/LoginTteacher';
import ProtectPage from './Components/Protect/ProtectPage';

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <div style={{marginTop:'70px'}}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/QuizzyGame' element={ <ProtectPage Component={Question}/>} />
          <Route path='/practice' element={ <Practice/> } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path='/schoolform' element={ <TeacherForm/>}/>
          <Route path='/loginteacher' element={<LoginTteacher/> }/>
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
    <Footer/>
    </>
  );
};

export default App;
