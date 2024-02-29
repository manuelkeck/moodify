import React, { useState } from "react";
import Image from "next/image";

function MoodComponent() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);

    const handleMoodClick = (index: number) => {
        setSelectedMood(index);
    };

    return (
        <div className="flex flex-wrap justify-center">
            <div className="flex-1 mb-5">
                <div
                    className={`inline-block text-center text-base bg-gray-900 shadow-lg p-4 rounded-lg cursor-pointer ${
                        selectedMood === 0 ? "border-green-500 border-4" : ""
                    }`}
                    onClick={() => handleMoodClick(0)}
                >
                    <div className="flex justify-center px-4 items-center">
                        <Image src="/face-with-symbols-on-mouth_1f92c.png" alt="Image of an emotion" width={50} height={50} />
                    </div>
                    <p className="pt-2">Angry</p>
                </div>
            </div>
            <div className="flex-1 mx-5 mb-5">
                <div
                    className={`inline-block text-center text-base bg-gray-900 shadow-lg p-4 rounded-lg cursor-pointer ${
                        selectedMood === 1 ? "border-green-500 border-4" : ""
                    }`}
                    onClick={() => handleMoodClick(1)}
                >
                    <div className="flex justify-center px-4 items-center">
                        <Image src="/disappointed-face_1f61e.png" alt="Image of an emotion" width={50} height={50} />
                    </div>
                    <p className="pt-2">Sad</p>
                </div>
            </div>
            <div className="flex-1 mb-5">
                <div
                    className={`inline-block text-center text-base bg-gray-900 shadow-lg p-4 rounded-lg cursor-pointer ${
                        selectedMood === 2 ? "border-green-500 border-4" : ""
                    }`}
                    onClick={() => handleMoodClick(2)}
                >
                    <div className="flex justify-center px-4 items-center">
                        <Image src="/sleeping-face_1f634.png" alt="Image of an emotion" width={50} height={50} />
                    </div>
                    <p className="pt-2">Sleepy</p>
                </div>
            </div>
        </div>
    );
}

export default MoodComponent;
