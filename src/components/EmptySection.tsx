
type props = {
    backgroundColour: string
}

export default function EmptySection(props: props) {
    const { backgroundColour } = props

    return (
        <div className={`h-screen ${backgroundColour}`}></div>
    )
}
