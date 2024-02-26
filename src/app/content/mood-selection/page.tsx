'use client';

import { useState } from "react";

export default function Page() {
    const [name, setName] = useState("User")

    return (
        <div className="flex flex-row justify-center items-center h-screen">
            <p className="basis-1/3 grow text-4xl font-extralight text-white text-right">
                Hallo {name}, wie fühlst du Dich heute?
            </p>
            <div className="basis-2/3 grow text-center">
                <p className="text-2xl text-white pl-5">Mood selection</p>
            </div>
        </div>
    )
}