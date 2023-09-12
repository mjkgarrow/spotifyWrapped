import { useEffect, useState } from "react"
import { useGlobalState } from '../context/globalState';
import { getAccessToken } from "../api/spotifyAuth";
import { useNavigate } from "react-router-dom";



export default function CallbackPage() {
    const { setAuth } = useGlobalState()
    const navigator = useNavigate()

    // Get access token from Spotify
    const getToken = async (code: string) => {
        const token = await getAccessToken(code!)

        if (token) {

            let auth = { token: token, expiresAt: new Date().setSeconds(new Date().getSeconds() + 3600) }

            localStorage.setItem('auth', JSON.stringify(auth))

            setAuth(auth)
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)

        if (params.get("code")) {
            let code = params.get("code")

            getToken(code!)
                .then(() => navigator('/')) // return to homepage after getting code
        } else {
            navigator('/') // return to homepage
        }
    }, [])

    return (
        <section>
            <div id='welcome-pattern' className="w-screen h-screen flex flex-col justify-center items-center -z-10"></div>
        </section>
    )
}
