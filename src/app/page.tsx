'use client'

import Image from "next/image";
import React, {useEffect, useState} from "react";
import { login_url } from "../../spotify_api";
import {useCookies} from "react-cookie";
import TopArtistComponent from "@/app/authorized/top-artists-component";


function Home() {
    const [cookies] = useCookies(['spotifyToken']);
    const hasSession = cookies.spotifyToken !== undefined;
    const [loginButton, setLoginButton] = useState(true);
    const [message, setMessage] = useState("You need to login with your Spotify Premium account.");

    console.log("Session: ", hasSession)

    useEffect(() => {
        if (hasSession) {
            setMessage("You are already logged in with your Spotify Premium account.")
            setLoginButton(false)
        }
    }, [hasSession]);

    function LoginComponent() {
        return (
            <div className="text-center">
                <p className="text-2xl font-extralight">
                    {message}
                </p>
                <div className="mt-24 flex-col justify-center items-center">
                    <div className="flex flex-col items-center">
                        <Image src="/Spotify_Logo_RGB_Green.png" alt="Spotify logo" width={100} height={50}/>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-medium flex flex-col items-center justify-center bg-black text-white">
            <LoginComponent />
            {loginButton ? (
                <div
                    className="transition duration-150 ease-in-out mt-10 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                    <a href={login_url}>Login with Spotify</a>
                </div>
            ) : (
                <div className="flex-col">
                    <div className="flex justify-center items-center">
                        <div
                            className="transition duration-150 w-28 text-center ease-in-out mt-10 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                            <a href={`/authorized/content/mood-selection`}>Continue</a>
                        </div>
                    </div>

                    <TopArtistComponent/>
                </div>
            )
            }
        </div>
    );
}

export default Home;