import React, {useEffect, useState} from "react";
import Image from "next/image";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface evaluationContext {
    name: string;
    currentMood: string;
    targetMood: string;
    recURL: string;
}

const EvaluationComponent: React.FC<evaluationContext> = (props) => {
    const [moodCurrentImagePath, setMoodCurrentImagePath] = useState("/dotted-line-face_1fae5.png");
    const [moodTargetImagePath, setMoodTargetImagePath] = useState("/dotted-line-face_1fae5.png");

    useEffect(() => {
        switch (props.currentMood) {
            case("angry"): setMoodCurrentImagePath("/face-with-symbols-on-mouth_1f92c.png"); break;
            case("tired"): setMoodCurrentImagePath("/yawning-face_1f971.png"); break;
            case("stressed"): setMoodCurrentImagePath("/anxious-face-with-sweat_1f630.png"); break;
            case("shocked"): setMoodCurrentImagePath("/dizzy-face_1f635.png"); break;
            case("sad"): setMoodCurrentImagePath("/disappointed-face_1f61e.png"); break;
            case("heartbroken"): setMoodCurrentImagePath("/broken-heart_1f494.png"); break;
            default: setMoodCurrentImagePath("/dotted-line-face_1fae5.png");
        }
        switch (props.targetMood) {
            case("happy"): setMoodTargetImagePath("/beaming-face-with-smiling-eyes_1f601.png"); break;
            case("energized"): setMoodTargetImagePath("/star-struck_1f929.png"); break;
            case("relaxed"): setMoodTargetImagePath("/relieved-face_1f60c.png"); break;
            case("concentrated"): setMoodTargetImagePath("/technologist-medium-skin-tone_1f9d1-1f3fd-200d-1f4bb.png"); break;
            case("pensive"): setMoodTargetImagePath("/pensive-face_1f614.png"); break;
            case("healed"): setMoodTargetImagePath("/mending-heart_2764-fe0f-200d-1fa79.png"); break;
            default: setMoodTargetImagePath("/dotted-line-face_1fae5.png");
        }

    }, [props.targetMood]);

    const saveResponseToDatabase = async (success: boolean) => {
        const data = {
            name: "no-name",
            currentMood: props.currentMood,
            targetMood: props.targetMood,
            recURL: props.recURL,
            success: success
        }
        const newEvaluation = await fetch('/api/database', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        // console.log(newEvaluation);
    }

    const showAlert = () => {
        toast.success('💾 Response submitted!', {
            position: "top-center",
        });
    }

    const handleClick = (success: boolean) => {
        showAlert();
        saveResponseToDatabase(success);
    }

    return (
        <div className="mt-10 flex justify-center p-4">
            <div className="text-base">
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
            </div>

            <div className="grid">

                <div className="grid-rows-1">
                    <p className="mb-10">Are you feeling more {props.targetMood} now?</p>
                </div>

                <div className="grid-rows-1 flex justify-center items-center">

                    <div className="flex justify-center items-center">
                        <div
                            className="flex justify-center items-center mx-auto transition duration-150 w-32 h-10 mr-3 ease-in-out bg-red-900 text-base hover:bg-red-800 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer"
                            onClick={() => handleClick(false)}
                        >
                            <div className="flex justify-center items-center">
                                <Image src={moodCurrentImagePath} alt="Image of an emotion"
                                       width={30}
                                       height={30}/>
                                <p className="pl-2">No</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-center">
                        <div
                            className="flex justify-center items-center mx-auto transition duration-150 w-32 h-10 ml-3 ease-in-out bg-green-700 text-base hover:bg-green-800 text-white font-medium rounded-2xl cursor-pointer"
                                onClick={() => handleClick(true)}
                            >
                                <div className="flex justify-center items-center">
                                    <Image src={moodTargetImagePath} alt="Image of an emotion"
                                           width={30}
                                           height={30}/>
                                    <p className="pl-2">Yes</p>
                                </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EvaluationComponent;
