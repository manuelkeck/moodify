'use client';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

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
            <div className="flex justify-center items-center text-white">
                <div className="w-1/3 p-4">
                    <div className="flex flex-col justify-center items-center text-4xl font-extralight">
                        <div>
                            <p className="text-left">Hi {name}!</p>
                            <p className="text-left">How are you doing today?</p>
                        </div>
                    </div>
                </div>
                <div className="w-2/3 p-4">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-left">[Mood selection]</p>
                        {/*<div className="bg-green-700">*/}
                        {/*    <label>*/}
                        {/*        <input*/}
                        {/*            type="checkbox"*/}
                        {/*            checked={selectedMood === 'Option 1'}*/}
                        {/*            onChange={() => handleCheckboxChange('Option 1')}*/}

                        {/*        />*/}
                        {/*        <span className="checkbox"></span> Option 1*/}
                        {/*    </label>*/}
                        {/*    < br/>*/}
                        {/*    <label>*/}
                        {/*        <input*/}
                        {/*            type="checkbox"*/}
                        {/*            checked={selectedMood === 'Option 2'}*/}
                        {/*            onChange={() => handleCheckboxChange('Option 2')}*/}

                        {/*        />*/}
                        {/*        <span className="checkbox"></span> Option 2*/}
                        {/*    </label>*/}
                        {/*    < br/>*/}
                        {/*    <label>*/}
                        {/*        <input*/}
                        {/*            type="checkbox"*/}
                        {/*            checked={selectedMood === 'Option 3'}*/}
                        {/*            onChange={() => handleCheckboxChange('Option 3')}*/}

                        {/*        />*/}
                        {/*        <span className="checkbox"></span> Option 3*/}
                        {/*    </label>*/}
                        {/*    < br/>*/}
                        {/*    <label>*/}
                        {/*        <input*/}
                        {/*            type="checkbox"*/}
                        {/*            checked={selectedMood === 'Option 4'}*/}
                        {/*            onChange={() => handleCheckboxChange('Option 4')}*/}

                        {/*        />*/}
                        {/*        <span className="checkbox"></span> Option 4*/}
                        {/*    </label>*/}


                        {/*</div>*/}

                    </div>
                </div>
            </div>
            <div className="w-full">

            </div>
        </div>

    )
}