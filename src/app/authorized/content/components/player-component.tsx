// https://developer.spotify.com/documentation/web-playback-sdk/howtos/web-app-player

'use client'

import React, {useEffect, useState} from "react";

interface SpotifyPlayerProps {
    token: string;
}

interface Track {
    name: string;
    artist: string;
    uri: string;
}

const PlayerComponent: React.FC<SpotifyPlayerProps> = (props) => {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [track, setTrack] = useState<Track | null>(null);
    const [paused, setPaused] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
            console.log("use effect from player called");

            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;

            document.body.appendChild(script);

            console.log("Token:", props.token);

            (window as any).onSpotifyWebPlaybackSDKReady = () => {
                const newPlayer = new (window as any).Spotify.Player({
                    name: 'Web Playback SDK',
                    getOAuthToken: (cb: (token: string) => void) => {
                        cb(props.token);
                    },
                    volume: 0.5
                });

                setPlayer(newPlayer);

                newPlayer.addListener('ready', ({device_id}: any) => {
                    console.log('Ready with Device ID', device_id);
                });

                newPlayer.addListener('not_ready', ({device_id}: any) => {
                    console.log('Device ID has gone offline', device_id);
                });

                newPlayer.addListener('player_state_changed', (state: Spotify.PlaybackState) => {
                    if (!state) {
                        return;
                    }

                    setTrack({
                        name: state.track_window.current_track.name,
                        artist: state.track_window.current_track.artists[0].name,
                        uri: state.track_window.current_track.uri
                    });
                    setPaused(state.paused);

                    newPlayer.getCurrentState().then((state: any) => {
                        setActive(!!state);
                    });
                });

                newPlayer.connect();
            };

            return () => {
                if (player) {
                    player.disconnect();
                }
            };
        }, []);

    return (
        <div>
            <p>Spotify webplayer</p>
        </div>
    );
}

export default PlayerComponent;