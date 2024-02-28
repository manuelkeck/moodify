'use client';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import MusicRecommendation from "@/app/authorized/content/mood-selection/music-recommendation";
import MoodComponent from "@/app/authorized/content/mood-selection/mood-component";

export default function MoodSelectionPage() {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const [cookies] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");
        setName(cookies.user || "unknown user")
    }, [cookies.spotifyToken, cookies.user]);

    const handleCheckboxChange = (option: string) => {
        if (selectedMood === option) {
            setSelectedMood(null);
        } else {
            setSelectedMood(option);
            console.log(option);
        }
    }

    return (
        <div className="text-center items-center justify-center w-full">
            <div className="flex-col justify-center text-center items-center text-white">
                <div className="">
                    <div className="flex justify-center items-center text-4xl font-extralight">
                        <div>
                            <p className="">Hi {name}!</p>

                            <div className="mt-10 mb-20">
                                <p className="mb-10">How are you doing today?</p>
                                <MoodComponent />
                            </div>

                            <p className="">Here are your top artists!</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <MusicRecommendation />
            </div>
        </div>

    )
}