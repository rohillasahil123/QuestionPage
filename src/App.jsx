import React from 'react';
import Question from './Components/Question/Question';
import Practice from './Components/Practice/Practice'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Question />} />
          <Route path='/practice' element={ <Practice/> } />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;
