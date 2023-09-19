import { useEffect } from "react"
import { isMobile } from "react-device-detect"
import { useGlobalState } from "../context/globalState"
import CircleLoading from "../components/CircleLoading"
import WelcomeSection from "../components/WelcomeSection"
import EmptySection from "../components/EmptySection"
import TopArtistsSection from "../components/TopArtistsSection"
import TopTracksSection from "../components/TopTracksSection"
import ListeningSection from "../components/ListeningSection"
import RecommendedSection from "../components/RecommendedSection"
import MobileWarning from "../components/MobileWarning"

export default function HomePage() {
    const { data, checkEmpty, makeApiCall } = useGlobalState()

    useEffect(() => {
        makeApiCall(['tracks', 'artists'], 'medium_term')
    }, [])

    return (
        <>
            {checkEmpty() ?
                <CircleLoading /> :
                isMobile ?
                    <MobileWarning />
                    :
                    <main className="w-screen">
                        <WelcomeSection />

                        {data.artists.length && <TopArtistsSection artists={data.artists.slice(0, 5)} />}

                        {data.tracks.length && <TopTracksSection tracks={data.tracks.slice(0, 5)} />}

                        {data.tracks.length && <ListeningSection tracks={data.tracks.slice(0, 99)} />}

                        {data.tracks.length && <RecommendedSection />}

                        <EmptySection backgroundColour="bg-teal-400" />
                    </main>
            }
        </>
    )
}
