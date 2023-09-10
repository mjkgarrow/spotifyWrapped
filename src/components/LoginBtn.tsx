import { requestAuthorisation, getAccessToken } from '../api/spotifyAuth'
import { useEffect } from 'react'
import GenericBtn from './GenericBtn';
import { useGlobalState } from '../context/globalState';

export default function LoginBtn() {
    const { setAuth } = useGlobalState()

    const logIn = () => {
        requestAuthorisation()
    }

    const getToken = async (code: string) => {
        // Get access token from Spotify
        const token = await getAccessToken(code!)

        let auth = { token: token, expiresAt: new Date().setSeconds(new Date().getSeconds() + 3600) }

        localStorage.setItem('auth', JSON.stringify(auth))

        setAuth(auth)

    }

    useEffect(() => {
        if (window.location.search.length > 0) {
            const params = new URLSearchParams(window.location.search)
            let code = params.get("code")

            if (code) {
                getToken(code)
                    .then(() => window.history.pushState("", "", import.meta.env.VITE_BASE_URL)) // remove param from url

            }
        }
    }, [])

    return (
        <GenericBtn onClick={logIn} text='Login' />
    )
}
