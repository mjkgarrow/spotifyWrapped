import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import { useGlobalState } from './context/globalState';
import HomePage from './pages/HomePage'
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cursor from './components/Cursor';
import CallbackPage from "./pages/CallbackPage";


gsap.registerPlugin(ScrollTrigger)


function App() {
  const { isAuth } = useGlobalState()
  const [timeRange, setTimeRange] = useState<string>('medium_term')

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [timeRange])


  return (
    <BrowserRouter>
      <Cursor />
      <Header set={setTimeRange} get={timeRange} />

      <Routes>
        <Route path="/" element={isAuth() ? <HomePage timeRange={timeRange} /> : <SplashScreen />} />
        <Route path="callback" element={<CallbackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
