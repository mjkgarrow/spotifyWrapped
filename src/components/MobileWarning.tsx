
export default function MobileWarning() {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div id="zig-zag" className="h-screen w-screen fixed ">
            </div>
            <div className="bg-fuchsia-200 py-4 px-4 mx-4 rounded-3xl drop-shadow-xl flex flex-col justify-center items-center">
                <h1 className="text-2xl sm:text-4xl font-bold text-center">This site only supports desktop right now.</h1>
            </div>
        </div>
    )
}
