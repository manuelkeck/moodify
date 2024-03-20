// Control elements reference: https://github.com/thelinmichael/spotify-web-api-node
// Player reference: https://github.com/gilbarbara/react-spotify-web-playback

import React, {useEffect, useState} from "react";

export default function Player({ playlist, trackURI, accessToken, deviceID }) {
    const SpotifyWebApi = require('spotify-web-api-node');
    const SpotifyPlayer = require('react-spotify-web-playback');
    const spotifyApi = new SpotifyWebApi();
    const iterator = 0;
    const [play, setPlay] = useState(false)

    spotifyApi.setAccessToken(accessToken);

    // console.log(deviceID);

    // useEffect(() => {setPlay(true)}, [trackURI]);

    const skipForwardsEvent = () => {
        spotifyApi.skipToNext()
            .then(function() {
                console.log('Skip to next');
            }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
            });
    }

    const playEvent = () => {
        spotifyApi.play()
            .then(function() {
                console.log('Playback started');
            }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
            });
    }

    const pauseEvent = () => {
        spotifyApi.pause()
            .then(function() {
                console.log('Playback paused');
            }, function(err) {
                //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
                console.log('Something went wrong!', err);
            });
    }

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
                autoPlay={true}
                showSaveIcon={true}
                name={"Moodify Webplayer"}
                uris={trackURI}
                layout={'compact'}
                styles={{
                    activeColor: '#fff',
                    bgColor: '#000000',
                    color: '#fff',
                    loaderColor: '#fff',
                    sliderColor: '#1cb954',
                    trackArtistColor: '#ccc',
                    trackNameColor: '#fff',
                    sliderHandleColor: '#fff',
                    height: 100
                }}
            />
        </div>
    );
}