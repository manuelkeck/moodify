'use client'

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { login_url } from "../../spotify_api";
import {debuglog} from "node:util";


function Home() {

    function handleClick() {
        console.log("Button clicked");
    }

    function LoginComponent() {
        return (
            <div className="text-center p-10">
                <p className="text-2xl font-extralight">
                    You need to login with your Spotify Premium account.
                </p>
                <div className="mt-24 flex-col justify-center items-center">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Image src="/Spotify_Logo_RGB_Green.png" alt="Spotify logo" width={100} height={50}/>
                        <div className="mt-10 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                            <a href={login_url}>Login with Spotify</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-56 font-medium flex flex-col items-center justify-center p-24 bg-black text-white">
            <LoginComponent/>
            <div className="pb-80">

            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
                <Link
                    href="/content/mood-selection/"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_parent"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        Start with getting mood based music recommendations{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                    </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Text ...
                    </p>
                </Link>
            </div>
        </div>
    );
}

export default Home;