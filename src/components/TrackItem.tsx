import { useLayoutEffect, useRef } from 'react';
import { Track } from '../types/spotifyTypes';
import { gsap } from 'gsap';


type props = {
    index: number,
    track: Track,
}

export default function TrackItem(props: props) {
    const { track, index } = props
    const trackRef = useRef<HTMLDivElement | null>(null);
    const spacerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(trackRef.current, {
                scrollTrigger: {
                    trigger: trackRef.current,
                    start: 'center center',
                    end: '+=50%',
                    pin: true,
                    pinSpacer: spacerRef.current,
                },
            });
        })

        return () => ctx.revert()
    }, [track]);

    return (
        <div ref={spacerRef}>
            <div className="flex gap-4 items-center" ref={trackRef}>
                <p className="text-4xl w-14 text-right">#{index + 1}</p>
                <div>
                    <img id={index.toString()} src={track.album.images[0].url} alt={track.name} className="w-24" />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="font-bold text-xl italic">{track.name}</p>
                    <p className="font-thin text-xl">{track.artists[0].name}</p>
                </div>
            </div>
        </div>
    )
}