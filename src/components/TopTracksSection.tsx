import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap"
import { Track } from "../types/spotifyTypes";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { colours } from "../utils/globals";

type props = {
    tracks: Track[],
    limit: number
}

export default function TopTracksSection(props: props) {
    const { tracks, limit } = props
    const comp = useRef()

    const wrapperRef = useRef(null)
    const rightRef = useRef(null)
    const leftRef = useRef(null)

    const trackRefs = useRef<Array<HTMLDivElement | null>>([])
    const finalTrackRefs = useRef<Array<HTMLDivElement | null>>([])
    const spacerRefs = useRef<Array<HTMLDivElement | null>>([])

    useLayoutEffect(() => {

        ScrollTrigger.refresh()

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
                }
            })

            // // Scroll trigger for background colour
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top", // Start the animation at the top of the element
                    end: "bottom bottom", // End the animation at the bottom of the element
                    scrub: true,
                },
            });

            colours.forEach((color, index) => {
                if (index >= limit && index < limit * 2) {
                    console.log(index)
                    timeline.to(wrapperRef.current, {
                        backgroundColor: color,
                    });
                }
            });

            // Scroll trigger for final track list
            finalTrackRefs.current.forEach(element => {
                gsap.fromTo(element, { opacity: 0 }, {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        end: 'bottom 60%',
                        scrub: true,
                    },
                })
            });
        }, comp)

        return () => ctx.revert()
    }, [tracks]);


    return (
        <section>

            {/* Main track reveal */}
            <div ref={wrapperRef} className="flex flex-col sm:flex-row bg-[#e4c1f9]">
                <div ref={leftRef} className="h-fit py-10 sm:h-screen sm:w-2/5 pl-2 flex items-center justify-end">
                    <div className="sm:w-max text-lg sm:text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your top songs</div>
                </div>


                <div ref={rightRef} className="w-3/5 sm:pt-[100vh] pb-[30vh] pl-2 sm:pl-4 ">

                    {tracks.length > 0 && tracks.map((track, index) => {
                        return index < limit && (
                            <div ref={el => spacerRefs.current[index] = el} key={track.id}>
                                <div className="flex gap-4 items-center" ref={el => trackRefs.current[index] = el}>
                                    <p className="text-2xl sm:text-4xl w-6 sm:w-14 text-right">{index + 1}</p>

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
            <div className='sm:flex sm:flex-col sm:gap-4 sm:w-full sm:pl-[40vw] bg-[#9F6FE2] pb-24'>
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