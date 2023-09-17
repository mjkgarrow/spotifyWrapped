import { useGlobalState } from '../context/globalState';


export default function LogoutBtn() {
    const { setAuth } = useGlobalState()

    const logOut = () => {
        setAuth({ token: '', expiresAt: new Date().setSeconds(new Date().getSeconds() + 3600) })
        localStorage.clear()
    }

    return (
        <button
            onClick={logOut}
            className="text-lg bg-transparent hover:bg-green-500 text-gray-700 font-semibold hover:text-white py-1 px-2 border border-green-500 hover:border-transparent rounded"
        >
            Logout
        </button>
    )
}