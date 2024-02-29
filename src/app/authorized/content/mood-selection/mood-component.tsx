import React, { useState } from "react";
import Image from "next/image";

function MoodComponent() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [message, setMessage] = useState("How are you doing today?");

    const handleMoodClick = (index: number, mood: string) => {
        if (selectedMood === index) {
            setSelectedMood(null);
            setMessage("How are you doing today?")
        } else {
            setSelectedMood(index);
            let text_part1 = "You are ";
            let text_part2 = text_part1.concat(mood);
            let text_part3 = " today?";
            let text_part4 = text_part2.concat(text_part3);
            setMessage(text_part4);
        }
    };

    return (
        <div>
            <p className="mb-10">{message}</p>
            <div className="flex flex-wrap justify-center">
                <div className="flex-1 mb-5">
                    <div
                        className={`inline-block text-center border-2 border-gray-900 text-base bg-gray-900 shadow-lg p-4 rounded-lg cursor-pointer ${
                            selectedMood === 0 ? "border-gray-700 bg-gray-800" : ""
                        }`}
                        onClick={() => handleMoodClick(0, "angry")}
                    >
                        <div className="flex justify-center px-4 items-center">
                            <Image src="/face-with-symbols-on-mouth_1f92c.png" alt="Image of an emotion" width={50}
                                   height={50}/>
                        </div>
                        <p className="pt-2">Angry</p>
                    </div>
                </div>
                <div className="flex-1 mx-5 mb-5">
                    <div
                        className={`inline-block text-center border-2 border-gray-900 text-base bg-gray-900 shadow-lg p-4 rounded-lg cursor-pointer ${
                            selectedMood === 1 ? "border-gray-700 bg-gray-800" : ""
                        }`}
                        onClick={() => handleMoodClick(1, "sad")}
                    >
                        <div className="flex justify-center px-4 items-center">
                            <Image src="/disappointed-face_1f61e.png" alt="Image of an emotion" width={50} height={50}/>
                        </div>
                        <p className="pt-2">Sad</p>
                    </div>
                </div>
                <div className="flex-1 mb-5">
                    <div
                        className={`inline-block text-center border-2 border-gray-900 text-base bg-gray-900 shadow-lg p-4 rounded-lg cursor-pointer ${
                            selectedMood === 2 ? "border-gray-700 bg-gray-800" : ""
                        }`}
                        onClick={() => handleMoodClick(2, "sleepy")}
                    >
                        <div className="flex justify-center px-4 items-center">
                            <Image src="/sleeping-face_1f634.png" alt="Image of an emotion" width={50} height={50}/>
                        </div>
                        <p className="pt-2">Sleepy</p>
                    </div>
                </div>
            </div>
        </div>
    );
    }

    export default MoodComponent;
