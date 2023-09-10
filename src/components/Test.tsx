import { useEffect, useRef } from 'react'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Track } from '../types/spotifyTypes';

gsap.registerPlugin(ScrollTrigger)

type props = {
    tracks: Track[],
}

export default function Test(props: props) {
    const { tracks } = props

    const itemsRef = useRef<Array<HTMLElement | null>>([]);

    useEffect(() => {
        // Reset the refs array
        itemsRef.current = [];

        // Clean up existing ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger) {
                trigger.kill();
            }
        });


    }, [tracks]);

    useEffect(() => {

        // Clean up existing ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger) {
                trigger.kill();
            }
        });

        // Add ScrollTrigger to new elements
        if (itemsRef.current.length) {
            itemsRef.current.forEach(element => {
                gsap.to(element, {
                    scrollTrigger: {
                        trigger: element,
                        start: 'center center',
                        end: '+=50%',
                        markers: true,
                        pin: true,
                    },
                });
            });
        }
    }, [tracks, itemsRef.current]);




    // useEffect(() => {
    //     console.log(itemsRef.current)
    //     if (itemsRef.current.length) {
    //         console.log('check')
    //         itemsRef.current.forEach(element => {
    //             gsap.to(element, {
    //                 scrollTrigger: {
    //                     trigger: element,
    //                     start: 'center center',
    //                     end: '+=50%',
    //                     markers: true,
    //                     pin: true
    //                 }
    //             })
    //         })
    //     }

    //     return () => {
    //         // clean up ScrollTrigger instance on title element

    //         const triggers = ScrollTrigger.getAll();


    //         triggers.map(trigger => {
    //             if (trigger) {
    //                 trigger.kill();
    //             }
    //         })

    //     };

    // }, [tracks, itemsRef.current])

    return (
        <div className='bg-fuchsia-500'>
            {tracks.length > 0 && tracks.map((track, index) => (
                <div ref={ref => {
                    itemsRef.current[index] = ref
                }} key={track.id} className="flex gap-4 items-center">
                    <p className="text-4xl">#{index + 1}</p>
                    <div>
                        <img id={index.toString()} src={track.album.images[0].url} alt={track.name} className="w-24" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="font-bold text-xl">{track.name}</p>
                        <p className="font-thin text-xl">{track.artists[0].name}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
