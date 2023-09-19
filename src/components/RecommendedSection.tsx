import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getRecommendations } from '../api/spotifyQueries'
import { useGlobalState } from '../context/globalState'
import gsap from 'gsap'
import { getTopKeys } from '../utils/helpers'
import { Artist, RecommendationObject, Track } from '../types/spotifyTypes'

export default function RecommendedSection() {
    const { data } = useGlobalState()
    const [recs, setRecs] = useState<Track[]>([])

    const comp = useRef(null)
    const wrapperRef = useRef(null)
    const vinylWrapperRef = useRef(null)
    const spacer = useRef<HTMLDivElement | null>(null)
    const vinylDiv = useRef<HTMLDivElement | null>(null)
    const vinylImg = useRef<HTMLImageElement | null>(null)
    const vinylTitle = useRef<SVGSVGElement | null>(null)
    const recTrackRefs = useRef<Array<HTMLDivElement | null>>([])

    const handleGetRecs = () => {
        let seed_artists
        let seed_genres
        let seed_tracks

        if (data.artists.length < 1) {
            seed_tracks = data.tracks.reduce((prev: string[], track: Track) => [...prev, track.id], [])
        } else {
            seed_artists = data.artists.reduce((prev: string[], artist: Artist) => [...prev, artist.id], [])
            seed_genres = getTopKeys(data.artists, 5, 'genres')
        }

        getRecommendations(seed_artists ? seed_artists.slice(0, 3) : [],
            seed_genres ? seed_genres.slice(0, 2) : [],
            seed_tracks ? seed_tracks.slice(0, 5) : []).then((data: RecommendationObject) => setRecs(data.tracks.slice(0, 10)))
    }

    useEffect(() => {
        handleGetRecs()
    }, [data])

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // Section pinning
            gsap.to(vinylDiv.current, {
                scrollTrigger: {
                    trigger: vinylDiv.current,
                    start: 'top top',
                    endTrigger: recTrackRefs.current[recTrackRefs.current.length - 1],
                    end: 'bottom top',
                    pinSpacing: true,
                    pin: vinylWrapperRef.current,

                }
            })

            // Vinyl text rotation
            gsap.to(vinylTitle.current, {
                rotate: '-720',
                ease: 'linear',
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            })

            // Vinyl image rotation
            gsap.to(vinylImg.current, {
                rotate: '40',
                ease: 'linear',
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            })

            // Vinyl image rotation
            gsap.fromTo('#shadowColour',
                {
                    rotate: '45',
                },
                {
                    rotate: '-45',
                    ease: 'linear',
                    scrollTrigger: {
                        trigger: wrapperRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                })

            // Scroll trigger for final track list
            recTrackRefs.current.forEach(element => {
                gsap.fromTo(element,
                    {
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                        scrollTrigger: {
                            trigger: element,
                            start: 'center 45%',
                            end: `center 35%`,
                            scrub: true,
                        },
                    })
            })

        }, comp)

        return () => {
            ctx.revert()
        }
    }, [data, recs])


    const handlePlayClick = (event: React.MouseEvent, id: string) => {
        const track = recs.find(track => track.id === id)!

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
        <section ref={comp} >
            <div className="absolute w-screen z-10">
                <div className="w-screen flex justify-center mt-20">
                    <div className="w-fit text-4xl font-serif bg-white rounded-xl p-2 sm:p-4 drop-shadow-lg">Music recommendations</div>
                </div>
            </div>


            <div ref={wrapperRef} className='flex'>

                <div ref={vinylWrapperRef} className='flex bg-orange-400'>

                    <div className='w-screen'>
                        <div className='flex justify-center h-screen items-center relative overflow-hidden pt-[20vh]' ref={vinylDiv}>
                            <div id='shadowColour' className='bg-orange-600 w-screen absolute h-[70vh] left-1/2 origin-left'></div>

                            <img src='/assets/images/vinyl.png' ref={vinylImg} id='vinyl' className='h-[70vh] w-[70vh] rotate-[-20deg]'></img>

                            <div>
                                <svg viewBox="0 0 100 100" ref={vinylTitle} className='absolute mt-[10vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[0.3]'><defs><path id="circle" d="M 50, 50m -37, 0a 37,37 0 1,1 74,0a 37,37 0 1,1 -74,0" /></defs><text><textPath xlinkHref="#circle" className='fill-red-800'>music recommendations</textPath></text></svg>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='absolute translate-y-1/2'>
                    <div className='flex flex-col justify-center items-center gap-4 w-screen' ref={spacer}>
                        {recs.length && recs.map((track, index) => {
                            return (
                                <div
                                    ref={ref => { recTrackRefs.current[index] = ref }}
                                    key={track.id}
                                    className="w-max shadow-xl group rounded-xl p-2 pr-8 hover:shadow-2xl hover:bg-fuchsia-200 transition-all duration-75 ease-in-out bg-blue-300 z-10">
                                    <div className="flex gap-4 items-center ">

                                        <div>
                                            <img id={index.toString()} src={track.album.images[2].url} alt={track.name} className="w-20 h-20 rounded-lg" />
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <p className="font-bold text-lg sm:text-xl italic transition-all duration-100 ease-in-out">{track.name}</p>
                                            <p className="font-thin text-lg sm:text-xl transition-all duration-100 ease-in-out">{track.artists[0].name}</p>
                                        </div>

                                        <div className="">
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
                </div>
            </div>
        </section>
    )
}
