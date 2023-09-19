import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap"
import { Track } from "../types/spotifyTypes";
import { colours } from "../utils/globals";

type props = {
    tracks: Track[],
}

export default function TopTracksSection(props: props) {
    const { tracks } = props
    const comp = useRef(null)

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

                // Add fade-in-out effect
                gsap.timeline({
                    scrollTrigger: {
                        trigger: spacerRefs.current[index],
                        start: 'top 90%',
                        end: 'bottom top',
                        scrub: true,
                    },
                })
                    .from(element, {
                        autoAlpha: 0,
                    })
                    .to(element, {
                        autoAlpha: 1,
                    })
                    .to(element, {
                        autoAlpha: 0,
                    })

            })

            // Scroll trigger for left title, start on first track end on last track
            gsap.to(wrapperRef.current, {
                scrollTrigger: {
                    trigger: rightRef.current,
                    start: "top top",
                    endTrigger: spacerRefs.current[spacerRefs.current.length - 1],
                    end: `${trackRefs.current[trackRefs.current.length - 1]?.clientHeight} top`,
                    pin: leftRef.current,
                }
            })

            // Scroll trigger for left title fade, only trigger on final element
            gsap.fromTo(leftRef.current, { autoAlpha: 1 }, {
                autoAlpha: 0,
                scrollTrigger: {
                    trigger: spacerRefs.current[spacerRefs.current.length - 1],
                    start: "top top",
                    scrub: true,
                    endTrigger: spacerRefs.current[spacerRefs.current.length - 1],
                }
            })

            // // Scroll trigger for background colour
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                },
            });

            colours.forEach((color, index) => {
                if (index >= tracks.length && index < tracks.length * 2) {
                    timeline.to(wrapperRef.current, {
                        backgroundColor: color,
                    });
                }
            });

            // Scroll trigger for final track list
            finalTrackRefs.current.forEach(element => {
                gsap.fromTo(element, { autoAlpha: 0 }, {
                    autoAlpha: 1,
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

    const handlePlayClick = (event: React.MouseEvent, id: string) => {
        const track = tracks.find(track => track.id === id)!

        if (track.preview_url) {
            event.preventDefault()
            const playIcon = document.getElementById(`play-${track.id}`)!
            const audio: HTMLAudioElement = document.getElementById(`audio-${track.id}`) as HTMLAudioElement

            audio.volume = 0.1

            // Add event listeners to track audio state changes
            audio.addEventListener("play", () => {
                playIcon.classList.add("animate-spin");
            });

            audio.addEventListener("pause", () => {
                playIcon.classList.remove("animate-spin");
            });

            // Toggle play/pause
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    }

    return (
        <section ref={comp}>

            {/* Main track reveal */}
            <div ref={wrapperRef} className="flex flex-col sm:flex-row bg-[#e4c1f9]">

                <div ref={leftRef} className="absolute pt-[10vh] z-10 sm:pt-0 w-screen sm:static sm:top-0 sm:h-screen sm:w-2/5 pl-2 flex items-center justify-center sm:justify-end">
                    <div className="sm:w-max text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Your top songs</div>
                </div>


                <div ref={rightRef} className="w-3/5 pt-[100vh] pb-[30vh] pl-4">

                    {tracks.length > 0 && tracks.map((track, index) => {
                        return (
                            <div ref={el => spacerRefs.current[index] = el} key={track.id} className="w-max">
                                <div className="flex gap-4 items-center" ref={el => trackRefs.current[index] = el}>
                                    <p className="text-2xl sm:text-4xl w-full sm:w-14 text-right font-mono">#{index + 1}</p>

                                    <img id={index.toString()} src={track.album.images[1].url} alt={track.name} className="h-24 w-24 sm:h-32 sm:w-32 rounded-lg drop-shadow-2xl" />

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
            <div className='flex bg-[#9F6FE2] justify-around'>
                <div className='flex flex-col gap-4'>

                    {tracks.map((track, index) => {
                        return (
                            <div
                                ref={ref => { finalTrackRefs.current[index] = ref }}
                                key={track.id}
                                className="shadow-xl group rounded-xl p-2 pr-8 hover:shadow-2xl hover:bg-green-200/30 transition-all duration-75 ease-in-out">
                                <div className="flex gap-4 items-center ">

                                    <div>
                                        <img id={index.toString()} src={track.album.images[2].url} alt={track.name} className="w-20 h-20 rounded-lg" />
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-lg sm:text-xl italic transition-all duration-100 ease-in-out">{track.name}</p>
                                        <p className="font-thin text-lg sm:text-xl transition-all duration-100 ease-in-out">{track.artists[0].name}</p>
                                    </div>

                                    <div className="ml-auto">
                                        <div className='flex gap-2'>
                                            <audio id={`audio-${track.id}`} src={track.preview_url!} data-wave-id={track.id} ></audio>

                                            {track.preview_url && (
                                                <svg onClick={(event) => handlePlayClick(event, track.id)} id={`play-${track.id}`} xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" className="hover:hover:opacity-50 cursor-pointer transition-all duration-100 ease-in-out"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" /></svg>
                                            )}
                                            <a href={track.external_urls.spotify} target='_blank'>
                                                <img src='/assets/images/Spotify-Icon-png-rgb-black.png' className='w-8 hover:opacity-50 transition-all duration-100 ease-in-out' alt='spotify logo'></img>
                                            </a>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div >
        </section>
    )
}
// <a
//     // href={track.external_urls.spotify}
//     href={`${track.preview_url ? '#' : track.external_urls.spotify}`}
//     target='_blank'
//     key={track.id}
//     ref={ref => { finalTrackRefs.current[index] = ref }}
//     onClick={(event) => handlePlayClick(event, track.id)}
//     className="shadow-xl group rounded-xl p-2 pr-8 hover:shadow-2xl hover:bg-green-200/30 transition-all duration-75 ease-in-out">
//     <div className="flex gap-4 items-center ">
//         <div>

//             <img id={index.toString()} src={track.album.images[2].url} alt={track.name} className="w-20 h-20 rounded-lg" />

//         </div>

//         <div className="flex flex-col justify-center">
//             <p className="font-bold text-lg sm:text-xl italic transition-all duration-100 ease-in-out">{track.name}</p>
//             <p className="font-thin text-lg sm:text-xl transition-all duration-100 ease-in-out">{track.artists[0].name}</p>
//         </div>

//         <div className="ml-auto">
//             {track.preview_url ? (
//                 <>
//                     <audio id={`audio-${track.id}`} src={track.preview_url!} data-wave-id={track.id} ></audio>

//                     <svg id={`play-${track.id}`} xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" className="transition-transform duration-100 ease-in-out"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" /></svg>
//                 </>
//             ) :
//                 <img src='/assets/images/Spotify-Icon-png-rgb-black.png' className='w-8' alt='spotify logo'></img>
//             }
//         </div>
//     </div>
// </a>