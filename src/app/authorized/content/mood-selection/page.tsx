'use client';

import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import MoodComponent from "@/app/authorized/content/components/mood-component";
import RecommendationComponent from "@/app/authorized/content/components/recommendation-component";

const MoodSelectionPage: React.FC = () => {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState("");

    const [cookies] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        // setSpotifyToken(cookies.spotifyToken || "");
        if (cookies.user === "user") {
            setName(cookies.user || "unknown user");
        } else {
            setName(cookies.user);
        }

    }, [cookies.spotifyToken, cookies.user]);

    const handleMoodChange = (option: string) => {
        if (selectedMood === option) {
            setSelectedMood("");
        } else {
            setSelectedMood(option);
        }
    }

    return (
        <div className="text-center items-center justify-center w-full">
            <div className="flex-col justify-center text-center items-center text-white">
                <div className="">
                    <div className="flex justify-center items-center text-2xl font-extralight">
                        <div>
                            <p className="lg:text-4xl">Hi {name}!</p>
                            <div className="mt-10 mb-20">
                                <MoodComponent onMoodClick={handleMoodChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <RecommendationComponent selectedValue={selectedMood}/>
            </div>
        </div>

    )
}

export default MoodSelectionPage;