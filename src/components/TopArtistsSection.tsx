import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap"
import { Artist } from "../types/spotifyTypes";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { colours } from "../utils/globals";

type props = {
    artists: Artist[]
}

export default function TopArtistsSection(props: props) {
    const { artists } = props

    const comp = useRef(null)
    const wrapperRef = useRef(null)
    window.innerWidth

    const finalTrackRefs = useRef<Array<HTMLAnchorElement | null>>([])

    useLayoutEffect(() => {

        const ctx = gsap.context(() => {
            let sections = gsap.utils.toArray(".panel");

            // Side scroll animation 
            let scrollTween = gsap.to(sections, {
                x: (i) => -window.innerWidth * i,
                // xPercent: (i) => -100 * i,
                duration: (i) => 0.01 * i,
                ease: "none", // <-- IMPORTANT!
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    pin: true,
                    scrub: 0.1,
                    end: `+=${window.innerWidth * sections.length} bottom`,
                    // onRefresh: () => ScrollTrigger.refresh(true)
                }
            });

            // Add a scrolltrigger for the animation to each panel
            sections.forEach((panel) => {
                ScrollTrigger.create({
                    trigger: panel as HTMLElement,
                    containerAnimation: scrollTween,
                    start: "left left",
                    // onRefresh: () => ScrollTrigger.refresh(true)
                });
            });

            // Scroll trigger for final track list
            finalTrackRefs.current.forEach(element => {
                if (element) {
                    gsap.fromTo(element, { autoAlpha: 0 }, {
                        autoAlpha: 1,
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 80%',
                            end: 'bottom 60%',
                            scrub: true,
                            // onRefresh: () => ScrollTrigger.refresh(true)
                        },
                    })
                }
            });
        }, comp)

        return () => {
            ctx.revert()
        }

    }, [artists]);


    return (
        <section ref={comp} className="shadow-2xl">

            {/* Main artists reveal */}
            <div ref={wrapperRef} className="bg-purple-400">

                <div className="absolute w-screen z-10">
                    <div className="w-screen flex justify-center mt-32">
                        <div className="w-fit text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your fave artists</div>
                    </div>
                </div>


                <div className="flex w-fit overflow-hidden">
                    <div className="panel w-screen"></div>

                    {artists.length > 0 && artists.map((artist, index) => {

                        return (
                            <div
                                key={artist.id}
                                className='panel h-screen pt-[10vh] w-screen shadow-2xl flex gap-4 justify-center items-center flex-col'

                                style={{ backgroundColor: `${colours[index]}` }}>

                                <p className="font-mono text-2xl sm:text-6xl w-6 sm:w-14 text-right">#{index + 1}</p>

                                <div>

                                    <img id={index.toString()} src={artist.images[1].url} alt={artist.name} className="w-72 h-7w-72 sm:w-80 sm:h-80 rounded-lg absolute blur-lg scale-[1.01] -z-10" />

                                    <img id={index.toString()} src={artist.images[1].url} alt={artist.name} className="w-72 h-7w-72 sm:h-80 sm:w-80 rounded-lg" />

                                </div>

                                <div className="flex flex-col justify-center min-w-max">
                                    <p className="font-bold text-2xl sm:text-5xl italic">{artist.name}</p>
                                </div>

                            </div>

                        )
                    })}
                </div>
            </div>

            {/* Final artists list */}
            <div className='flex justify-around'
                style={{ backgroundColor: `${colours[artists.length - 1]}` }}>
                <div className='flex flex-col gap-4 pb-[50vh]'>

                    {artists.map((artist, index) => {
                        return (
                            <a
                                href={artist.external_urls.spotify} target='_blank'
                                key={artist.id}
                                ref={ref => { finalTrackRefs.current[index] = ref }}
                                className="shadow-xl group rounded-xl p-2 pr-8 hover:shadow-2xl hover:bg-green-200/30 transition-all duration-75 ease-in-out">
                                <div className="flex gap-4 items-center">
                                    <div>
                                        <img id={index.toString()} src={artist.images[2].url} alt={artist.name} className="w-20 h-20 rounded-lg" />
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-xl italic">{artist.name}</p>
                                    </div>

                                    <div className="ml-auto">
                                        <img src='/assets/images/Spotify-Icon-png-rgb-black.png' className='w-8' alt='spotify logo'></img>
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}