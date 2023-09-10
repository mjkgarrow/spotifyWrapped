import { useEffect } from "react"
import { useGlobalState } from "../context/globalState"
import CircleLoading from "../components/CircleLoading"
import TopTracksSection from "../components/TopTracksSection"
import WelcomeSection from "../components/WelcomeSection"
import EmptySection from "../components/EmptySection"

type props = {
    timeRange: string
}

export default function HomePage(props: props) {
    const { timeRange } = props
    const { data, checkEmpty, makeApiCall } = useGlobalState()


    useEffect(() => {
        makeApiCall('artists', timeRange)
        makeApiCall('tracks', timeRange)
    }, [timeRange])

    // ---- TODO -----
    // TOP SONGS SECTION
    // TOP ARTISTS SECTION
    // LISTENING PERSONALITY SECTION (get genres from artists, compare with popularity, compare with volume of top tracks)
    // RECOMMENDATIONS SECTION

    return (

        <>
            {checkEmpty() ?
                <CircleLoading /> :
                <main className="w-screen">
                    <WelcomeSection />

                    <TopTracksSection tracks={data.tracks} limit={5} />

                    <EmptySection backgroundColour="bg-orange-400" />
                </main>
            }

        </>

    )
}
