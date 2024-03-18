import Link from "next/link";
import React from "react";
import Image from "next/image";

function ContinueComponent () {
    return (
        <div className="flex text-base font-light text-center justify-center my-10">

            <div className="rounded-2xl m-3 p-3 sm:w-1/3 w-1/2 h-32">
                <div className="animate-border text-base">
                    <p>Click the button below to continue </p>
                </div>

                <Link href="/authorized/content/mood-selection/">
                    <div className="text-base px-4 py-3 mt-5 animate-border inline-block rounded-3xl bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%]">
                        Change your mood
                    </div>
                </Link>
            </div>

        </div>
    );
}

export default ContinueComponent;