import React from 'react'
import Question from './Components/Question/Question'
import  { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <Question/>
      <Toaster/>
    </div>
  )
}

export default App
