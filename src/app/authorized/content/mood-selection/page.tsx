'use client';

import { useSearchParams } from 'next/navigation'
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import {cookies} from "next/headers";

export default function MoodSelectionPage() {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");

    const [cookies] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");
        setName(cookies.user || "unknown user")
    }, [cookies.spotifyToken, cookies.user]);

    return (
        <div className="pt-56 flex justify-center items-center text-white bg-black w-full">
            <div className="w-1/3 p-4">
                <div className="flex flex-col justify-center items-center text-4xl font-extralight">
                    <div>
                        <p className="text-left">Hi {name}!</p>
                        <p className="text-left">How are you today?</p>
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-4">
                <div className="flex flex-col justify-center items-center">
                    <p className="text-left">Mood selection</p>
                    <p className="text-left">[Integrate list here]</p>
                </div>
            </div>
        </div>
    )
}