import { useLayoutEffect, useRef } from 'react';
import { Track } from '../types/spotifyTypes'
import { gsap } from "gsap"

type props = {
    tracks: Track[],
    limit: number
}

export default function TopTracks(props: props) {
    const { tracks, limit } = props
    const itemsRef = useRef<Array<HTMLElement | null>>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            itemsRef.current.forEach(element => {
                gsap.fromTo(element, { opacity: 0 }, {
                    opacity: 1,
                    duration: 3,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 90%',
                        end: 'bottom center',
                        scrub: true,
                    },
                });
            });

        })

        return () => ctx.revert()
    }, [tracks]);

    return (

        <div className='w-full flex flex-col justify-center items-center bg-[#fa4d4d] pb-24'>
            <div className='flex flex-col gap-4'>
                {tracks.length > 0 && tracks.map((track, index) => {
                    return index < limit && <div key={track.id} ref={ref => { itemsRef.current[index] = ref }} className="flex gap-4 items-center">

                        <div>
                            <img id={index.toString()} src={track.album.images[0].url} alt={track.name} className="w-24" />
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="font-bold text-xl italic">{track.name}</p>
                            <p className="font-thin text-xl">{track.artists[0].name}</p>
                        </div>

                    </div>
                })}
            </div>
        </div >
    )
}
