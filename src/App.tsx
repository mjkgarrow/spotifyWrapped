import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import { useGlobalState } from './context/globalState';
import HomePage from './pages/HomePage'
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)


function App() {
  const { isAuth } = useGlobalState()
  const [timeRange, setTimeRange] = useState<string>('medium_term')

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [timeRange])

  return (
    <>
      <Header set={setTimeRange} get={timeRange} />
      {isAuth() ? <HomePage timeRange={timeRange} /> : <SplashScreen />}
    </>
  )
}

export default App
