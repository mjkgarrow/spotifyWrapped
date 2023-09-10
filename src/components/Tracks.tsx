import { Track } from '../types/spotifyTypes'

type props = { data: Track[], limit: number }

export default function Tracks(props: props) {
    const { data, limit } = props

    return (
        <div className='bg-blue-200 flex flex-col items-center w-screen'>
            <p>Top Tracks</p>
            <div className='flex justify-center w-screen'>
                {data.length && data.map((track: Track, index: number) => {
                    if (index < limit) {
                        return <div key={track.id}>
                            <img src={track.album.images[track.album.images.length - 1].url} alt={track.name} className="rounded-full" />
                        </div>
                    }
                })}
            </div>
        </div>
    )
}

