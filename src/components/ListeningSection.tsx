import { useEffect, useState } from "react";
import { Track, AudioFeaturesCollection, AudioFeatures } from "../types/spotifyTypes";
import { getTracksFeatures } from "../api/spotifyQueries";
import { getList } from '../utils/helpers'
import { DensityChart } from "./DensityChart";
import { colours } from "../utils/globals";


type props = {
    tracks: Track[],
}

type TopTracksType = Track & AudioFeatures

type ListeningData = {
    popularity: number[],
    tempo: number[],
    valence: number[],
    danceability: number[],
}

type LabelType = {
    popularity: { title: string, x: string[], y: string[] },
    tempo: { title: string, x: string[], y: string[] },
    valence: { title: string, x: string[], y: string[] },
    danceability: { title: string, x: string[], y: string[] },
}

const labeling: LabelType = {
    popularity: { title: 'Popularity', x: ['Niche', 'Smash hit'], y: ['More', 'Less'] },
    tempo: { title: 'Tempo', x: ['Slower', 'Faster'], y: ['More', 'Less'] },
    valence: { title: 'Positivity', x: ['Sadder', 'Happier'], y: ['More', 'Less'] },
    danceability: { title: 'Danceability', x: ['Wackier', 'Rhythmic'], y: ['More', 'Less'] },
}

export default function ListeningSection(props: props) {
    const { tracks } = props
    const [loaded, setLoaded] = useState<boolean>(false)
    const [listeningData, setListeningData] = useState<ListeningData | null>(null)
    const [topData, setTopData] = useState<TopTracksType[]>([])

    // Make API call to get audio features
    useEffect(() => {
        setLoaded(() => false)

        let featuresData: ListeningData = {
            popularity: [],
            tempo: [],
            valence: [],
            danceability: [],
        }

        getTracksFeatures(tracks.map(track => track.id))
            .then((data: AudioFeaturesCollection) => {

                // Grab the data of the top tracks
                let topTracks = tracks.slice(0, 5);

                // Merge audio features for the top tracks
                let topVals: any[] = topTracks.map((track: Track) => {
                    // Find the matching audio feature by id
                    let matchingAudioFeature = data.audio_features.find((audioFeature: AudioFeatures) => audioFeature.id === track.id);

                    // If a matching audio feature is found, create a merged object
                    if (matchingAudioFeature) {
                        return {
                            ...track,
                            ...matchingAudioFeature
                        };
                    }

                    // If no matching audio feature is found, just return the track
                    return track;
                });

                setTopData(topVals)

                // Grab the data for all tracks
                featuresData.popularity = getList(tracks, 'popularity')
                featuresData.tempo = getList(data.audio_features, 'tempo')
                featuresData.valence = getList(data.audio_features, 'valence')
                featuresData.danceability = getList(data.audio_features, 'danceability')

                setListeningData(featuresData)

                setLoaded(true)
            })

    }, [tracks])

    // Calculate the correct domain of the data so the graphs are easier to interpret
    const getDomain = (graphData: number[], topTrackData: TopTracksType[], key: string): number => {
        const dataArray: number[] = [];

        topTrackData.map((item: TopTracksType) => {
            dataArray.push(item[key]);
        })

        const topGraphDomain = Math.max(...graphData)
        const topDataDomain = Math.max(...dataArray)

        return topGraphDomain < topDataDomain ? topDataDomain : topGraphDomain
    }

    return (
        <section>

            <div className="flex items-center justify-center w-screen h-screen bg-[#9F6FE2]">
                <div className="sm:w-max text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your listening stats</div>
            </div>

            <div className="bg-[#9F6FE2]">
                {loaded && Object.keys(listeningData!).map((key, index) =>
                    <DensityChart
                        key={key}
                        labels={labeling[key as keyof LabelType]}
                        colours={[colours[index + 5], colours[index]]}
                        data={listeningData![key as keyof ListeningData]}
                        width={window.innerWidth * 0.8}
                        height={window.innerHeight * 0.5}
                        domain={[0, getDomain([...listeningData![key as keyof ListeningData]], topData, key)]}
                        topTracks={topData}
                        graphType={key} />
                )}
            </div>
        </section>
    )
}



// Get average popularity of your top 10 songs
// The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.

// Get intrumentalness vs speechiness
// Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.

// Loudness
// The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.

// Average tempo
// The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.

// Valence
// A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).

// Danceability
// Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.