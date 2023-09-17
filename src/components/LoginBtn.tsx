import { requestAuthorisation } from '../api/spotifyAuth';

export default function LoginBtn() {

    const logIn = async () => {
        requestAuthorisation()
    }

    return (
        <button
            onClick={logIn}
            className="text-xl bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
        >
            Login
        </button>
    )
}