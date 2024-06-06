import React, {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import SessionExpiredPopupComponent from "@/components/guest/session-expired-popup-component";
import Image from "next/image";
import Player from "@/app/spotify-player/player";
import CarModePlayer from "@/app/spotify-player/car-mode-player";

interface recommendationObject {
    tracks: {
        name: string;
        id: string;
        artists: {
            name: [];
        }[];
        album: {
            images: {
                url: string;
                width: number;
                height: number;
            }[];
        };
        external_urls: {
            spotify: string;
        };
        uri: string;
    }[];
}

interface componentProps {
    energy_state: string;
    carMode: boolean;
}

const RecommendationComponent: React.FC<componentProps> = ({ energy_state, carMode}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [recommendation, setRecommendation] = useState<recommendationObject | null>(null);
    const [releasePlayer, setReleasePlayer] = useState(false);

    const [cookies] = useCookies();
    const recommendationComponentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cookies.sp_auth0 !== "" && cookies.sp_auth0 !== undefined) {
            getRecommendations("init", "").then(r => "");
        }
    }, []);

    useEffect(() => {
        if (recommendation !== null) {
            setReleasePlayer(true)
        }
    }, [recommendation]);

    useEffect(() => {
        // At mood change
        if (recommendation !== null) {
            updatePlaylist().then(r => "")
        }
    }, [energy_state]);

    async function getRecommendations(type: string, url: string) {
        let _url = ""

        if (type === "init") {
            _url = await getRecommendationsURL()
        } else if (type === "update" ) {
            _url = url
        }

        // Get recommendations
        await fetchRecommendation(_url)
            .then((response) => {
                setRecommendation(response);
            })
            .catch((error) => {
                console.error('Error while fetching data in recommendation:', error);
            });
    }

    async function getRecommendationsURL() {
        let _tmp_url = "https://api.spotify.com/v1/recommendations?limit=20&";
        const [id1, id2, id3] = await getTopTracks();
        const tracks = [id1, id2, id3]

        let _seed_tracks = "seed_tracks=";
        tracks.forEach((id) => {
            if (id !== undefined) {
                if (_seed_tracks !== "seed_tracks=") {
                    _seed_tracks = _seed_tracks.concat("%2C");
                }
                _seed_tracks = _seed_tracks.concat(id);
            }
        });
        _tmp_url = _tmp_url.concat(_seed_tracks)
        return _tmp_url
    }

    async function updatePlaylist() {
        let currentSongID

        // Get current song
        await fetchCurrentlyPlayingTrack()
            .then((response) => {
                currentSongID = response.item.id
            })
            .catch((error) => {
                console.error('Error while fetching data for currently playing track:', error);
            });

        if (currentSongID === undefined) {
            if (recommendation) {
                currentSongID = recommendation.tracks[0].id
            } else {
                await getRecommendations("init", "")
                return
            }
        }

        // Get data for currently playing track
        const audioFeaturesObject = await fetchTrackAudioFeatures(currentSongID)
        let currentEnergy = parseFloat(audioFeaturesObject.energy.toFixed(1));
        let previousEnergy = currentEnergy

        // Adjust energy level of recommendations and fetch new recommendations
        if (currentEnergy > 0.9) {
            currentEnergy = 1.0
        } else {
                /*
                                     "optimal energy"
                                            ^
                                           / \
                                          /   \
               "too little energy" ------------------- "pent-up energy"
                                        /       \
                                       /         \
                                      /           \
                                     /             \
                                    /               \
                            "no energy"         "blocked energy"
            */
            switch (energy_state) {
                case "no energy": currentEnergy = Math.min(currentEnergy + 0.5, 1.0); break;
                case "too little energy": currentEnergy = Math.min(currentEnergy + 0.2, 1.0); break;
                // case "optimal energy": -> keep energy level of tracks
                case "pent-up energy": currentEnergy = Math.max(currentEnergy - 0.2, 0.0); break;
                case "blocked energy": currentEnergy = Math.max(currentEnergy - 0.5, 0.0); break;
            }
        }

        console.log("Previous energy level of song recommendations:", previousEnergy)
        console.log("Updated energy level of song recommendations:", currentEnergy)

        // Concat new URL with adjusted energy level
        let _url = await getRecommendationsURL()
        _url = _url.concat(`&energy=${currentEnergy}`)

        await getRecommendations("update", _url)
    }

    function getTopTracks(): Promise<[string | undefined, string | undefined, string | undefined]> {
        let track_one
        let track_two
        let track_three

        // Check if cached data is available
        const cachedDataObject = sessionStorage.getItem('cachedTopTracks');
        if (cachedDataObject) {
            const parsedData = JSON.parse(cachedDataObject);

            if (parsedData.total >= 3) {
                track_one = parsedData.items[0].id;
                track_two = parsedData.items[1].id;
                track_three = parsedData.items[2].id;
            } else if (parsedData.total === 0) {
                track_one = undefined;
                track_two = undefined;
                track_three = undefined;
            } else if (parsedData.total === 1) {
                track_one = parsedData.items[0].id;
                track_two = undefined;
                track_three = undefined;
            } else if (parsedData.total === 2) {
                track_one = parsedData.items[0].id;
                track_two = parsedData.items[1].id;
                track_three = undefined;
            }
        }

        return Promise.resolve([track_one, track_two, track_three]);
    }

    async function fetchRecommendation(url: string): Promise<any> {
        try {
            const response_recommendation = await fetch(
                url, {
                    headers: {
                        Authorization: `Bearer ${cookies.sp_auth0}`
                    }
                });

            if (!response_recommendation.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await response_recommendation.json();

        } catch (error) {
            handleSessionExpired();
            throw error;
        }
    }

    async function fetchCurrentlyPlayingTrack(): Promise<any> {
        try {
            const currentSong = await fetch(
                "https://api.spotify.com/v1/me/player/currently-playing", {
                    headers: {
                        Authorization: `Bearer ${cookies.sp_auth0}`
                    }
                });

            if (!currentSong.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await currentSong.json();

        } catch (error) {
            handleSessionExpired();
            throw error;
        }
    }

    async function fetchTrackAudioAnalysis(id: string): Promise<any> {
        const _url = "https://api.spotify.com/v1/audio-analysis/";
        const _concatenatedURL = _url.concat(id);

        try {
            const audioAnalysis = await fetch(
                _concatenatedURL, {
                    headers: {
                        Authorization: `Bearer ${cookies.sp_auth0}`
                    }
                });

            if (!audioAnalysis.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await audioAnalysis.json();

        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchTrackAudioFeatures(id: string): Promise<any> {
        const _url = "https://api.spotify.com/v1/audio-features/";
        const _concatenatedURL = _url.concat(id);

        try {
            const audioFeatures = await fetch(
                _concatenatedURL, {
                    headers: {
                        Authorization: `Bearer ${cookies.sp_auth0}`
                    }
                });

            if (!audioFeatures.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await audioFeatures.json();

        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    const handleSessionExpired = () => {
        if (!showPopup) {
            // removeCookie('spotifyToken', { path: '/' });
            setShowPopup(true);
        }
    };

    const onPopupClose = () => {
        setShowPopup(false);
    }

    const getAudioFeatures = (recommendedTracks: any) => {
        const trackId = recommendedTracks.tracks[0].id;
        const amountArtists = recommendedTracks.tracks[0].artists.length

        if (amountArtists === 1) {
            console.log(recommendedTracks.tracks[0].name, " from ", recommendedTracks.tracks[0].artists[0].name);
        }
        if (amountArtists === 2) {
            console.log(recommendedTracks.tracks[0].name, " from ", recommendedTracks.tracks[0].artists[0].name, ", ", recommendedTracks.tracks[0].artists[1].name);
        }
        if (amountArtists === 3) {
            console.log(recommendedTracks.tracks[0].name, " from ", recommendedTracks.tracks[0].artists[0].name, ", ", recommendedTracks.tracks[0].artists[1].name, ", ", recommendedTracks.tracks[0].artists[2].name);
        }

        console.log("Track audio analysis");
        fetchTrackAudioAnalysis(trackId)
            .then((analysis) => {
                console.log("Track audio analysis: ", analysis);
            })
            .catch((error) => {
                console.error('Error while fetching data in recommendation:', error);
            });

        console.log("Track audio features");
        fetchTrackAudioFeatures(trackId)
            .then((analysis) => {
                console.log("Track audio features: ", analysis);
            })
            .catch((error) => {
                console.error('Error while fetching data in recommendation:', error);
            });
    }

    return (
        <div className="text-2xl font-extralight">

            <div className="flex flex-wrap justify-center">
                {/*<div className={`m-5 w-ful ${carMode ? "w-1/4 flex-row" : "sm:w-96 flex-col"}`}>*/}
                <div className="w-full sm:w-96 flex-col">
                    {showPopup && (
                        <SessionExpiredPopupComponent onClose={onPopupClose}/>
                    )}

                    {releasePlayer ? (
                        <>
                            <div className="">
                                {recommendation !== null && (!('error' in recommendation)) ? (
                                    <div className="">
                                        <div
                                            className="sm:bg-gradient-radial from-black via-black to-gray-800 rounded-2xl">
                                            <Player
                                                playlist={recommendation}
                                                accessToken={cookies.sp_auth0}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-base">An error occurred. Reload website.</p>
                                )}
                            </div>
                            {/*<EvaluationComponent
                                name={cookies.user}
                                currentMood={moodTransformation.current}
                                targetMood={moodTransformation.target}
                                recURL={currentRecommendationURL}
                            />*/}
                        </>
                    ) : (
                        <>
                            <p className="text-base">Loading ...</p>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-1">
                <p className="text-xs font-normal">
                    {/**The recommendations are based on users top 2 artists and top 3 titles derived from the data of the last six weeks, with additional.*/}
                </p>
                <div className="text-xs font-normal flex items-center justify-center">
                    <p>Data provided by </p>
                    <Image src="/Spotify_Logo_RGB_White.png" width={70} height={10} alt="Spotify logo"
                           className="ml-1"></Image>
                </div>
            </div>
        </div>
    );
}

export default RecommendationComponent