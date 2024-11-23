import React from 'react';
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

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <div style={{marginTop:'70px'}}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/QuizzyGame' element={<Question />} />
          <Route path='/practice' element={ <Practice/> } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
    <Footer/>
    </>
  );
};

export default App;
