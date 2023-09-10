import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap"
import { Artist } from "../types/spotifyTypes";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { colours } from "../utils/globals";

type props = {
    artists: Artist[],
    limit: number
}

export default function TopArtistsSection(props: props) {
    const { artists, limit } = props

    const wrapperRef = useRef(null)
    const finalTrackRefs = useRef<Array<HTMLDivElement | null>>([])

    // const artistRefs = useRef<Array<HTMLDivElement | null>>([])

    useLayoutEffect(() => {
        ScrollTrigger.refresh()

        const ctx = gsap.context(() => {
            let sections = gsap.utils.toArray(".panel");

            // Side scroll animation 
            let scrollTween = gsap.to(sections, {
                xPercent: (i) => -100 * i,
                duration: (i) => 0.5 * i,
                ease: "none", // <-- IMPORTANT!
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: true,
                    scrub: 0.1,
                    end: `+=${window.innerWidth * sections.length} bottom`,
                }
            });

            // Add a scrolltrigger for the animation to each panel
            sections.forEach((panel) => {
                ScrollTrigger.create({
                    trigger: panel as HTMLElement,
                    containerAnimation: scrollTween,
                    start: "left left",
                });
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
        })

        return () => ctx.revert()
    }, [artists]);


    return (
        <section className="shadow-2xl">

            {/* Main artists reveal */}
            <div ref={wrapperRef} className="bg-purple-400">

                <div className="absolute top-[10vh] w-screen z-10">
                    <div className="w-screen flex justify-center">
                        <div className="w-fit text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your fave artists</div>
                    </div>
                </div>


                <div className="flex w-fit overflow-hidden">
                    <div className="panel w-screen"></div>

                    {artists.length > 0 && artists.map((artist, index) => {

                        return index < limit && (
                            <div
                                key={artist.id}
                                className='panel h-screen w-screen shadow-2xl flex gap-4 justify-center items-center flex-col'

                                style={{ backgroundColor: `${colours[index]}` }}>

                                <p className="text-2xl sm:text-6xl w-6 sm:w-14 text-right">#{index + 1}</p>

                                <div>

                                    <img id={index.toString()} src={artist.images[0].url} alt={artist.name} className="w-16 sm:w-96 rounded-lg absolute blur-lg scale-[1.01] -z-10" />

                                    <img id={index.toString()} src={artist.images[0].url} alt={artist.name} className="w-16 sm:w-96 rounded-lg " />

                                </div>

                                <div className="flex flex-col justify-center min-w-max">
                                    <p className="font-bold sm:text-5xl italic">{artist.name}</p>
                                </div>

                            </div>

                        )
                    })}
                </div>

            </div>

            {/* Final artists list */}
            {artists.length > 0 && (
                <div className='sm:flex sm:flex-col sm:gap-4 sm:w-full sm:pl-[40vw] pb-24'
                    style={{ backgroundColor: `${colours[limit - 1]}` }}>
                    {artists.length > 0 && artists.map((artist, index) => {
                        return index < limit && (
                            <div
                                key={artist.id}
                                ref={ref => { finalTrackRefs.current[index] = ref }}
                                className="w-max group rounded-xl p-2 pr-8  cursor-pointer hover:shadow-xl hover:bg-red-200/10 transition-all duration-75 ease-in-out">
                                <a href={artist.external_urls.spotify} target='_blank' className="flex gap-4 items-center ">
                                    <div>
                                        <img id={index.toString()} src={artist.images[0].url} alt={artist.name} className="w-24 rounded-lg" />
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-xl italic group-hover:text-2xl transition-all duration-75 ease-in-out">{artist.name}</p>

                                    </div>
                                </a>
                            </div>
                        )
                    })}
                </div>
            )}

        </section>
    )
}