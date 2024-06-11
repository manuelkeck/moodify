import React, { useState, useEffect } from 'react';

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

function WebPlayback({ recommendations, token }) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(defaultTrack);
    const [trackIndex, setTrackIndex] = useState(0);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Moodify Webplayer',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', async ({ device_id }) => {
                console.log('Ready with Device ID', device_id);

                // Transfer playback to the Web Player instance
                await transferPlaybackHere(device_id, token);

                // Load the first track when the player is ready
                if (recommendations.length > 0) {
                    player.queue(recommendations[0].tracks[0].uri);
                    player.nextTrack();
                }
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true);
                });

                if (state.paused && state.position === 0 && !state.track_window.previous_tracks.includes(state.track_window.current_track)) {
                    // Automatically play the next track when the current track finishes
                    const nextIndex = (trackIndex + 1) % recommendations[0].tracks.length;
                    setTrackIndex(nextIndex);
                    player.queue(recommendations[0].tracks[nextIndex].uri);
                    player.nextTrack();
                }
            }));

            player.connect();
        };
    }, [recommendations]);

    const transferPlaybackHere = async (device_id, token) => {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            body: JSON.stringify({
                device_ids: [device_id],
                play: true,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log('Playback transferred successfully.');
        } else {
            console.error('Failed to transfer playback.');
        }
    };

    return (
        <>
            <div className="container">
                <div className="main-wrapper">

                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>

                        <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                            &lt;&lt;
                        </button>

                        <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                            {is_paused ? "PLAY" : "PAUSE"}
                        </button>

                        <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                            &gt;&gt;
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WebPlayback;
