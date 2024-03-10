import React, {useEffect, useState} from "react";
import Image from "next/image";

interface MoodComponentProps {
    onCurrentMoodClick: (currentMood: string) => void;
    onTargetMoodClick: (targetMood: string) => void;
}

const MoodComponent: React.FC<MoodComponentProps> = ({ onTargetMoodClick, onCurrentMoodClick }) => {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [message, setMessage] = useState("How are you doing today?");
    const [defaultAppearance] = useState("inline-block text-center border-2 border-gray-900 text-base bg-gray-900 shadow-lg m-1 p-4 rounded-lg cursor-pointer");
    const [selectedAppearance] = useState("inline-block text-center border-2 border-gray-700 text-base bg-gray-800 shadow-lg p-4 rounded-lg cursor-pointer");

    // Appearance of right div container do disable possibility of target mood selection
    const [targetSelectionActive, setTargetSelectionActive] = useState(false);
    const [targetSelectionNotActive] = useState("col-span-1 ")
    const [appearanceTargetMoodContainer, setAppearanceTargetMoodContainer] = useState(targetSelectionNotActive);

    const [currentMood, setCurrentMood] = useState<string | "">("");
    const [targetMood, setTargetMood] = useState<string | "">("");

    // Todo: refactor later
    // Appearance current moods
    const [appearanceMood1, setAppearanceMood1] = useState(defaultAppearance);
    const [appearanceMood2, setAppearanceMood2] = useState(defaultAppearance);
    const [appearanceMood3, setAppearanceMood3] = useState(defaultAppearance);
    // Appearance target moods
    const [appearanceMood4, setAppearanceMood4] = useState(defaultAppearance);
    const [appearanceMood5, setAppearanceMood5] = useState(defaultAppearance);
    const [appearanceMood6, setAppearanceMood6] = useState(defaultAppearance);
    const [appearanceMood7, setAppearanceMood7] = useState(defaultAppearance);

    const arrow = "->";

    useEffect(() => {
        if (appearanceMood1 === defaultAppearance && appearanceMood2 === defaultAppearance && appearanceMood3 === defaultAppearance) {
            setTargetSelectionActive(false);
        } else {
            setTargetSelectionActive(true);
        }
    }, [appearanceMood1, appearanceMood2, appearanceMood3]);

    const handleCurrentMoodClick = (index: number, mood: string) => {
        setCurrentMood(mood);
        onCurrentMoodClick(mood);

        if (index === 0) {
            if (appearanceMood1 === defaultAppearance) {
                setAppearanceMood1(selectedAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
            } else {
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
            }
        }
        if (index === 1) {
            if (appearanceMood2 === defaultAppearance) {
                setAppearanceMood2(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
            } else {
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
            }
        }
        if (index === 2) {
            if (appearanceMood3 === defaultAppearance) {
                setAppearanceMood3(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
            } else {
                setAppearanceMood3(defaultAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
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

    const handleTargetMoodClick = (index: number, mood: string) => {
        setTargetMood(mood);
        onTargetMoodClick(mood);

        if (index === 4) {
            if (appearanceMood4 === defaultAppearance) {
                setAppearanceMood4(selectedAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
                setAppearanceMood7(defaultAppearance);
            } else {
                setAppearanceMood4(defaultAppearance);
            }
        }
        if (index === 5) {
            if (appearanceMood5 === defaultAppearance) {
                setAppearanceMood5(selectedAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
                setAppearanceMood7(defaultAppearance);
            } else {
                setAppearanceMood5(defaultAppearance);
            }
        }
        if (index === 6) {
            if (appearanceMood6 === defaultAppearance) {
                setAppearanceMood6(selectedAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood7(defaultAppearance);
            } else {
                setAppearanceMood6(defaultAppearance);
            }
        }
        if (index === 7) {
            if (appearanceMood7 === defaultAppearance) {
                setAppearanceMood7(selectedAppearance);
                setAppearanceMood4(defaultAppearance);
                setAppearanceMood5(defaultAppearance);
                setAppearanceMood6(defaultAppearance);
            } else {
                setAppearanceMood7(defaultAppearance);
            }
        }
    }

    return (
        <div>
            { /* Top message (Are you ... today?) */ }
            <p className="mb-10 text-base sm:text-xl">{message}</p>

            { /* Header */ }
            <div className="grid grid-cols-3 gap-4 items-center">

                <div className="col-span-1">
                    <div className="flex-col flex-wrap justify-center">
                        <p className="text-sm pb-5">Current mood</p>
                    </div>
                </div>

                <div className="col-span-1">
                    { /* Placeholder */}
                </div>

                <div className="col-span-1">
                    <div className="flex-col flex-wrap justify-center">
                        <p className="text-sm pb-5">Target mood</p>
                    </div>
                </div>
            </div>

            { /* Mood selection */ }
            <div className="grid grid-cols-3 gap-4 items-center">

                { /* Select current mood */ }
                <div className="col-span-1">
                    <div className="flex-col flex-wrap justify-center">
                        <div className="flex-1">
                            <div
                                className={`${appearanceMood1}`}
                                onClick={() => handleCurrentMoodClick(0, "angry")}
                            >
                                <div className="flex justify-center px-4 items-center">
                                    <Image src="/face-with-symbols-on-mouth_1f92c.png" alt="Image of an emotion"
                                           width={25}
                                           height={25}/>
                                </div>
                                <p className="pt-2">Angry</p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div
                                className={`${appearanceMood2}`}
                                onClick={() => handleCurrentMoodClick(1, "sad")}
                            >
                                <div className="flex justify-center px-4 items-center">
                                    <Image src="/disappointed-face_1f61e.png" alt="Image of an emotion"
                                           width={25}
                                           height={25}/>
                                </div>
                                <p className="pt-2">Sad</p>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div
                                className={`${appearanceMood3}`}
                                onClick={() => handleCurrentMoodClick(2, "sleepy")}
                            >
                                <div className="flex justify-center px-4 items-center">
                                    <Image src="/sleeping-face_1f634.png" alt="Image of an emotion"
                                           width={25}
                                           height={25}/>
                                </div>
                                <p className="pt-2">Sleepy</p>
                            </div>
                        </div>
                    </div>
                </div>

                {targetSelectionActive ? (
                    <div className="col-span-1">
                        { /* Arrow, ... */ }
                        <p>{arrow}</p>
                    </div>
                ) : (
                    <div className="col-span-1"></div>
                )}

                { /* Select target mood */ }
                {targetSelectionActive ? (
                    <div>
                        <div className="col-span-1">
                            <div className="flex-col flex-wrap justify-center">
                                <div className="flex-1">
                                    <div
                                        className={`${appearanceMood7}`}
                                        onClick={() => handleTargetMoodClick(7, "happy")}
                                    >
                                        <div className="flex justify-center px-4 items-center">
                                            <Image src="/star-struck_1f929.png" alt="Image of an emotion"
                                                   width={25}
                                                   height={25}/>
                                        </div>
                                        <p className="pt-2">Happy</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div
                                        className={`${appearanceMood4}`}
                                        onClick={() => handleTargetMoodClick(4, "relaxed")}
                                    >
                                        <div className="flex justify-center px-4 items-center">
                                            <Image src="/relieved-face_1f60c.png" alt="Image of an emotion"
                                                   width={25}
                                                   height={25}/>
                                        </div>
                                        <p className="pt-2">Relaxed</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div
                                        className={`${appearanceMood5}`}
                                        onClick={() => handleTargetMoodClick(5, "pensive")}
                                    >
                                        <div className="flex justify-center px-4 items-center">
                                            <Image src="/pensive-face_1f614.png" alt="Image of an emotion"
                                                   width={25}
                                                   height={25}/>
                                        </div>
                                        <p className="pt-2">Pensive</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div
                                        className={`${appearanceMood6}`}
                                        onClick={() => handleTargetMoodClick(6, "sleepy")}
                                    >
                                        <div className="flex justify-center px-4 items-center">
                                            <Image src="/sleeping-face_1f634.png" alt="Image of an emotion"
                                                   width={25}
                                                   height={25}/>
                                        </div>
                                        <p className="pt-2">Sleepy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="col-span-1">
                        <div className="flex-col flex-wrap justify-center">
                            <div className="flex-1">
                                <div
                                    className="inline-block text-center border-2 border-gray-900 text-base bg-gray-900 opacity-50 shadow-lg m-1 p-4 rounded-lg cursor-not-allowed">
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/star-struck_1f929.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}
                                               className="opacity-85"/>
                                    </div>
                                    <p className="pt-2">Happy</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    className="inline-block text-center border-2 border-gray-900 text-base bg-gray-900 opacity-50 shadow-lg m-1 p-4 rounded-lg cursor-not-allowed">
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/relieved-face_1f60c.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}
                                               className="opacity-85"/>
                                    </div>
                                    <p className="pt-2">Relaxed</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    className="inline-block text-center border-2 border-gray-900 text-base bg-gray-900 opacity-50 shadow-lg m-1 p-4 rounded-lg cursor-not-allowed">
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/pensive-face_1f614.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2">Pensive</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    className="inline-block text-center border-2 border-gray-900 text-base bg-gray-900 opacity-50 shadow-lg m-1 p-4 rounded-lg cursor-not-allowed">
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/sleeping-face_1f634.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2">Sleepy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default MoodComponent;
