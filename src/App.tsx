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

// ScrollTrigger.normalizeScroll(true)

ScrollTrigger.config({ autoRefreshEvents: "DOMContentLoaded,load,visibilitychange" });


function App() {
  const { isAuth } = useGlobalState()

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // We listen to the resize event
  window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

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
