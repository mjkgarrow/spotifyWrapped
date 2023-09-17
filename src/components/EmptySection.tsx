
type props = {
    backgroundColour: string
}

export default function EmptySection(props: props) {
    const { backgroundColour } = props

    return (
        <div className={`h-screen ${backgroundColour} flex justify-center items-center`}>
            <h1 className="p-4 bg-white rounded-2xl shadow-2xl text-2xl text-center">
                Hope you enjoyed your early
                <br></br>
                Spotify Wrap!!!
            </h1>
        </div>
    )
}
