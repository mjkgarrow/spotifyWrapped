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
    popularity: { title: string, x: string[], y: string[], info: string },
    tempo: { title: string, x: string[], y: string[], info: string },
    valence: { title: string, x: string[], y: string[], info: string },
    danceability: { title: string, x: string[], y: string[], info: string },
}

const labeling: LabelType = {
    popularity: { title: 'Popularity', x: ['0', '100'], y: ['More', 'Less'], info: 'Based on the total number of plays and how recent they were, 100 being most popular' },
    tempo: { title: 'Tempo', x: ['0 bmp', '250 bpm'], y: ['More', 'Less'], info: 'Estimated tempo in beats per minute' },
    valence: { title: 'Positivity', x: ['Sadder', 'Happier'], y: ['More', 'Less'], info: 'An indicator of cheerful or euphoric music vs sad or angry music, 1 being most positive' },
    danceability: { title: 'Danceability', x: ['o', '100'], y: ['More', 'Less'], info: 'Suitability for dancing, based on tempo, rhythm and beat strength, 1 being most danceable' },
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
            // @ts-ignore
            dataArray.push(item[key]);
        })

        const topGraphDomain = Math.max(...graphData)
        const topDataDomain = Math.max(...dataArray)

        return topGraphDomain < topDataDomain ? topDataDomain * 1.1 : topGraphDomain * 1.1
    }

    return (
        <section>

            <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#9F6FE2]">
                <h1 className="sm:w-max text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your listening stats</h1>
                <p className="font-bold mt-4 text-xl">Based on data from your top 50 tracks</p>
                <div className="w-full flex justify-center mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="bg-white w-14 h-14 rounded-full p-2 animate-bounce fill-green-500"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>
                </div>
            </div>

            <div className="bg-[#9F6FE2] h-[800vh]">
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