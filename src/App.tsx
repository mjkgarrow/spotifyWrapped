import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import { useGlobalState } from './context/globalState';
import HomePage from './pages/HomePage'
import { gsap } from 'gsap';
import Cursor from './components/Cursor';
import CallbackPage from "./pages/CallbackPage";
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

ScrollTrigger.normalizeScroll(true)

function App() {
  const { isAuth } = useGlobalState()

  return (
    <BrowserRouter>
      <Cursor />
      <Header />

      <Routes>
        <Route path="/" element={isAuth() ? <HomePage /> : <SplashScreen />} />
        <Route path="callback" element={<CallbackPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
