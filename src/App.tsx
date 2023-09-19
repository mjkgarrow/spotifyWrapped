import { BrowserRouter, Routes, Route } from "react-router-dom";
import { gsap } from 'gsap';
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";
import { useGlobalState } from './context/globalState';
// import Cursor from './components/Cursor';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage'
import CallbackPage from "./pages/CallbackPage";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

function App() {
  const { isAuth } = useGlobalState()

  return (
    <BrowserRouter>
      {/* <Cursor /> */}
      <Header />

      <Routes>
        <Route path="/" element={isAuth() ? <HomePage /> : <SplashScreen />} />
        <Route path="callback" element={<CallbackPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
