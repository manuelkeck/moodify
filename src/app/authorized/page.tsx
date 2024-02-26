'use client'

import { get_token_from_url } from "../../../spotify_api";
import SpotifyWebApi from "spotify-web-api-js";
import {useEffect, useState} from "react";

const spotify = new SpotifyWebApi();

export default function AuthorizedPage() {
    const [spotifyToken, setSpotifyToken] = useState("")
    const [name, setName] = useState<string | undefined>("User");

    useEffect(() => {
        // console.log("From the URL: ", get_token_from_url());
        // spotify token
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
    }, []);

    return (
        <div
            className="text-white bg-black text-2xl font-extralight flex flex-col items-center justify-center pt-80 pb-80">
            <div className="text-4xl mb-4">
                <p>Hi, {name}!</p>
            </div>
            <div>
                <p>You authorized Spotify successfully.</p>
            </div>
        </div>


    );
}