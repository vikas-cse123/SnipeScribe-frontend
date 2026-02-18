import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SignIn from "./pages/SignUp";
import { Toaster } from "sonner";
import SignUpLayout from "./layouts/SignUpLayout";
import Otp from "./pages/Otp";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <Routes>
       <Route path="/" element={<Home />} />

        <Route path="/signup" element={<SignUpLayout />}>
          <Route index element={<SignUp />} />
          <Route path="otp" element={<Otp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
