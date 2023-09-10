
export default function SplashScreen() {

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div id="zig-zag" className="h-screen w-screen fixed ">
            </div>
            <div className="bg-white p-4 rounded-3xl drop-shadow-xl">
                <h1 className="text-4xl font-bold text-center mb-2">Can't wait for your Spotify wrap?</h1>
                <h2 className="text-2xl italic text-center mb-2">Log in to get a sneak peak!</h2>
            </div>
        </div>
    )
}
