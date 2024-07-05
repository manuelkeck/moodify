import React, {useEffect, useState} from "react";
import getCurrentMood from "@/app/helper/mood-handler";
import Parabolic from "../../../public/parabolicCurve.svg"

interface CurrentMoodComponentProps {
    userName: string
    userSub: string
    currentMood: string
    setCurrentMood: (mood: string) => void
    setUserAvailable: (checkVar: boolean) => void
    currentEnergyLevel: number
}

interface MoodResponse {
    record: {
        auth0Sub: string;
        currentMood: string;
        lastUpdate: string;
        prevMood: string;
    }
}

interface ParabolaProps {
    currentMood: 'no energy' | 'too little energy' | 'optimal energy' | 'pent-up energy' | 'blocked energy';
}

const CurrentMoodComponent: React.FC<CurrentMoodComponentProps> = ({ userName, userSub, currentMood, setCurrentMood, setUserAvailable, currentEnergyLevel }) => {
    const [counter, setCounter] = useState(1);
    const [timer, setTimer] = useState(5000)
    const points = {
        'no energy':            { top: '90%', left: '20%'   },
        'too little energy':    { top: '40%', left: '31.5%' },
        'optimal energy':       { top: '10%', left: '50%'   },
        'pent-up energy':       { top: '40%', left: '68.5%' },
        'blocked energy':       { top: '90%', left: '80%'   },
    };

    useEffect(() => {
        const fetchMood = async () => {
            const res: MoodResponse = await getCurrentMood(userSub);
            if (!res) {
                console.log("User not found in database. Moodify iOS App Setup needed.")
                setCounter(11)
                setUserAvailable(false)
            }
            console.log("Current mood:", res.record.currentMood)
            setCurrentMood(res.record.currentMood);
        };

        const incrementCounterAndFetchMood = () => {
            setCounter((prevCounter) => (prevCounter === 10 ? 1 : prevCounter + 1));
            if (counter === 1) {
                fetchMood().then(r => "");
            }
        };
        const intervalId = setInterval(incrementCounterAndFetchMood, 20000);
        fetchMood().then(r => "");
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col justify-center">
            {/*<p>Current mood component</p>*/}
            {/*<p>User Name: {userName}</p>*/}
            {/*<p>User ID: {userSub}</p>*/}
            {/*<h2>Current Mood: {currentMood}</h2>*/}
            <p className="mb-16 mt-2">Current Energy Level</p>
            <div className="relative w-96 h-96 mx-auto">
                <Parabolic />
                {Object.entries(points).map(([label, position], index) => (
                    <div
                        key={label}
                        className="absolute flex items-center justify-center"
                        style={{top: position.top, left: position.left, transform: 'translate(-50%, -50%)'}}
                    >
                        {currentMood === label ? (
                            <span className="relative flex h-4 w-4">
                                <span
                                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-400"></span>
                            </span>
                        ) : (
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-700"></span>
                        )}
                        <div className="absolute text-xs w-14">
                            {position.left === '50%' ? (
                                <p className="transform -translate-y-9 ">{label}</p>
                            ) : position.left < '50%' ? (
                                <p className="transform -translate-x-11">{label}</p>
                            ) : (
                                <p className="transform translate-x-11">{label}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-xs">
                {currentEnergyLevel !== 0 ? (
                    <>
                        <div className="flex justify-center">
                            <p>Current recommendations energy level: </p>
                            <p className="ml-3">{currentEnergyLevel}</p>
                        </div>
                        <p className="text-gray-500">Possible energy level range: 0.0 - 1.0</p></>
                ) : (<></>)}
            </div>
        </div>
    );
}

export default CurrentMoodComponent;
