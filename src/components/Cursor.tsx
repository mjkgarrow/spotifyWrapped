import gsap from 'gsap'
import { useEffect } from 'react'

export default function Cursor() {


    useEffect(() => {
        const body: HTMLElement | null = document.querySelector('body')
        const cursor: HTMLElement | null = document.querySelector('#cursor')

        const buttons: NodeListOf<HTMLElement> = document.querySelectorAll('button')
        const links: NodeListOf<HTMLElement> = document.querySelectorAll('a')


        const onMouseEnter = () => {
            gsap.to(cursor, { scale: 1.6, duration: 0.3 })
        }

        const onMouseLEave = () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 })
        }


        buttons.forEach(button => {
            // button.style.cursor = 'none'
            button.addEventListener('mouseenter', onMouseEnter)
            button.addEventListener('mouseleave', onMouseLEave)
        })

        links.forEach(link => {
            // link.style.cursor = 'none'
            link.addEventListener('mouseenter', onMouseEnter)
            link.addEventListener('mouseleave', onMouseLEave)
        })


        if (body) {
            body.style.cursor = 'none'
        }


        const updateCursor = (event: MouseEvent) => {
            const { clientX, clientY } = event

            gsap.to(cursor, {
                x: clientX,
                y: clientY,
                ease: "power3.out",
                duration: 0.3,
            })
        }

        window.addEventListener('mousemove', updateCursor)


        // Hide cursor on leave
        document.addEventListener('mouseleave', () => {
            cursor!.classList.remove('show')
            cursor!.classList.add('hide')
        })

        // Show cursor on enter
        document.addEventListener('mouseenter', () => {
            cursor!.classList.remove('hide')
            cursor!.classList.add('show')
        })

        return () => {

        };

    }, [])


    return (
        <div id='cursor' className='hidden sm:block fixed z-[9999] h-10 w-10 bg-white mix-blend-difference rounded-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-[250] ease-in-out'></div>
    )
}