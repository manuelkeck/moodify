'use client'

import Image from "next/image";
import React, {useEffect, useState} from "react";
import { login_url } from "../../spotify_api";
import {useCookies} from "react-cookie";
import TopArtistComponent from "@/app/authorized/content/components/top-artists-component";
import Link from "next/link";
import ContinueComponent from "@/app/continue-component";


function Home() {
    const [cookies, removeCookie] = useCookies();
    const [hasSession, setHasSession] = useState(false);
    const [loginButton, setLoginButton] = useState(true);
    const [message, setMessage] = useState("You need to login with your Spotify Premium account.");

    useEffect(() => {
        if (cookies.spotifyToken) {
            // console.log(cookies.spotifyToken);
            if (cookies.spotifyToken.path !== "/" && cookies.spotifyToken.path !== "/authorized") {
                setHasSession(true);
            } else {
                setHasSession(false);
            }
        } else {
            setHasSession(false);
        }
        // console.log(hasSession);
    }, [cookies.spotifyToken]);

    useEffect(() => {
        if (hasSession) {
            setMessage("You are already logged in with your Spotify Premium account.");
            setLoginButton(false);
        } else {
            setMessage("You need to login with your Spotify Premium account.");
            setLoginButton(true);
        }
    }, [hasSession]);

    function LoginComponent() {
        return (
            <div className="text-center">
                <p className="sm:text-2xl text-base font-extralight">
                    {message}
                </p>
                <div className="mt-8 lg:mt-24 flex-col justify-center items-center">
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
                    className="transition duration-150 ease-in-out mt-10 bg-green-600 active:bg-green-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                    <a href={login_url}>Login with Spotify</a>
                </div>
            ) : (
                <div className="flex-col">
                    <ContinueComponent />
                    <TopArtistComponent />
                </div>
            )}
        </div>
    );
}

export default Home;