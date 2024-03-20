'use client';

import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import MoodComponent from "@/app/authorized/content/components/mood-component";
import RecommendationComponent from "@/app/authorized/content/components/recommendation-component";
import ErrorBoundary from "@/app/authorized/content/components/ErrorBoundary";

interface MoodTuple {
    current: string;
    target: string;
}

const MoodSelectionPage: React.FC = () => {
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState<MoodTuple>({current: "", target: ""});
    const [showPopup, setShowPopup] = useState(false);

    const [cookies, removeCookie] = useCookies();

    useEffect(() => {
        if (cookies.user === "user") {
            setName(cookies.user || "unknown user");
        } else if (!cookies.user || cookies.user === "") {
            handleSessionExpired();
        } else {
            setName(cookies.user);
        }

    }, [cookies.spotifyToken, cookies.user]);


    const handleCurrentMoodChanged = (current: string) => {
        // Set or reset current mood selection
        if (current === selectedMood.current) {
            setSelectedMood({current: "", target: ""});
        }
        else {
            setSelectedMood({current: current, target: ""});
        }
    }

    const handleTargetMoodClick = (target: string) => {
        // Set or reset target mood selection
        if (target === selectedMood.target) {
            setSelectedMood({...selectedMood, target: ""});
        }
        else {
            setSelectedMood({...selectedMood, target: target});
        }
    }

    const handleSessionExpired = () => {
        if (!showPopup) {
            setShowPopup(true);
            removeCookie('spotifyToken', { path: '/' });
        }
    };

    const onPopupClose = () => {
        setShowPopup(false);
    }

    return (
        <ErrorBoundary>
            <div className="text-center items-center justify-center w-full">
                <div className="flex-col justify-center text-center items-center text-white">
                    <div className="">
                        <div className="flex justify-center items-center text-2xl font-light">
                            <div>
                                <p className="lg:text-4xl">Hi {name}!</p>
                                <div className="mb-20">
                                    <MoodComponent
                                        onCurrentMoodClick={handleCurrentMoodChanged}
                                        onTargetMoodClick={handleTargetMoodClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div>*/}
                {/*    <Script src="https://sdk.scdn.co/spotify-player.js" defer></Script>*/}
                {/*    <PlayerComponent token={cookies.spotifyToken}/>*/}
                {/*</div>*/}
                <div className="w-full">
                    <RecommendationComponent selectedValue={selectedMood}/>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default MoodSelectionPage;