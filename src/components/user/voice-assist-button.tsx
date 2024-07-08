import React from "react";
import {router} from "next/client";
import Link from "next/link";

const VoiceAssistButton = () => {

    return (
        <div className="flex justify-center">
            <div className="transition duration-150 w-40 text-center text-base ease-in-out mt-10 bg-stone-800 hover:bg-stone-900 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                <Link href="/spotify-authorized/voice-assistant">🎙️Voice Assist</Link>
            </div>
        </div>
    )
}

export default VoiceAssistButton