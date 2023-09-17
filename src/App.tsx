import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import { useGlobalState } from './context/globalState';
import HomePage from './pages/HomePage'
import { gsap } from 'gsap';
import CallbackPage from "./pages/CallbackPage";
import { MotionPathPlugin, ScrollTrigger } from "gsap/all";
// import Cursor from './components/Cursor';


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

ScrollTrigger.normalizeScroll(true)

ScrollTrigger.config({ autoRefreshEvents: "DOMContentLoaded,load,visibilitychange" });


function App() {
  const { isAuth } = useGlobalState()

  return (
    <div className="scroller">
      <BrowserRouter>
        {/* <Cursor /> */}
        <Header />

        <Routes>
          <Route path="/" element={isAuth() ? <HomePage /> : <SplashScreen />} />
          <Route path="callback" element={<CallbackPage />} />
        </Routes>

      </BrowserRouter>
    </div>
  )
}

export default App
