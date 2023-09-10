import { gsap } from "gsap"
import { useLayoutEffect } from "react"


export default function WelcomeSection() {

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('#welcome-pattern', {
                scrollTrigger: {
                    trigger: '#welcome-pattern',
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                }
            })
        })

        return () => ctx.revert()
    }, []);


    return (
        <div id='welcome-pattern' className="w-screen h-screen flex flex-col justify-center items-center -z-10">
            <div className="bg-white p-4 rounded-3xl drop-shadow-xl">
                <h1 className="text-4xl font-bold text-center mb-2">Scroll to view your wrap</h1>
            </div>
        </div>
    )
}