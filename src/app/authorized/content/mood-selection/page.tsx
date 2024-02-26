'use client';

import { useState } from "react";

export default function Mood-Page() {
    const [name, setName] = useState("User")

    return (
        <div className="flex flex-col justify-center items-center p-24 bg-blue-400">
            <p className="basis-1/3 grow text-4xl font-extralight text-white text-right bg-amber-300">
                Hallo {name}, wie fühlst du Dich heute?
            </p>
            <div className="basis-2/3 grow text-center bg-green-500">
                <p className="text-2xl text-white pl-5">Mood selection</p>
            </div>
        </div>
    )
}