import LogoutBtn from '../components/LogoutBtn'
import { useGlobalState } from '../context/globalState';
import TimeSelector from './TimeSelector';

export default function Header() {
    const { isAuth } = useGlobalState()

    return (
        <header className='w-screen flex h-16 justify-between items-center px-8 bg-[#1DB954] fixed z-50 top-0'>
            <div className='w-1/3'>
                <img src='../../public/assets/images/logos/Spotify_Logo_RGB_Black.png' alt='spotify' className='w-28'></img>
            </div>
            <div className='w-1/3 flex justify-center'>
                {isAuth() ? <TimeSelector /> : <div className='text-2xl sm:text-3xl font-bold min-w-max '>Wrap Me!</div>}
            </div>
            <div className='w-1/3 flex justify-end'>
                {isAuth() && <LogoutBtn />}
            </div>
        </header>

    )
}