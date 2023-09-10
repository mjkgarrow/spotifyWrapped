import { Artist } from '../types/spotifyTypes'


type props = { data: Artist[], limit: number }
export default function Artists(props: props) {
    const { data, limit } = props

    return (
        <div className='bg-green-200 flex flex-col items-center w-screen'>
            <p>Top Artists</p>
            <div className='flex justify-center'>
                {data?.length && data.map((artist: Artist, index: number) => {
                    if (index < limit) {
                        return <div key={artist.id}>
                            <img src={artist.images[artist.images.length - 1].url} alt={artist.name} className="rounded-full" />
                        </div>
                    }
                })}
            </div>
        </div>
    )
}