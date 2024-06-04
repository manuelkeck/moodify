import Link from "next/link";
import React from "react";

const ContinueComponent = () => {

    return (
        <div className="flex text-base font-extralight text-center justify-center my-10">

            <div className="">
                <div className="text-base">
                    <p>Select a mode to continue with Moodify</p>
                </div>

                <div className="flex flex-wrap justify-center">
                    <div className="flex">
                        <Link href="/spotify-authorized/user">
                            <div
                                className="relative text-base px-2 py-3 mr-2 ml-2 mt-3 w-40 h-28 animate-border rounded-3xl bg-white bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] flex items-center justify-center">
                                <span
                                    className="absolute w-14 rounded top-0 left-0 bg-red-600 text-white text-xs font-bold px-1 py-0.5 -rotate-[25deg] origin-top-left translate-x-[-20%] translate-y-[70%] bg-clip-border">
                                    beta
                                </span>
                                Apple Watch Mood Recognition
                            </div>
                        </Link>
                    </div>

                    <div className="flex">
                        <Link href="/spotify-authorized/guest/content/mood-selection">
                            <div
                                className="text-base px-2 py-3 mr-2 ml-2 mt-3 w-40 h-28 rounded-3xl bg-gray-700 flex items-center justify-center">
                                Use Moodify without Peripherie
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ContinueComponent;