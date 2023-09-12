import { useEffect } from "react"
import { useGlobalState } from "../context/globalState"
import CircleLoading from "../components/CircleLoading"
import TopTracksSection from "../components/TopTracksSection"
import WelcomeSection from "../components/WelcomeSection"
import EmptySection from "../components/EmptySection"
import TopArtistsSection from "../components/TopArtistsSection"
import TopGenresSection from "../components/TopGenres"

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

    // LISTENING PERSONALITY SECTION (get genres from artists, compare with popularity, compare with volume of top tracks)
    // RECOMMENDATIONS SECTION

    return (

        <>
            {checkEmpty() ?
                <CircleLoading /> :
                <main className="w-screen overflow-hidden">
                    <div id='top'></div>
                    <WelcomeSection />

                    {data.artists.length && <TopArtistsSection artists={data.artists.slice(0, 5)} />}

                    {data.tracks.length && <TopTracksSection tracks={data.tracks.slice(0, 5)} />}

                    {data.tracks.length && <TopGenresSection tracks={data.tracks.slice(0, 99)} />}

                    <EmptySection backgroundColour="bg-orange-400" />
                </main>
            }

        </>

    )
}
