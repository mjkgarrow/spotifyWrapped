import { useGlobalState } from "../context/globalState"
import CircleLoading from "../components/CircleLoading"
import WelcomeSection from "../components/WelcomeSection"
import EmptySection from "../components/EmptySection"
// import TopArtistsSection from "../components/TopArtistsSection"
import TopTracksSection from "../components/TopTracksSection"
// import ListeningSection from "../components/ListeningSection"


export default function HomePage() {
    const { data, checkEmpty } = useGlobalState()

    // ---- TODO -----
    // RECOMMENDATIONS SECTION

    return (

        <>
            {checkEmpty() ?
                <CircleLoading /> :
                <main className="w-screen overflow-hidden">
                    <div id='top'></div>
                    <WelcomeSection />

                    {/* {data.artists.length && <TopArtistsSection artists={data.artists.slice(0, 5)} />} */}

                    {data.tracks.length && <TopTracksSection tracks={data.tracks.slice(0, 5)} />}

                    {/* {data.tracks.length && <ListeningSection tracks={data.tracks.slice(0, 99)} />} */}

                    <EmptySection backgroundColour="bg-orange-400" />
                </main>
            }

        </>

    )
}
