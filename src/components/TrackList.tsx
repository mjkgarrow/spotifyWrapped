import { Track } from '../types/spotifyTypes';
import TrackItem from './TrackItem'


type props = {
    tracks: Track[],
    limit: number
}

export default function TrackList(props: props) {
    const { tracks, limit } = props

    return (
        <div className='w-full py-[100vh]'>
            {tracks.length > 0 && tracks.map((track, index) => {
                return index < limit && (
                    <div key={track.id} className='border'>
                        <TrackItem track={track} index={index} />
                    </div>
                )
            })}
        </div>
    )
}