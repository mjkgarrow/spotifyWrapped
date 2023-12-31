import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
    labels: { title: string, x: string[], y: string[], info: string }
    topTracks: TopTracksType[],
    graphType: string,
}

export const DensityChart = ({ data, domain, colours, labels, topTracks, graphType }: DensityChartProps) => {
    // Constants for image sizing
    const imageSize = 60

    // Refs for GSAP to access
    const container = useRef<HTMLDivElement | null>(null)
    const line = useRef<SVGPathElement | null>(null)
    const line2 = useRef<SVGPathElement | null>(null)
    const graphPic = useRef<SVGSVGElement | null>(null)

    const [prog, setProg] = useState<number>(0);
    const [screenSize, setScreenSize] = useState<number[]>([window.innerWidth * 0.8, window.innerHeight * 0.5]);


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

    }, [data]);

    // Compute kernel density estimation
    const density = useMemo(() => {
        const kde = kernelDensityEstimator(
            kernelEpanechnikov(5),
            xScale.ticks(50)
        )

        return kde(data)

    }, [xScale]);

    // Compute y-axis scale
    const yScale = useMemo(() => {
        const max = Math.max(...density.map((d) => d[1]!))
        const min = Math.min(...density.map((d) => d[1]!))

        return d3.scaleLinear()
            .range([screenSize[1] - 10, 50])
            .domain([min, max])

    }, [data])

    // Generate x-axis labels
    // @ts-ignore
    const xAxis = (g) => {
        g.attr("class", "x-label")
            .attr("transform", `translate(0,${screenSize[1] + 10})`)
            .call(d3.axisBottom(xScale))
    }

    // Compute path
    const path = useMemo(() => {
        const lineGenerator = d3
            .line()
            .x((d: number[]) => xScale(d[0]))
            .y((d: number[]) => yScale(d[1]))
            .curve(d3.curveBasis)

        return lineGenerator(density as [number, number][] | Iterable<[number, number]>)

    }, [density])
    // -----------------------------------------


    // Add x-axis labels and top tracks to svg
    useEffect(() => {
        const svgElement = d3.select(graphPic.current)

        svgElement.selectAll(".y-label").remove()
        svgElement.selectAll(".x-label").remove()

        svgElement.append('g').call(xAxis)

        svgElement.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", screenSize[1] * 0.05)
            .attr("y", screenSize[1] * 0.05)
            .style('font-weight', '300')
            .text(labels.y[0])

        svgElement.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", screenSize[1] * 0.05)
            .attr("y", screenSize[1] - (screenSize[1] * 0.05))
            .style('font-weight', '300')
            .text(labels.y[1]);

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
                    .style('opacity', '0')

                foreignObject.append('xhtml:span')
                    .text(`${track.artists[0].name}: ${track.name}`)

                const imageContainer = foreignObject.append('xhtml:div')
                    .style('width', '100%')
                    .style('height', '100%')
                    .style('transform', 'scale(1)') // Set the initial scale
                    .style('transition', 'transform 0.1s ease') // Add a smooth transition effect

                const anchor = imageContainer.append('xhtml:a')
                    .attr('href', track.external_urls.spotify)
                    .attr('target', '_blank')

                anchor.append('xhtml:img')
                    .attr('src', track.album.images[2].url)
                    .style('width', '100%')
                    .style('height', '100%')

            });
        }

        requestAnimationFrame(trackAnimation)

    }, [])

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

                    let opacity

                    if (lineXCoord - threshold > 0) {
                        const opacityPct = ((lineXCoord - threshold) / (xCoord - threshold))
                        opacity = xCoord < lineXCoord ? 1 : opacityPct;
                    } else {
                        opacity = 0
                    }

                    // @ts-ignore
                    d3.select(this).attr("style", `opacity: ${opacity}`);
                });
        }

        requestAnimationFrame(animateLineWithTopTracks)

    }, [prog, screenSize])

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
        }, container)

        return () => ctx.revert()
    }, [data])

    return (
        <div className="h-screen w-screen flex items-center flex-col justify-center" ref={container}>
            <p className="text-4xl p-4 bg-white shadow-2xl rounded-xl mb-8">{labels.title}</p>

            <div className="rounded-lg shadow-2xl p-4 mb-4" style={{ backgroundColor: colours[0] }}>
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
            <p className="font-semibold text-center px-4">{labels.info}</p>
        </div>
    )
}
