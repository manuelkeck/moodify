'use client'

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { login_url } from "../../spotify_api";


function Home() {

    function LoginComponent() {
        return (
            <div className="text-center">
                <p className="text-2xl font-extralight">
                    You need to login with your Spotify Premium account.
                </p>
                <div className="mt-24 flex-col justify-center items-center">
                    <div className="flex flex-col items-center">
                        <Image src="/Spotify_Logo_RGB_Green.png" alt="Spotify logo" width={100} height={50}/>
                        <div className="transition duration-150 ease-in-out mt-10 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                            <a href={login_url}>Login with Spotify</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-medium flex flex-col items-center justify-center bg-black text-white">
            <LoginComponent/>
        </div>
    );
}

export default Home;