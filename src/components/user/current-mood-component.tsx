import React, {useEffect, useState} from "react";
import getCurrentMood from "@/app/helper/mood-handler";

interface CurrentMoodComponentProps {
    userName: string
    userSub: string
    currentMood: string
    setCurrentMood: (mood: string) => void
    setUserAvailable: (checkVar: boolean) => void
}

interface MoodResponse {
    record: {
        auth0Sub: string;
        currentMood: string;
        lastUpdate: string;
        prevMood: string;
    }
}

const CurrentMoodComponent: React.FC<CurrentMoodComponentProps> = ({ userName, userSub, currentMood, setCurrentMood, setUserAvailable }) => {
    const [counter, setCounter] = useState(1);

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
        const intervalId = setInterval(incrementCounterAndFetchMood, 10000);
        fetchMood().then(r => "");
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
{/*            <p>Current mood component</p>
            <p>User Name: {userName}</p>
            <p>User ID: {userSub}</p>
            <h2>Current Mood: {currentMood}</h2>*/}
        </>
    );
}

export default CurrentMoodComponent;
