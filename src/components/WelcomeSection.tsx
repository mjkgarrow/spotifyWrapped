import { gsap } from "gsap"
import { useEffect, useRef } from "react"


export default function WelcomeSection() {
    const comp = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('#arrow', { duration: 0.6, y: 20, ease: "circ.in", repeat: -1, yoyo: true });

            gsap.to('#welcome-pattern', {
                scrollTrigger: {
                    trigger: '#welcome-pattern',
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                }
            })
        }, comp)

        return () => ctx.revert()
    }, []);

    return (
        <section ref={comp}>
            <div id='welcome-pattern' className="w-screen h-screen flex flex-col justify-center items-center -z-10">
                <div className="bg-white p-4 rounded-3xl drop-shadow-xl">
                    <h1 className="text-2xl sm:text-4xl font-bold text-center">Scroll to view your wrap</h1>
                    <div className="w-full flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" id='arrow' height="60px" width="60px" viewBox="0 0 384 512" className="bg-white w-14 h-14 rounded-full p-2 top-12 absolute fill-purple-500"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" /></svg>
                    </div>
                </div>
            </div>
        </section>
    )
}