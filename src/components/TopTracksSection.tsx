import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap"
import { Track } from "../types/spotifyTypes";

type props = {
    tracks: Track[],
    limit: number
}

export default function TopTracksSection(props: props) {
    const { tracks, limit } = props

    const wrapperRef = useRef(null)
    const rightRef = useRef(null)
    const leftRef = useRef(null)

    const trackRefs = useRef<Array<HTMLDivElement | null>>([])
    const finalTrackRefs = useRef<Array<HTMLDivElement | null>>([])
    const spacerRefs = useRef<Array<HTMLDivElement | null>>([])

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // Scroll triggers for right-side track elements
            trackRefs.current.forEach((element, index) => {
                gsap.to(wrapperRef.current, {
                    scrollTrigger: {
                        trigger: element,
                        start: 'center center',
                        pin: true,
                        pinSpacer: spacerRefs.current[index],

                    },
                });
            })

            // Scroll trigger for left title, endtrigger is last element in tracks list
            gsap.to(wrapperRef.current, {
                scrollTrigger: {
                    trigger: rightRef.current,
                    start: "top top",
                    endTrigger: spacerRefs.current[spacerRefs.current.length - 1],
                    end: `${trackRefs.current[trackRefs.current.length - 1]?.clientHeight} top`,
                    pin: leftRef.current,
                    markers: true
                }
            })

            // Scroll trigger for background colour
            gsap.fromTo(wrapperRef.current,
                {
                    backgroundColor: '#51d2d6'
                },
                {
                    backgroundColor: '#fa4d4d',
                    scrollTrigger: {
                        trigger: wrapperRef.current,
                        scrub: true,
                        start: 'top top',
                        end: 'bottom center'

                    }
                }
            )

            // Scroll trigger for final track list
            finalTrackRefs.current.forEach(element => {
                gsap.fromTo(element, { opacity: 0 }, {
                    opacity: 1,
                    duration: 3,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 90%',
                        end: 'bottom center',
                        scrub: true,
                    },
                })
            });
        })

        return () => ctx.revert()
    }, [tracks]);


    return (
        <section>

            {/* Main track reveal */}
            <div ref={wrapperRef} className="flex flex-col sm:flex-row">
                <div ref={leftRef} className="h-fit py-10 sm:h-screen sm:w-2/5 pl-2 flex items-center justify-end">
                    <div className="sm:w-max text-lg sm:text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your top songs</div>
                </div>


                <div ref={rightRef} className="w-3/5 sm:pt-[100vh] pb-[30vh] pl-2 sm:pl-4">

                    {tracks.length > 0 && tracks.map((track, index) => {
                        return index < limit && (
                            <div ref={el => spacerRefs.current[index] = el} key={track.id}>
                                <div className="flex gap-4 items-center" ref={el => trackRefs.current[index] = el}>
                                    <p className="text-2xl sm:text-4xl w-6 sm:w-14 text-right">#{index + 1}</p>

                                    <img id={index.toString()} src={track.album.images[0].url} alt={track.name} className="w-16 sm:w-32 rounded-lg drop-shadow-2xl" />

                                    <div className="flex flex-col justify-center min-w-max">
                                        <p className="font-bold sm:text-xl italic">{track.name}</p>
                                        <p className="font-thin sm:text-xl">{track.artists[0].name}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Final track list */}
            <div className='sm:flex sm:flex-col sm:gap-4 sm:w-full sm:pl-[40vw] bg-[#fa4d4d] pb-24'>
                {tracks.length > 0 && tracks.map((track, index) => {
                    return index < limit && <div key={track.id} ref={ref => { finalTrackRefs.current[index] = ref }} className="w-max group rounded-xl p-2 pr-8  cursor-pointer hover:shadow-xl hover:bg-red-200/10 transition-all duration-100 ease-in-out">
                        <a href={track.external_urls.spotify} target='_blank' className="flex gap-4 items-center ">
                            <div>
                                <img id={index.toString()} src={track.album.images[0].url} alt={track.name} className="w-24 rounded-lg" />
                            </div>

                            <div className="flex flex-col justify-center">
                                <p className="font-bold text-xl italic group-hover:text-2xl transition-all duration-100 ease-in-out">{track.name}</p>
                                <p className="font-thin text-xl group-hover:text-2xl transition-all duration-100 ease-in-out">{track.artists[0].name}</p>
                            </div>
                        </a>
                    </div>
                })}
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