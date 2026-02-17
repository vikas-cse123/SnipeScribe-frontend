import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignIn from './pages/SignUp'
import { Toaster } from 'sonner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster theme='dark' position='top-right'/>

    <SignIn/>
     
    </>
  )
}

export default App
