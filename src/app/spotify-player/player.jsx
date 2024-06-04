// Control elements reference: https://github.com/thelinmichael/spotify-web-api-node
// Player reference: https://github.com/gilbarbara/react-spotify-web-playback

import React, {useEffect, useState} from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ playlist, accessToken }) {
    const SpotifyPlayer = require('react-spotify-web-playback');
    const [play, setPlay] = useState(false)
    const [tmpPlaylist, setTmpPlaylist] = useState([]);

    useEffect(() => {
        const _playlist = [];
        for (let key in playlist.tracks) {
            _playlist.push(playlist.tracks[key].uri);
        }
        setTmpPlaylist(_playlist);
    }, [playlist]);

    useEffect(() => {setPlay(true)}, [tmpPlaylist]);

    return (
        <div>
            {/*<div*/}
            {/*    className="bg-gray-900 py-10 px-3 mb-10 rounded-lg max-w-md mx-auto flex flex-col items-center w-60">*/}
            {/*    <a href={playlist.tracks[0].external_urls.spotify}*/}
            {/*       target="_blank"*/}
            {/*       rel="noopener noreferrer" className="items-center">*/}
            {/*        <img src={playlist.tracks[0].album.images[1].url}*/}
            {/*             alt="Album cover"*/}
            {/*             className="mx-auto"*/}
            {/*             width={(playlist.tracks[0].album.images[1].width) * 0.5}*/}
            {/*             height={playlist.tracks[0].album.images[1].height}/>*/}
            {/*        <div className="flex-col">*/}
            {/*            <p className="pt-5">{playlist.tracks[0].name}</p>*/}
            {/*            <div className="text-base">*/}
            {/*                {playlist.tracks[0].artists.map(artist => artist.name).join(', ')}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </a>*/}
            {/*</div>*/}
            <SpotifyPlayer
                token={accessToken}
                play={play}
                showSaveIcon={true}
                name={"Moodify Webplayer"}
                uris={tmpPlaylist}
                layout={'compact'}
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