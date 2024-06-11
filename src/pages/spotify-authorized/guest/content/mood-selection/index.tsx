import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import MoodComponent from "@/components/guest/mood-component";
import RecommendationComponent from "@/components/guest/recommendation-component";
import ErrorBoundary from "@/components/guest/ErrorBoundary";

interface MoodTuple {
    current: string;
    target: string;
}

const MoodSelectionPage: React.FC = () => {
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState<MoodTuple>({current: "", target: ""});
    const [showPopup, setShowPopup] = useState(false);
    const [carToggle, setCarToggle] = useState(false);          // show toggle
    const [carModeToggle, setCarModeToggle] = useState(false)   // toggle value

    const [cookies, removeCookie] = useCookies();

    useEffect(() => {
        if (cookies.user === "user") {
            setName(cookies.user || "unknown user");
        } else if (!cookies.user || cookies.user === "") {
            handleSessionExpired();
        } else {
            setName(cookies.user);
        }

        if (cookies.user === "Manuel Keck") {
            setCarToggle(true);
        } else if (cookies.user === "Wilhelm Maybach") {
            setCarToggle(true);
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

    const handleCarModeToggle = () => {
        if (carModeToggle) {
            setCarModeToggle(false)
        } else if (!carModeToggle) {
            setCarModeToggle(true)
        }
    }

    return (
        <ErrorBoundary>
            <div className="text-center items-center justify-center w-full">
                <div className="flex-col justify-center text-center items-center text-white">

                    <div className="">
                        <div className="flex justify-center items-center text-2xl font-extralight">
                            <div>
                                <p className="lg:text-4xl">Hi {name}!</p>
                                <div className="mb-20">
                                    <MoodComponent
                                        onCurrentMoodClick={handleCurrentMoodChanged}
                                        onTargetMoodClick={handleTargetMoodClick}
                                        carMode={carModeToggle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <RecommendationComponent
                        selectedValue={selectedMood}
                        carMode={carModeToggle}
                    />
                </div>
                <div className="w-full flex flex-col justify-end items-center pr-5">
                    {
                        carToggle && (
                            <label className="inline-flex mt-5 cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer"
                                       onChange={handleCarModeToggle}/>
                                <div
                                    className="relative w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span
                                    className="ms-3 text-sm font-medium text-gray-200 dark:text-gray-300">Car mode</span>
                            </label>
                        )
                    }
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default MoodSelectionPage;