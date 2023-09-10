import LoginBtn from '../components/LoginBtn'
import LogoutBtn from '../components/LogoutBtn'
import UserInfo from './UserInfo';
import { useGlobalState } from '../context/globalState';
import TimeSelector from './TimeSelector';

type props = {
    set: any,
    get: string,
}

export default function Header(props: props) {
    const { isAuth } = useGlobalState()
    const { set, get } = props

    return (
        <header className='w-screen flex h-16 justify-between items-center px-8 bg-[#1ed760] fixed z-50 top-0'>
            <div className='w-1/3'>
                {isAuth() ? <UserInfo /> : <img src='/assets/images/Spotify-Icon-png-rgb-black.png' className='w-10' alt='spotify logo'></img>}
            </div>
            <div className='w-1/3 flex justify-center'>
                {isAuth() ? <TimeSelector set={set} get={get} /> : <div className='text-3xl font-bold'>Wrap Me!</div>}
            </div>
            <div className='w-1/3 flex justify-end'>
                {isAuth() ? <LogoutBtn /> : <LoginBtn />}
            </div>
        </header>

    )
}