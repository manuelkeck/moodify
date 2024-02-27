'use client'

import {get_token_from_url, login_url} from "../../../spotify_api";
import SpotifyWebApi from "spotify-web-api-js";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { CookiesProvider, useCookies } from "react-cookie";

const spotify = new SpotifyWebApi();

export default function AuthorizedPage() {
    const [spotifyToken, setSpotifyToken] = useState("")
    const [name, setName] = useState<string | undefined>("User");
    const [cookies, setCookies] = useCookies(['spotifyToken', 'user'])

    useEffect(() => {
        // console.log("From the URL: ", get_token_from_url());
        const _spotify_token = get_token_from_url().access_token;
        // delete token from URI
        window.location.hash = "";

        if (_spotify_token) {
            setSpotifyToken(_spotify_token)
            spotify.setAccessToken(_spotify_token)

            spotify.getMe().then((user) => {
                // console.log("This is you: ", user.display_name)
                setName(user.display_name)
            });
        }

        // Cookies
        setCookies('user', name, { path: '/' })
        setCookies('spotifyToken', spotifyToken, { path: '/' })
    }, [setCookies, spotifyToken, name]);


    return (
        <div
            className="text-white bg-black text-2xl font-extralight flex flex-col items-center justify-center pt-80 pb-80">
            <div className="text-4xl mb-4">
                <p>Logged in as {name}.</p>
            </div>
            <div>
                <p>Spotify authorized successfully.</p>
            </div>
            <div className="text-sm mt-20 bg-gray-700 hover:bg-gray-800 text-white font-light py-2 px-4 rounded-2xl cursor-pointer">
                <Link href='/authorized/content/mood-selection/'>
                    Continue
                </Link>
            </div>
        </div>
    );
}