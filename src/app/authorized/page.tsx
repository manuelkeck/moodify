'use client'

import {get_token_from_url, login_url} from "../../../spotify_api";
import SpotifyWebApi from "spotify-web-api-js";
import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import TopArtistComponent from "@/app/authorized/content/components/top-artists-component";
import Link from "next/link";
import Script from "next/script";
import ContinueComponent from "@/app/continue-component";

const spotify = new SpotifyWebApi();

export default function AuthorizedPage() {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState<string | undefined>("User");
    const [cookies, setCookie, removeCookie] = useCookies();
    const [topMessage, setTopMessage] = useState("Permission denied.");
    const [infoMessage, setInfoMessage] = useState("Request permissions: manuel.keck@student.reutlingen-university.de");
    const [continueButton, setContinueButton] = useState(false);

    useEffect(() => {
        const _spotify_token = get_token_from_url().access_token;
        window.location.hash = "";

        if (_spotify_token) {
            setSpotifyToken(_spotify_token);
            spotify.setAccessToken(_spotify_token);

            spotify.getMe().then((user) => {
                // console.log("This is you: ", user.display_name)
                setName(user.display_name);
            });
        }

        if (name !== 'User') {
            console.log("User: ", name);

            // Cookies
            setCookie('user', name, {path: '/', maxAge: 3600});
            setCookie('spotifyToken', spotifyToken, {path: '/authorized', maxAge: 3600});

            let tmp_msg = "Logged in as ";
            let tmp_msg_concat = ""
            if (name != null) {
                tmp_msg_concat = tmp_msg.concat(name);
            }
            setTopMessage(tmp_msg_concat);
            setInfoMessage("Spotify authorized successfully.");
            setContinueButton(true);
        } else {
            console.log("No valid user detected. Permissions needed to use this spotify account.");
        }

    }, [spotifyToken, name]);

    return (
        <div
            className="text-white bg-black text-center text-2xl font-extralight flex flex-col items-center justify-center">
            <div className="lg:text-4xl mb-4">
                <p>{topMessage}</p>
            </div>
            <div className="lg:text-2xl text-base">
                <p>{infoMessage}</p>
            </div>
            {continueButton ? (
                <div className="text-center">
                    <ContinueComponent />
                    <TopArtistComponent />
                </div>

            ) : (
                <div
                    className="transition duration-150 w-28 text-center text-base ease-in-out mt-10 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                    <Link href="/">Back</Link>
                </div>
            )}
        </div>
    );
}