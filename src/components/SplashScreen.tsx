import LoginBtn from "./LoginBtn";
import { isMobile } from 'react-device-detect';
import MobileWarning from "./MobileWarning";

export default function SplashScreen() {


    return (
        <>
            {isMobile ?
                (<MobileWarning />)
                :
                (<div className="h-screen w-screen flex flex-col justify-center items-center">
                    <div id="zig-zag" className="h-screen w-screen fixed ">
                    </div>

                    <div className="bg-fuchsia-200 py-8 px-4 rounded-3xl drop-shadow-xl flex flex-col justify-center items-center">
                        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4">Get your Spotify Wrap early!</h1>
                        <LoginBtn />
                        <div className="w-full flex justify-center rotate-180">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="bg-white w-14 h-14 rounded-full p-2 -bottom-2 absolute animate-bounce fill-green-500"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>
                        </div>
                    </div>
                </div>)
            }
        </>
    )
}
