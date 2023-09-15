import { ChangeEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { kernelDensityEstimator, kernelEpanechnikov } from '../utils/helpers'
import gsap from "gsap";
import { AudioFeatures, Track } from "../types/spotifyTypes";
import * as d3 from "d3";
// @ts-ignore
import anime from 'animejs/lib/anime.es.js';
import { AnimeInstance } from "../types/animeJsTypes";

type TopTracksType = Track & AudioFeatures

type DensityChartProps = {
    width: number;
    height: number;
    data: number[];
    domain: number[],
    colours: string[],
    labels: { title: string, x: string[], y: string[] }
    topTracks: TopTracksType[],
    graphType: string,
}

export const DensityChart = ({ data, domain, colours, labels, topTracks, graphType }: DensityChartProps) => {
    // Constants for image sizing
    const imageSize = 70
    const borderRadius = 5


    // Refs for GSAP to access
    const container = useRef<HTMLDivElement | null>(null)
    const line = useRef<SVGPathElement | null>(null)
    const line2 = useRef<SVGPathElement | null>(null)
    const graphPic = useRef<SVGSVGElement | null>(null)

    const [rangeVal, setRangeVal] = useState<number>(7);
    const [prog, setProg] = useState<number>(0);
    const [screenSize, setScreenSize] = useState<number[]>([window.innerWidth * 0.8, window.innerHeight * 0.5]);


    const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setRangeVal(parseFloat(event.target.value));
    };

    const findY = (x: number): number => {
        const path = line.current;

        if (path) {
            const threshold = 0.01
            const pathLength = path.getTotalLength()
            const startPoint = path.getPointAtLength(0)
            const endPoint = path.getPointAtLength(pathLength)

            // Ensure x is within the path's x-coordinate range
            x = Math.max(startPoint.x, Math.min(x, endPoint.x))

            let start = 0
            let end = pathLength
            let target = (start + end) / 2

            // Walk along the path using binary search 
            // to locate the point with the supplied x value
            while (target >= start && target <= end) {
                const pos = path.getPointAtLength(target)

                if (Math.abs(pos.x - x) < threshold) {
                    return pos.y
                } else if (pos.x > x) {
                    end = target
                } else {
                    start = target
                }
                target = (start + end) / 2
            }
        }
        return 0
    }

    const getXCoord = (rawX: number): number => {
        return rawX * ((screenSize[0]) / domain[1])
    }

    const getLineXCoord = (svgAnim: AnimeInstance) => {
        const currentLineX = line.current!.getPointAtLength(Number(svgAnim.animations[0].currentValue.split('px')[0])).x
        return currentLineX
    }


    // ------- Functions to create graph -------
    // Compute x-axis scale
    const xScale = useMemo(() => {
        return d3
            .scaleLinear()
            .domain(domain)
            .range([5, screenSize[0] - 5])

    }, [data, rangeVal, screenSize]);

    // Compute kernel density estimation
    const density = useMemo(() => {
        const kde = kernelDensityEstimator(
            kernelEpanechnikov(rangeVal),
            xScale.ticks(100)
        )

        return kde(data)

    }, [xScale, rangeVal, screenSize]);

    // Compute y-axis scale
    const yScale = useMemo(() => {
        const max = Math.max(...density.map((d) => d[1]!))
        const min = Math.min(...density.map((d) => d[1]!))

        return d3.scaleLinear()
            .range([screenSize[1] - 10, 50])
            .domain([min, max])

    }, [data, rangeVal, screenSize])

    // Compute path
    const path = useMemo(() => {
        const lineGenerator = d3
            .line()
            .x((d: number[]) => xScale(d[0]))
            .y((d: number[]) => yScale(d[1]))
            .curve(d3.curveBasis)

        return lineGenerator(density as [number, number][] | Iterable<[number, number]>)

    }, [density, rangeVal, screenSize])
    // -----------------------------------------


    // Add top tracks to svg
    useEffect(() => {
        const trackAnimation = () => {
            const svgElement = d3.select(graphPic.current)

            svgElement.selectAll(".topTrack-label").remove();

            topTracks.forEach((track) => {

                // Calculate the adjusted x and y coordinates for the center anchor point
                // @ts-ignore
                const x = getXCoord(track[graphType]) - imageSize / 2

                // @ts-ignore
                const y = findY(getXCoord(track[graphType])) - imageSize / 2

                const foreignObject = svgElement.append('foreignObject')
                    .attr("class", "topTrack-label")
                    .attr("x", x)
                    .attr("y", y - (screenSize[1] * 0.05))
                    .attr("width", imageSize)
                    .attr("height", imageSize)

                const imageContainer = foreignObject.append('xhtml:div')
                    .style('width', '100%')
                    .style('height', '100%')
                    .style('border-radius', `${borderRadius}px`)
                    .style('overflow', 'hidden')
                    .style('cursor', 'pointer') // Set cursor style to "pointer"
                    .style('transform', 'scale(1)') // Set the initial scale
                    .style('transition', 'transform 0.1s ease') // Add a smooth transition effect
                    // .style('transition', 'transform 0.1s ease') // Add a smooth transition effect
                    .on('mouseenter', () => { // Add mouseenter event listener for hover effect
                        imageContainer.style('transform', 'scale(0.9)'); // Scale up on hover
                    })
                    .on('mouseleave', () => { // Add mouseleave event listener for hover effect
                        imageContainer.style('transform', 'scale(1)'); // Reset scale on mouse leave
                    });

                imageContainer.append('xhtml:img')
                    .attr('src', track.album.images[0].url)
                    .style('width', '100%')
                    .style('height', '100%')

                // Create and append an audio element
                const audioElement = document.createElement('audio');
                audioElement.controls = false
                audioElement.volume = 0.1
                audioElement.preload = 'auto'
                audioElement.src = track.preview_url!

                // Initialize a variable to track the playback state
                let isPlaying = false;

                // Add an event listener to toggle play/pause when the link is clicked
                foreignObject.on('click', () => {
                    if (isPlaying) {
                        audioElement.pause(); // Pause the audio
                    } else {
                        audioElement.play(); // Play the audio
                    }

                    // Update the playback state
                    isPlaying = !isPlaying;
                });
            });
        }

        requestAnimationFrame(trackAnimation)

    }, [rangeVal, screenSize])

    // Add x-axis labels
    useEffect(() => {
        const svgElement = d3.select(graphPic.current)

        svgElement.selectAll(".x-label").remove();

        svgElement.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", screenSize[1] * 0.1)
            .attr("y", screenSize[1] + 10)
            .style('font-weight', '600')
            .text(labels.x[0])

        svgElement.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", screenSize[0] - (screenSize[1] * 0.1))
            .attr("y", screenSize[1] + 10)
            .style('font-weight', '600')
            .text(labels.x[1]);

        svgElement.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", 'middle')
            .attr("x", (screenSize[0] / 2))
            .attr("y", screenSize[1] + 10)
            .style('font-weight', '700')
            .text('<---  --->');

    }, [screenSize])

    // Handle window resizing
    useEffect(() => {
        const handleResize = () => {
            setScreenSize([window.innerWidth * 0.8, window.innerHeight * 0.5]);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [])

    // Update svg path and topTrack opacity when progress or range is updated
    useEffect(() => {

        // Pass this function to requestAnimationFrame for efficiency
        const animateLineWithTopTracks = () => {

            // Visible line
            let svgAnim = anime({
                targets: line.current,
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: "linear",
                duration: 1,
                direction: "alternate",
                autoplay: false,
            })
            svgAnim.seek(prog)

            // Second line path used to calculate the x-coordinate
            // I couldn't work out how to do it as the offset value was throwing the numbers out, so had to reverse it
            let svgAnim2 = anime({
                targets: line2.current,
                strokeDashoffset: [0, anime.setDashoffset],
                easing: "linear",
                duration: 1,
                direction: "alternate",
                autoplay: false,
            })
            svgAnim2.seek(prog)

            d3.select(graphPic.current).selectAll(".topTrack-label")
                // @ts-ignore
                .each(function (_, index: number) {
                    // @ts-ignore
                    const xCoord = getXCoord(topTracks[index][graphType]);
                    const lineXCoord = getLineXCoord(svgAnim2);
                    const threshold = xCoord - 10
                    // const threshold = xCoord - (screenSize[0] * 0.01)

                    const opacityPct = ((lineXCoord - threshold) / (xCoord - threshold))

                    const opacity = xCoord < lineXCoord ? 1 : opacityPct;

                    // @ts-ignore
                    d3.select(this).attr("style", `opacity: ${opacity}`);
                });
        }

        requestAnimationFrame(animateLineWithTopTracks)

    }, [rangeVal, prog, screenSize])

    // Apply GSAP animations to panels
    useLayoutEffect(() => {

        const ctx = gsap.context(() => {
            // Pin graph while path is animated
            gsap.to(graphPic.current, {
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top top',
                    end: 'bottom top',
                    pin: container.current,
                    onUpdate: self => {
                        // Update progress state to be used on animejs path
                        setProg(self.progress)
                    }
                }
            })
        })

        return () => ctx.revert()
    }, [data])

    return (
        <div className="h-screen w-screen flex items-center flex-col justify-center" ref={container}>
            <p className="text-4xl p-4 bg-white shadow-2xl rounded-xl mb-8">{labels.title}</p>

            <div className="rounded-lg shadow-2xl p-4" style={{ backgroundColor: colours[0] }}>
                <svg ref={graphPic} width={screenSize[0]} height={screenSize[1] + 20} className="overflow-visible">
                    <path
                        ref={line}
                        d={path!}
                        fill="none"
                        opacity={1}
                        stroke={`${colours[1]}`}
                        strokeWidth={10}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    <path
                        ref={line2}
                        d={path!}
                        fill="none"
                        opacity={0}
                    />
                </svg>
            </div>

            <input
                type="range"
                value={rangeVal}
                min={2}
                max={12}
                step={0.1}
                onChange={(event) => handleSliderChange(event)}
                className="mt-8 mb-2 w-1/5 h-2 bg-gray-500 outline-none opacity-[0.7] rounded-full transition-opacity duration-200 hover:opacity-100" id="myRange"></input>
            <p className="mb-4">Smoothing</p>
        </div>
    )
}
