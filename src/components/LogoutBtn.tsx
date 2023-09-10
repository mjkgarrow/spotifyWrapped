
import { useGlobalState } from '../context/globalState';
import GenericBtn from './GenericBtn';


export default function LogoutBtn() {
    const { setAuth } = useGlobalState()

    const logOut = () => {
        setAuth({ token: '', expiresAt: new Date().setSeconds(new Date().getSeconds() + 3600) })
        localStorage.clear()
    }

    return (
        <GenericBtn onClick={logOut} text='Logout' />
    )
}
