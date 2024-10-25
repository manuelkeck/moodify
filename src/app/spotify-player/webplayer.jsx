import React, { useState, useEffect } from 'react';
import SpotifyPlayer from "react-spotify-web-playback";

const defaultTrack = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
};

export default function WebPlayer({ songURI, token }) {
    const SpotifyPlayer = require('react-spotify-web-playback');
    const [play, setPlay] = useState(false)

    useEffect(() => {setPlay(true)}, [songURI]);

    return (
        <div>
            <SpotifyPlayer
                token={token}
                play={play}
                showSaveIcon={true}
                name={"Moodify Voice Assist"}
                uris={songURI}
                layout={'compact'}
                initialVolume={20}
                styles={{
                    activeColor: '#fff',
                    bgColor: '#000000',
                    color: '#fff',
                    loaderColor: '#fff',
                    sliderColor: '#1cb954',
                    trackArtistColor: '#ccc',
                    trackNameColor: '#fff',
                    sliderHandleColor: '#fff'
                }}
            />
        </div>
    );
}