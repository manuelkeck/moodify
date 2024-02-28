'use client'

import {get_token_from_url, login_url} from "../../../spotify_api";
import SpotifyWebApi from "spotify-web-api-js";
import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import { useRouter } from "next/router";


const spotify = new SpotifyWebApi();

export default function AuthorizedPage() {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState<string | undefined>("User");
    const [cookies, setCookies] = useCookies(['spotifyToken', 'user', 'sessionExpiry']);
    const [topMessage, setTopMessage] = useState("Permission denied.");
    const [infoMessage, setInfoMessage] = useState("Request permissions: manuel.keck@student.reutlingen-university.de");
    const [continueButton, setContinueButton] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const _spotify_token = get_token_from_url().access_token;

    useEffect(() => {
        const sessionExpiryTime = cookies.sessionExpiry;
        const currentTime = Date.now();
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
            setCookies('user', name, {path: '/'});
            setCookies('spotifyToken', spotifyToken, {path: '/'});

            let tmp_msg = "Logged in as ";
            let tmp_msg_concat = ""
            if (name != null) {
                tmp_msg_concat = tmp_msg.concat(name);
            }
            setTopMessage(tmp_msg_concat);
            setInfoMessage("Spotify authorized successfully.");
            setContinueButton(true);
            console.log("Known user detected.");
        } else {
            console.log("No valid user detected. Permissions needed to use this spotify account.");
        }

        if (sessionExpiryTime && currentTime > sessionExpiryTime) {
            setSessionExpired(true);
        }

    }, [setCookies, spotifyToken, name, cookies.sessionExpiry, _spotify_token, sessionExpired]);

    return (
        <div
            className="text-white bg-black text-2xl font-extralight flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 text-center">
                <p>{topMessage}</p>
            </div>
            <div>
                <p>{infoMessage}</p>
            </div>
            {continueButton ? (
                <div
                    className="transition duration-150 ease-in-out mt-10 bg-gray-700 text-base hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                    <a href={`/authorized/content/mood-selection`}>Continue</a>
                </div>
            ) : (
                <div
                    className="transition duration-150 w-1/6 text-center text-base ease-in-out mt-10 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                    <a href={`/`}>Back</a>
                </div>
            )
            }

        </div>
    );
}