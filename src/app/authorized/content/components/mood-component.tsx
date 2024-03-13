import React, {useEffect, useState} from "react";
import Image from "next/image";
import {def} from "@vue/shared";

interface MoodComponentProps {
    onCurrentMoodClick: (currentMood: string) => void;
    onTargetMoodClick: (targetMood: string) => void;
}

interface moodCoding {
    relaxed: true;
    pensive: true;
    concentrated: true;
    happy: true;
    energized: true;
    healed: true;
}

const MoodComponent: React.FC<MoodComponentProps> = ({ onTargetMoodClick, onCurrentMoodClick }) => {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [message, setMessage] = useState("How are you doing today?");
    const [defaultAppearance] = useState("text-center border-2 border-gray-900 text-base bg-gray-900 shadow-lg px-2 py-3 m-1 rounded-lg cursor-pointer");
    const [selectedAppearance] = useState("text-center border-2 border-gray-700 text-base bg-gray-800 shadow-lg px-2 py-3 m-1 rounded-lg cursor-pointer");
    const [disabledAppearance] = useState("text-center border-2 border-gray-900 text-base bg-gray-900 opacity-50 shadow-lg px-2 py-3 m-1 rounded-lg cursor-not-allowed");

    // Appearance of right div container do disable possibility of target mood selection
    const [targetSelectionActive, setTargetSelectionActive] = useState(false);

    // Todo: refactor later (defaultAppearance can be removed and replaced with disabledAppearance)
    // Appearance current moods
    const [appearanceMood1, setAppearanceMood1] = useState(defaultAppearance);      // angry
    const [appearanceMood2, setAppearanceMood2] = useState(defaultAppearance);      // sad
    const [appearanceMood3, setAppearanceMood3] = useState(defaultAppearance);      // tired
    const [appearanceMood0, setAppearanceMood0] = useState(defaultAppearance);      // heartbroken
    const [appearanceMood10, setAppearanceMood10] = useState(defaultAppearance);    // stressed
    const [appearanceMood11, setAppearanceMood11] = useState(defaultAppearance);    // shocked

    // Appearance target moods
    const [appearanceMood4, setAppearanceMood4] = useState(defaultAppearance);      // relaxed
    const [appearanceMood5, setAppearanceMood5] = useState(defaultAppearance);      // pensive
    const [appearanceMood6, setAppearanceMood6] = useState(defaultAppearance);      // concentrated
    const [appearanceMood7, setAppearanceMood7] = useState(defaultAppearance);      // happy
    const [appearanceMood8, setAppearanceMood8] = useState(defaultAppearance);      // energized
    const [appearanceMood9, setAppearanceMood9] = useState(defaultAppearance);      // healed

    const arrow = "->";
    const [currentMood, setCurrentMood] = useState("");
    const [targetMood, setTargetMood] = useState("");

    useEffect(() => {
        if (appearanceMood1 === defaultAppearance && appearanceMood2 === defaultAppearance && appearanceMood3 === defaultAppearance && appearanceMood0 === defaultAppearance && appearanceMood10 === defaultAppearance && appearanceMood11 === defaultAppearance) {
            setTargetSelectionActive(false);
        } else {
            setTargetSelectionActive(true);
        }
    }, [appearanceMood1, appearanceMood2, appearanceMood3, appearanceMood0, appearanceMood10, appearanceMood11]);

    useEffect(() => {
        switch (currentMood) {
            case "angry": { setAppearanceMood7(defaultAppearance); setAppearanceMood8(defaultAppearance); setAppearanceMood4(defaultAppearance); setAppearanceMood5(disabledAppearance); setAppearanceMood6(defaultAppearance); setAppearanceMood9(disabledAppearance); break; }
            case "tired": { setAppearanceMood7(defaultAppearance); setAppearanceMood8(defaultAppearance); setAppearanceMood4(defaultAppearance); setAppearanceMood5(disabledAppearance); setAppearanceMood6(defaultAppearance); setAppearanceMood9(disabledAppearance); break; }
            case "stressed": { setAppearanceMood7(defaultAppearance); setAppearanceMood8(defaultAppearance); setAppearanceMood4(defaultAppearance); setAppearanceMood5(disabledAppearance); setAppearanceMood6(defaultAppearance); setAppearanceMood9(disabledAppearance); break; }
            case "shocked": { setAppearanceMood7(defaultAppearance); setAppearanceMood8(defaultAppearance); setAppearanceMood4(defaultAppearance); setAppearanceMood5(disabledAppearance); setAppearanceMood6(defaultAppearance); setAppearanceMood9(disabledAppearance); break; }
            case "sad": { setAppearanceMood7(defaultAppearance); setAppearanceMood8(defaultAppearance); setAppearanceMood4(defaultAppearance); setAppearanceMood5(defaultAppearance); setAppearanceMood6(defaultAppearance); setAppearanceMood9(disabledAppearance); break; }
            case "heartbroken": { setAppearanceMood7(defaultAppearance); setAppearanceMood8(defaultAppearance); setAppearanceMood4(defaultAppearance); setAppearanceMood5(defaultAppearance); setAppearanceMood6(defaultAppearance); setAppearanceMood9(defaultAppearance); break; }
        }
    }, [currentMood, defaultAppearance, disabledAppearance]);

    useEffect(() => {
        if (targetMood !== "") {
            switch (targetMood) {
                case "relaxed": {}
            }
        }
    }, [targetMood]);

    const checkPreselection = () => {
        if (targetMood !== "") {
            switch (targetMood) {
                case "relaxed": { setAppearanceMood4(defaultAppearance); break; }
                case "pensive": { setAppearanceMood5(defaultAppearance); break; }
                case "concentrated": { setAppearanceMood6(defaultAppearance); break;}
                case "happy": { setAppearanceMood7(defaultAppearance); break;}
                case "energized": { setAppearanceMood8(defaultAppearance); break;}
                case "healed": { setAppearanceMood8(defaultAppearance); break;}
            }
        }
    }

    const handleCurrentMoodClick = (index: number, mood: string) => {
        onCurrentMoodClick(mood);

        // angry
        if (index === 1) {
            if (appearanceMood1 === defaultAppearance) {
                setCurrentMood("angry");
                setAppearanceMood1(selectedAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood11(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
                setAppearanceMood0(defaultAppearance);
                setAppearanceMood10(defaultAppearance);
            } else {
                setCurrentMood("");
                setAppearanceMood1(defaultAppearance);
            }
        }
        // sad
        if (index === 2) {
            if (appearanceMood2 === defaultAppearance) {
                setCurrentMood("sad");
                setAppearanceMood2(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood11(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
                setAppearanceMood0(defaultAppearance);
                setAppearanceMood10(defaultAppearance);
            } else {
                setCurrentMood("");
                setAppearanceMood2(defaultAppearance);
            }
        }
        // tired
        if (index === 3) {
            if (appearanceMood3 === defaultAppearance) {
                setCurrentMood("tired");
                setAppearanceMood3(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood11(defaultAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood0(defaultAppearance);
                setAppearanceMood10(defaultAppearance);
            } else {
                setCurrentMood("");
                setAppearanceMood3(defaultAppearance);
            }
        }
        // heartbroken
        if (index === 0) {
            if (appearanceMood0 === defaultAppearance) {
                setCurrentMood("heartbroken");
                setAppearanceMood0(selectedAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood11(defaultAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
                setAppearanceMood10(defaultAppearance);
            } else {
                setCurrentMood("");
                setAppearanceMood0(defaultAppearance);
            }
        }
        // stressed
        if (index === 10) {
            if (appearanceMood10 === defaultAppearance) {
                setCurrentMood("stressed");
                setAppearanceMood10(selectedAppearance);
                setAppearanceMood0(defaultAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood11(defaultAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
            } else {
                setCurrentMood("");
                setAppearanceMood10(defaultAppearance);
            }
        }
        // shocked
        if (index === 11) {
            if (appearanceMood11 === defaultAppearance) {
                setCurrentMood("shocked");
                setAppearanceMood11(selectedAppearance);
                setAppearanceMood0(defaultAppearance);
                setAppearanceMood10(defaultAppearance);
                setAppearanceMood1(defaultAppearance);
                setAppearanceMood2(defaultAppearance);
                setAppearanceMood3(defaultAppearance);
            } else {
                setCurrentMood("");
                setAppearanceMood11(defaultAppearance);
            }
        }

        // de-select mood if mood is already selected
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
        onTargetMoodClick(mood);

        // relaxed
        if (index === 4) {
            if (appearanceMood4 === defaultAppearance) {
                setAppearanceMood4(selectedAppearance);
                checkPreselection();
                setTargetMood("relaxed");
            } else {
                setAppearanceMood4(defaultAppearance);
                setTargetMood("");
            }
        }
        // pensive
        if (index === 5) {
            if (appearanceMood5 === defaultAppearance && currentMood !== "angry" && currentMood !== "tired" && currentMood !== "stressed" && currentMood !== "shocked") {
                setAppearanceMood5(selectedAppearance);
                checkPreselection();
                setTargetMood("pensive");
            } else {
                setAppearanceMood5(defaultAppearance);
                setTargetMood("");
            }
        }
        // concentrated
        if (index === 6) {
            if (appearanceMood6 === defaultAppearance) {
                setAppearanceMood6(selectedAppearance);
                checkPreselection();
                setTargetMood("concentrated");
            } else {
                setAppearanceMood6(defaultAppearance);
                setTargetMood("");
            }
        }
        // happy
        if (index === 7) {
            if (appearanceMood7 === defaultAppearance) {
                setAppearanceMood7(selectedAppearance);
                checkPreselection();
                setTargetMood("happy");
            } else {
                setAppearanceMood7(defaultAppearance);
                setTargetMood("");
            }
        }
        // energized
        if (index === 8) {
            if (appearanceMood8 === defaultAppearance) {
                setAppearanceMood8(selectedAppearance);
                checkPreselection();
                setTargetMood("energized");
            } else {
                setAppearanceMood8(defaultAppearance);
                setTargetMood("");
            }
        }
        // healed
        if (index === 9) {
            if (appearanceMood9 === defaultAppearance && currentMood !== "angry" && currentMood !== "tired" && currentMood !== "stressed" && currentMood !== "shocked") {
                setAppearanceMood9(selectedAppearance);
                checkPreselection();
                setTargetMood("healed");
            } else {
                setAppearanceMood9(defaultAppearance);
                setTargetMood("");
            }
        }
    }

    return (
        <div>
            { /* Top message (Are you ... today?) */ }
            <p className="mb-10 text-base sm:text-xl">{message}</p>

            { /* Header */ }
            <div className="grid grid-cols-3 items-center">

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
            <div className="grid grid-cols-3 items-center">

                { /* Select current mood */ }
                <div className="col-span-1">
                    <div className="grid grid-cols-2 items-center">
                        <div className="col-span-1">
                            <div className="flex-1">
                                <div
                                    className={`${appearanceMood1}`}
                                    onClick={() => handleCurrentMoodClick(1, "angry")}
                                >
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/face-with-symbols-on-mouth_1f92c.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2 text-xs">Angry</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    className={`${appearanceMood10}`}
                                    onClick={() => handleCurrentMoodClick(10, "stressed")}
                                >
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/anxious-face-with-sweat_1f630.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2 text-xs">Stressed</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    // className={`${appearanceMood2}`}
                                    className={`${disabledAppearance}`}
                                    // onClick={() => handleCurrentMoodClick(2, "sad")}
                                >
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/disappointed-face_1f61e.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2 text-xs">Sad</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex-1">
                                <div
                                    className={`${appearanceMood3}`}
                                    onClick={() => handleCurrentMoodClick(3, "tired")}
                                >
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/yawning-face_1f971.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2 text-xs">Tired</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    className={`${appearanceMood11}`}
                                    onClick={() => handleCurrentMoodClick(11, "shocked")}
                                >
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/dizzy-face_1f635.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2 text-xs">Shocked</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div
                                    // className = {`${appearanceMood0}`}
                                    className={`${disabledAppearance}`}
                                    // onClick={() => handleCurrentMoodClick(0, "heartbroken")}
                                >
                                    <div className="flex justify-center px-4 items-center">
                                        <Image src="/broken-heart_1f494.png" alt="Image of an emotion"
                                               width={25}
                                               height={25}/>
                                    </div>
                                    <p className="pt-2 text-xs">Heartbroken</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {targetSelectionActive ? (
                    <div className="col-span-1 flex justify-center items-center">
                        { /* Arrow, ... */}
                        <Image src="/icons8-arrow-90.png"
                               alt="Arrow that points to the right"
                               height={40}
                               width={40}
                        />
                    </div>
                ) : (
                    <div className="col-span-1">
                        <p></p>
                    </div>
                )}

                { /* Select target mood */}
                {targetSelectionActive ? (
                    <div>
                        <div className="col-span-1">
                            <div className="flex-col flex-wrap justify-center">
                                <div className="grid grid-cols-2 items-center">
                                <div className="col-span-1">
                                        <div className="flex-1">
                                            <div
                                                className={`${appearanceMood7}`}
                                                onClick={() => handleTargetMoodClick(7, "happy")}
                                            >
                                                <div className="flex justify-center px-4 items-center">
                                                    <Image src="/beaming-face-with-smiling-eyes_1f601.png" alt="Image of an emotion"
                                                           width={25}
                                                           height={25}/>
                                                </div>
                                                <p className="pt-2 text-xs">Happy</p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div
                                                className={`${appearanceMood8}`}
                                                onClick={() => handleTargetMoodClick(8, "energized")}
                                            >
                                            <div className="flex justify-center px-4 items-center">
                                                    <Image src="/star-struck_1f929.png" alt="Image of an emotion"
                                                           width={25}
                                                           height={25}
                                                           className="opacity-85"/>
                                                </div>
                                                <p className="pt-2 text-xs">Energized</p>
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
                                                <p className="pt-2 text-xs">Relaxed</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-1">
                                        <div className="flex-1">
                                            <div
                                                className={`${appearanceMood5}`}
                                                onClick={appearanceMood5 !== disabledAppearance ? () => handleTargetMoodClick(5, "pensive") : undefined}
                                            >
                                                <div className="flex justify-center px-4 items-center">
                                                    <Image src="/pensive-face_1f614.png" alt="Image of an emotion"
                                                           width={25}
                                                           height={25}/>
                                                </div>
                                                <p className="pt-2 text-xs">Pensive</p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div
                                                className={`${appearanceMood6}`}
                                                onClick={() => handleTargetMoodClick(6, "concentrated")}
                                            >
                                                <div className="flex justify-center px-4 items-center">
                                                    <Image src="/technologist-medium-skin-tone_1f9d1-1f3fd-200d-1f4bb.png" alt="Image of an emotion"
                                                           width={25}
                                                           height={25}/>
                                                </div>
                                                <p className="pt-2 text-xs">Concentrated</p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div
                                                className={`${appearanceMood9}`}
                                                onClick={appearanceMood9 !== disabledAppearance ? () => handleTargetMoodClick(9, "healed") : undefined}
                                            >
                                                <div className="flex justify-center px-4 items-center">
                                                    <Image src="/mending-heart_2764-fe0f-200d-1fa79.png" alt="Image of an emotion"
                                                           width={25}
                                                           height={25}/>
                                                </div>
                                                <p className="pt-2 text-xs">Healed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="col-span-1">
                        <div className="flex-col flex-wrap justify-center">
                            <div className="grid grid-cols-2 items-center">
                                <div className="col-span-1">
                                    <div className="flex-1">
                                        <div
                                            className={`${disabledAppearance}`}>
                                            <div className="flex justify-center px-4 items-center">
                                                <Image src="/beaming-face-with-smiling-eyes_1f601.png" alt="Image of an emotion"
                                                       width={25}
                                                       height={25}
                                                       className="opacity-85"/>
                                            </div>
                                            <p className="pt-2 text-xs">Happy</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`${disabledAppearance}`}>
                                            <div className="flex justify-center px-4 items-center">
                                                <Image src="/star-struck_1f929.png" alt="Image of an emotion"
                                                       width={25}
                                                       height={25}
                                                       className="opacity-85"/>
                                            </div>
                                            <p className="pt-2 text-xs">Energized</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`${disabledAppearance}`}>
                                            <div className="flex justify-center px-4 items-center">
                                                <Image src="/relieved-face_1f60c.png" alt="Image of an emotion"
                                                       width={25}
                                                       height={25}
                                                       className="opacity-85"/>
                                            </div>
                                            <p className="pt-2 text-xs">Relaxed</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <div className="flex-1">
                                        <div
                                            className={`${disabledAppearance}`}>
                                            <div className="flex justify-center px-4 items-center">
                                                <Image src="/pensive-face_1f614.png" alt="Image of an emotion"
                                                       width={25}
                                                       height={25}/>
                                            </div>
                                            <p className="pt-2 text-xs">Pensive</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`${disabledAppearance}`}>
                                            <div className="flex justify-center px-4 items-center">
                                                <Image src="/technologist-medium-skin-tone_1f9d1-1f3fd-200d-1f4bb.png" alt="Image of an emotion"
                                                       width={25}
                                                       height={25}/>
                                            </div>
                                            <p className="pt-2 text-xs">Concentrated</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`${disabledAppearance}`}>
                                            <div className="flex justify-center px-4 items-center">
                                                <Image src="/mending-heart_2764-fe0f-200d-1fa79.png" alt="Image of an emotion"
                                                       width={25}
                                                       height={25}/>
                                            </div>
                                            <p className="pt-2 text-xs">Healed</p>
                                        </div>
                                    </div>
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
