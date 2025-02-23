import { PopupContainer, usePopup } from "@/Popup";
import { Head } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";

type BaseProps = PropsWithChildren<{
    className?: string;
    promptIntializeMusic?: boolean
}>;

export default function Base({ className, children, promptIntializeMusic }: BaseProps) {
    const { showPopup } = usePopup();

    useEffect(() => {
        console.log('Shoud I prompt?', promptIntializeMusic);
        if(promptIntializeMusic) showPopup('prompt-audio', { title: 'Do you want audio?', showExit: false, denyExit: true });
    }, []);

    return (
        <div className="w-screen h-screen bg-backdrop relative overflow-hidden animate-show">
            <Head>
                <link rel="prefetch" as="image" href="/ui-backdrop/noise.jpg"/>
                <link rel="prefetch" href="/audio/play.wav"/>
            </Head>

            <PopupContainer />

            <div className="absolute z-50 w-screen h-screen pointer-events-none bg-[url('/ui-backdrop/noise.jpg')] opacity-[4%] scale-105 animate-noise"></div>
            <div className="absolute z-50 w-screen h-screen pointer-events-none bg-[url('/ui-backdrop/noise.jpg')] opacity-[9%] scale-105 animate-noise-alt"></div>
            <div className={`relative z-10 w-screen h-screen text-custom-gray-400 font-bold ${className}`}>
                { children }
            </div>

            <div className="fixed inset-0">
                <div>
                    <div className="absolute top-[10%] left-[20%] w-[2px] h-[2px] rounded-full bg-white animate-star-slow"></div>
                    <div className="absolute top-[25%] left-[10%] w-[3px] h-[3px] rounded-full bg-white animate-star"></div>
                    <div className="absolute top-[30%] left-[40%] w-[2px] h-[2px] rounded-full bg-white animate-star-fast"></div>
                    <div className="absolute top-[32%] left-[41%] w-[2px] h-[2px] rounded-full bg-white animate-star-slow"></div>
                    <div className="absolute top-[5%] right-[30%] w-[4px] h-[4px] rounded-full bg-white animate-star"></div>
                    <div className="absolute top-[15%] right-[15%] w-[1px] h-[1px] rounded-full bg-white animate-star-slower"></div>
                </div>

                <img src="/ui-backdrop/nebula.svg" className="absolute w-[4000px] -bottom-[22%] -left-[10%]" />
                <img src="/ui-backdrop/nebula-side.svg" className="absolute w-2/3 bottom-[22%] -right-[20%]" />
                <img src="/ui-backdrop/rock-formation.svg" className="absolute w-1/2 bottom-0 -right-[30px] animate-ground-hover" />
                <img src="/ui-backdrop/asteroid.svg" className="absolute w-[200px] bottom-[60%] right-[10%] animate-asteroid-hover" />
                <img src="/ui-backdrop/asteroid.svg" className="absolute w-[50px] opacity-80 bottom-[60%] left-[10%] animate-asteroid-hover2" />

                <img src="/ui-backdrop/asteroid.svg" className="absolute w-[10px] opacity-40 top-[25%] left-[20%] animate-asteroid-hover2" />
            </div>
        </div>
    );
}
