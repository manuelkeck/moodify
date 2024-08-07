import React, { useState, useEffect } from 'react';
import SDSComponent from "@/components/sds-component";
import Image from "next/image";
import Link from "next/link";

const VoiceAssistant = () => {
    const [isWideScreen, setIsWideScreen] = useState(false);

    useEffect(() => {
        if (window.innerWidth > 1024) {
            setIsWideScreen(true);
        }
    }, []);

    if (!isWideScreen) {
        return (
            <div>
                <div
                    className="text-gray-300 flex flex-col items-center justify-center text-center"
                    style={{pointerEvents: 'none'}}>

                    <p>Native screen resolution of at least </p>
                    <p>1024x762 px needed.</p>
                    <p className="pt-10">Switch to a desktop device to continue.</p>
                    <Image
                        className="mt-10 animate-pulse"
                        src="/icons8-enlarge-100.png"
                        alt="Arrow icon"
                        width={45}
                        height={45}
                    />
                </div>
                <div className="flex justify-center">
                    <div
                        className="transition duration-150 w-40 text-center text-base ease-in-out mt-10 bg-stone-600 hover:bg-stone-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                        <Link href="/spotify-authorized/user/authorized">Go Back</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <SDSComponent/>
    );
}

export default VoiceAssistant;
