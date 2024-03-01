import React, { useState } from "react";
import Image from "next/image";

function MoodComponent() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [message, setMessage] = useState("How are you doing today?");
    const [defaultAppearance] = useState("inline-block text-center border-2 border-gray-900 text-base bg-gray-900 shadow-lg m-1 p-4 rounded-lg cursor-pointer");
    const [selectedAppearance] = useState("inline-block text-center border-2 border-gray-700 text-base bg-gray-800 shadow-lg p-4 rounded-lg cursor-pointer")
    const [appearanceMood1, setAppearanceMood1] = useState(defaultAppearance);
    const [appearanceMood2, setAppearanceMood2] = useState(defaultAppearance);
    const [appearanceMood3, setAppearanceMood3] = useState(defaultAppearance);

    const handleMoodClick = (index: number, mood: string) => {

        if (index === 0) {
            if (appearanceMood1 === defaultAppearance) {
                setAppearanceMood1(selectedAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
            } else {
                setAppearanceMood1(defaultAppearance);
            }
        }
        if (index === 1) {
            if (appearanceMood2 === defaultAppearance) {
                setAppearanceMood2(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
            } else {
                setAppearanceMood2(defaultAppearance);
            }
        }
        if (index === 2) {
            if (appearanceMood3 === defaultAppearance) {
                setAppearanceMood3(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood2(defaultAppearance);
            } else {
                setAppearanceMood3(defaultAppearance);
            }
        }

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
                <div className="flex-1">
                    <div
                        className={`${appearanceMood1}`}
                        onClick={() => handleMoodClick(0, "angry")}
                    >
                        <div className="flex justify-center px-4 items-center">
                            <Image src="/face-with-symbols-on-mouth_1f92c.png" alt="Image of an emotion" width={50}
                                   height={50}/>
                        </div>
                        <p className="pt-2">Angry</p>
                    </div>
                </div>
                <div className="flex-1 mx-auto mb-5">
                    <div
                        className={`${appearanceMood2}`}
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
                        className={`${appearanceMood3}`}
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
