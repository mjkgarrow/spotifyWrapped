import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap"
import { Track } from "../types/spotifyTypes";
import TrackList from "./TrackList";
import TrackItem from "./TrackItem";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type props = {
    tracks: Track[],
    limit: number
}

export default function TopTracksSection(props: props) {
    const { tracks, limit } = props

    const wrapperRef = useRef(null)
    const rightRef = useRef(null)
    const leftRef = useRef(null)
    const trackRef = useRef<HTMLDivElement | null>(null);
    const rightSpacerRef = useRef<HTMLDivElement | null>(null);
    const leftSpacerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        // console.log(rightRef.current.clientHeight)

        ScrollTrigger
        const ctx = gsap.context(() => {

            gsap.to(wrapperRef.current, {
                scrollTrigger: {
                    trigger: trackRef.current,
                    start: 'center center',
                    end: '+=50%',
                    pin: true,
                    pinSpacer: rightSpacerRef.current,
                    markers: true
                },
            });

            gsap.to(wrapperRef.current, {
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: 'bottom bottom',
                    pin: leftRef.current,

                }
            })

            gsap.fromTo(wrapperRef.current,
                {
                    backgroundColor: '#51d2d6'
                }, {
                backgroundColor: '#fa4d4d',
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    scrub: true,
                    start: 'top top',
                    end: 'bottom center'

                }
            })
        })

        return () => ctx.revert()
    }, [tracks]);


    return (
        <section id='top-tracks' ref={wrapperRef} className="flex">


            <div ref={leftRef} id='left' className="h-screen w-2/5 flex items-center justify-end border">
                <div className="text-3xl sm:text-4xl font-serif bg-white rounded-xl p-4 drop-shadow-lg">Your top songs</div>
            </div>


            <div ref={rightRef} className="w-3/5 flex border bg-blue-300">
                <div className='w-full'>
                    {tracks.length > 0 && tracks.map((track, index) => {
                        return index < limit && (
                            <div ref={rightSpacerRef} key={track.id} className='border'>
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
                    })}
                </div>
            </div>

        </section>
    )
}


// import { useEffect, useLayoutEffect, useRef } from "react";
// import { gsap } from "gsap"
// import { Track } from "../types/spotifyTypes";
// import TrackList from "./TrackList";
// import TrackItem from "./TrackItem";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// type props = {
//     tracks: Track[],
//     limit: number
// }

// export default function TopTracksSection(props: props) {
//     const { tracks, limit } = props

//     const wrapperRef = useRef(null)
//     const rightRef = useRef(null)
//     const leftRef = useRef(null)

//     useLayoutEffect(() => {
//         // console.log(rightRef.current.clientHeight)

//         const ctx = gsap.context(() => {
//             gsap.to(wrapperRef.current, {
//                 scrollTrigger: {
//                     trigger: rightRef.current,
//                     start: "top top",
//                     end: 'bottom bottom',
//                     pin: leftRef.current,
//                 }
//             })

//             gsap.fromTo(wrapperRef.current,
//                 {
//                     backgroundColor: '#51d2d6'
//                 }, {
//                 backgroundColor: '#fa4d4d',
//                 scrollTrigger: {
//                     trigger: wrapperRef.current,
//                     scrub: true,
//                     start: 'top top',
//                     end: 'bottom center'

//                 }
//             })
//         })

//         return () => ctx.revert()
//     }, []);


//     useEffect(() => {
//         ScrollTrigger.refresh()
//     }, [])

//     return (
//         <section id='top-tracks' ref={wrapperRef} className="flex">

//             <div ref={leftRef} id='left' className="h-screen w-2/5 flex items-center justify-end border">
//                 <div className="text-3xl sm:text-4xl font-serif bg-white rounded-xl p-4 drop-shadow-lg">Your top songs</div>
//             </div>

//             <div ref={rightRef} className="w-3/5 flex border">
//                 <div className='w-full my-[100vh]'>
//                     {tracks.length > 0 && tracks.map((track, index) => {
//                         return index < limit && (
//                             <div key={track.id} className='border'>
//                                 <TrackItem track={track} index={index} />
//                             </div>
//                         )
//                     })}
//                 </div>
//             </div>

//         </section>
//     )
// }