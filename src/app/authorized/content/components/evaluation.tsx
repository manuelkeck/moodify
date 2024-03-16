import React, {useEffect, useState} from "react";

interface evaluationContext {
    name: string;
    currentMood: string;
    targetMood: string;
    recURL: string;
}

const EvaluationComponent: React.FC<evaluationContext> = (props) => {
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

    return (
        <div className="mt-10 flex justify-center">
            <div className="flex">
                <div className="text-center">
                    <div
                        className="mx-auto transition duration-150 w-20 mr-3 ease-in-out bg-red-600 text-base hover:bg-red-800 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer"
                        onClick={() => saveResponseToDatabase(false)}
                    >
                        <p>No</p>
                    </div>
                </div>
                <div className="flex">
                    <div
                        className="mx-auto transition duration-150 w-20 ml-3 ease-in-out bg-green-600 text-base hover:bg-green-800 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer"
                        onClick={() => saveResponseToDatabase(true)}
                    >
                        <p>Yes</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EvaluationComponent;
