import React, {useDebugValue, useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import SessionExpiredPopupComponent from "@/app/authorized/content/components/session-expired-popup-component";
import Image from "next/image";
import MoodTransformationAttributes from "@/app/authorized/content/components/helper/mood-transformation-attributes";
import EvaluationComponent from "@/app/authorized/content/components/evaluation";
import Player from "@/app/authorized/content/components/spotify-player/player";
import CarModePlayer from "@/app/authorized/content/components/spotify-player/car-mode-player";

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

interface MoodTuple {
    current: string;
    target: string;
}

interface selectedMoodProps {
    selectedValue: MoodTuple;
    carMode: boolean;
}

const RecommendationComponent: React.FC<selectedMoodProps> = ({ selectedValue, carMode }) => {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [recommendation, setRecommendation] = useState<recommendationObject | null>(null);
    const [currentRecommendationURL, setCurrentRecommendationURL] = useState("");
    const [moodTransformation, setMoodTransformation] = useState<MoodTuple>({current: "", target: ""});
    const [releaseButtons, setReleaseButtons] = useState(false);

    const [cookies] = useCookies();
    const recommendationComponentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cookies.spotifyToken) {
            setSpotifyToken(cookies.spotifyToken || "");
            // setName(cookies.user || "unknown user")
        } else {
            setShowPopup(true);
        }
    }, [cookies.user, cookies.spotifyToken]);

    useEffect(() => {
        // Check if both moods are selected
        if (selectedValue.current !== "" && selectedValue.target !== "") {
            setMoodTransformation(selectedValue);
            setReleaseButtons(true);
        } else {
            setReleaseButtons(false);
        }
        //setSelectedMood(selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        if (spotifyToken) {
            if (moodTransformation.current && moodTransformation.target) {
                Promise.all([fetchTracks(), fetchArtists()])
                    .then(([_tracksData, _artistsData]) => {

                        // Create URL to request suitable recommendations
                        let _base_url = "https://api.spotify.com/v1/recommendations?limit=20&";
                        let _seed_tracks = "seed_tracks=";
                        let _seed_artists = "seed_artists=";

                        _tracksData.forEach((id) => {
                            if (id !== undefined) {
                                if (_seed_tracks !== "seed_tracks=") {
                                    _seed_tracks = _seed_tracks.concat("%2C");
                                }
                                _seed_tracks = _seed_tracks.concat(id);
                            }
                        });
                        _artistsData.forEach((id) => {
                            if (id !== undefined) {
                                if (_seed_artists !== "seed_artists=") {
                                    _seed_artists = _seed_artists.concat("%2C");
                                }
                                _seed_artists = _seed_artists.concat(id);
                            }
                        });

                        let url = _base_url.concat(_seed_artists);
                        url = url.concat("&");
                        url = url.concat(_seed_tracks);

                        getRecommendations(url);

                    })
                    .catch((error) => {
                        console.error('Error while fetching data:', error);
                    });
            }
        }

    }, [spotifyToken, moodTransformation]);

    async function fetchTracks(): Promise<[any, any, any]> {
        let track_one
        let track_two
        let track_three

        // Check if cached data is available
        const cachedDataObject = sessionStorage.getItem('cachedTopTracks');
        if (cachedDataObject) {
            console.log("Fetching users top tracks for recommendation: Using cached data from session storage");

            const parsedData = JSON.parse(cachedDataObject);

            console.log(parsedData)

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

            return [track_one, track_two, track_three];
        }

        try {
            console.log("Fetching users top tracks: No cached data found in session storage. API will be requested.");

            const topTracks = await fetch(
                "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=3", {
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`
                    }
                });

            if (!topTracks.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            let _data = await topTracks.json();
            sessionStorage.setItem('cachedTopTracks', JSON.stringify(_data));

           if (_data.total >= 3) {
                track_one = _data.items[0].id;
                track_two = _data.items[1].id;
                track_three = _data.items[2].id;
            } else if (_data.total === 0) {
                track_one = undefined;
                track_two = undefined;
                track_three = undefined;
            } else if (_data.total === 1) {
                track_one = _data.items[0].id;
                track_two = undefined;
                track_three = undefined;
            } else if (_data.total === 2) {
                track_one = _data.items[0].id;
                track_two = _data.items[1].id;
                track_three = undefined;
            }

            return [track_one, track_two, track_three];

        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchArtists(): Promise<[any, any]> {
        let artist_one
        let artist_two

        // Check if cached data is available
        const cachedDataObject = sessionStorage.getItem('cachedTopArtists');
        if (cachedDataObject) {
            console.log("Fetching users top artists for recommendation: Using cached data from session storage");

            const parsedData = JSON.parse(cachedDataObject);

            if (parsedData.total >= 2) {
                artist_one = parsedData.items[0].id;
                artist_two = parsedData.items[1].id;
            } else if (parsedData.total === 0) {
                artist_one = undefined;
                artist_two = undefined;
            } else if (parsedData.total === 1) {
                artist_one = parsedData.items[0].id;
                artist_two = undefined;
            }

            return [artist_one, artist_two];
        }

        try {
            console.log("Fetching users top artists for recommendation: No cached data found in session storage. API will be requested.");

            const topArtists = await fetch(
                "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10", {
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`
                    }
                });

            if (!topArtists.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            let _data = await topArtists.json();
            sessionStorage.setItem('cachedTopArtists', JSON.stringify(_data));

            if (_data.total >= 2) {
                artist_one = _data.items[0].id;
                artist_two = _data.items[1].id;
            } else if (_data.total === 0) {
                artist_one = undefined;
                artist_two = undefined;
            } else if (_data.total === 1) {
                artist_one = _data.items[0].id;
                artist_two = undefined;
            }

            return [artist_one, artist_two];

        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchRecommendation(url: string, mood: MoodTuple): Promise<any> {

        // Check if cached data is available
        let _cachedDataObject;

        switch (`${mood.current}:${mood.target}`) {
            case "":
                _cachedDataObject = sessionStorage.getItem('cachedRecommendations');
                break;
            case "angry:happy":
                _cachedDataObject = sessionStorage.getItem('cachedAngryHappyRecommendations');
                break;
            case "angry:relaxed":
                _cachedDataObject = sessionStorage.getItem('cachedAngryRelaxedRecommendations');
                break;
            case "angry:energized":
                _cachedDataObject = sessionStorage.getItem('cachedAngryEnergizedRecommendations');
                break;
            case "angry:focused":
                _cachedDataObject = sessionStorage.getItem('cachedAngryFocusedRecommendations');
                break;
            case "tired:happy":
                _cachedDataObject = sessionStorage.getItem('cachedTiredHappyRecommendations');
                break;
            case "tired:relaxed":
                _cachedDataObject = sessionStorage.getItem('cachedTiredRelaxedRecommendations');
                break;
            case "tired:energized":
                _cachedDataObject = sessionStorage.getItem('cachedTiredEnergizedRecommendations');
                break;
            case "tired:focused":
                _cachedDataObject = sessionStorage.getItem('cachedTiredFocusedRecommendations');
                break;
            case "stressed:happy":
                _cachedDataObject = sessionStorage.getItem('cachedStressedHappyRecommendations');
                break;
            case "stressed:relaxed":
                _cachedDataObject = sessionStorage.getItem('cachedStressedRelaxedRecommendations');
                break;
            case "stressed:energized":
                _cachedDataObject = sessionStorage.getItem('cachedStressedEnergizedRecommendations');
                break;
            case "stressed:focused":
                _cachedDataObject = sessionStorage.getItem('cachedStressedFocusedRecommendations');
                break;
            case "shocked:happy":
                _cachedDataObject = sessionStorage.getItem('cachedShockedHappyRecommendations');
                break;
            case "shocked:relaxed":
                _cachedDataObject = sessionStorage.getItem('cachedShockedRelaxedRecommendations');
                break;
            case "shocked:energized":
                _cachedDataObject = sessionStorage.getItem('cachedShockedEnergizedRecommendations');
                break;
            case "shocked:focused":
                _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
                break;
            case "sad:happy":
                // _cachedDataObject = sessionStorage.getItem('cachedSadHappyRecommendations');
                break;
            case "heartbroken:healed":
                // _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
                break;
            default:
                console.log("Get recommendation: no item in session storage found.");
        }

        if (_cachedDataObject) {
            if (mood.current === "") {
                console.log("Fetching recommendations without mood selected: Using cached data from session storage");
            } else {
                console.log("Transform", mood.current, "to", mood.target, "- Using cached data from session storage");
            }
            return JSON.parse(_cachedDataObject);

        } else {
            if (mood.current && mood.target) {
                console.log("Transform", mood.current, "to", mood.target, "- Calling API...");
            } else {
                console.log("Default recommendation - Calling API...");
            }

            try {
                const response_recommendation = await fetch(
                    url, {
                        headers: {
                            Authorization: `Bearer ${spotifyToken}`
                        }
                    });

                if (!response_recommendation.ok) {
                    handleSessionExpired();
                    new Error('Network response was not ok');
                }

                let _data = await response_recommendation.json();

                if (!('error' in _data)) {
                    console.log("API called successfully. Set session storage");
                    switch (`${moodTransformation.current}:${moodTransformation.target}`) {
                        case "":
                            sessionStorage.setItem('cachedRecommendations', JSON.stringify(_data));
                            break;
                        case "angry:happy":
                            sessionStorage.setItem('cachedAngryHappyRecommendations', JSON.stringify(_data));
                            break;
                        case "angry:energized":
                            sessionStorage.setItem('cachedAngryEnergizedRecommendations', JSON.stringify(_data));
                            break;
                        case "angry:relaxed":
                            sessionStorage.setItem('cachedAngryRelaxedRecommendations', JSON.stringify(_data));
                            break;
                        case "angry:focused":
                            sessionStorage.setItem('cachedAngryFocusedRecommendations', JSON.stringify(_data));
                            break;
                        case "tired:happy":
                            sessionStorage.setItem('cachedTiredHappyRecommendations', JSON.stringify(_data));
                            break;
                        case "tired:energized":
                            sessionStorage.setItem('cachedTiredEnergizedRecommendations', JSON.stringify(_data));
                            break;
                        case "tired:relaxed":
                            sessionStorage.setItem('cachedTiredRelaxedRecommendations', JSON.stringify(_data));
                            break;
                        case "tired:focused":
                            sessionStorage.setItem('cachedTiredFocusedRecommendations', JSON.stringify(_data));
                            break;
                        case "stressed:happy":
                            sessionStorage.setItem('cachedStressedHappyRecommendations', JSON.stringify(_data));
                            break;
                        case "stressed:energized":
                            sessionStorage.setItem('cachedStressedEnergizedRecommendations', JSON.stringify(_data));
                            break;
                        case "stressed:relaxed":
                            sessionStorage.setItem('cachedStressedRelaxedRecommendations', JSON.stringify(_data));
                            break;
                        case "stressed:focused":
                            sessionStorage.setItem('cachedStressedFocusedRecommendations', JSON.stringify(_data));
                            break;
                        case "shocked:happy":
                            sessionStorage.setItem('cachedShockedHappyRecommendations', JSON.stringify(_data));
                            break;
                        case "shocked:energized":
                            sessionStorage.setItem('cachedShockedEnergizedRecommendations', JSON.stringify(_data));
                            break;
                        case "shocked:relaxed":
                            sessionStorage.setItem('cachedShockedRelaxedRecommendations', JSON.stringify(_data));
                            break;
                        case "shocked:focused":
                            sessionStorage.setItem('cachedShockedFocusedRecommendations', JSON.stringify(_data));
                            break;
                        case "sad:happy":
                            // sessionStorage.setItem('cachedSadRecommendations', JSON.stringify(_data));
                            break;
                        case "heartbroken:happy":
                            // sessionStorage.setItem('cachedHeartRecommendations', JSON.stringify(_data));
                            break;
                    }
                }

                return _data;

            } catch (error) {
                handleSessionExpired();
                // console.error('Error fetching profile:', error);
                throw error;
            }
        }
    }

    async function fetchTrackAudioAnalysis(id: string): Promise<any> {
        const _url = "https://api.spotify.com/v1/audio-analysis/";
        const _concatenatedURL = _url.concat(id);

        try {
            const audioAnalysis = await fetch(
                _concatenatedURL, {
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`
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
                Authorization: `Bearer ${spotifyToken}`
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

    const createRecommendationURL = (mood: MoodTuple, url: string) => {
        let _url_base = url.concat("&");
        const attributes = new MoodTransformationAttributes();
        
        if (mood.current === "angry" && mood.target === "happy") {
            return attributes.angry_happy(_url_base);
        } else if (mood.current === "angry" && mood.target === "energized") {
            return attributes.angry_energized(_url_base);
        } else if (mood.current === "angry" && mood.target === "relaxed") {
            return attributes.angry_relaxed(_url_base);
        } else if (mood.current === "angry" && mood.target === "focused") {
            return attributes.angry_focused(_url_base);

        } else if (mood.current === "tired" && mood.target === "happy") {
            return attributes.tired_happy(_url_base);
        } else if (mood.current === "tired" && mood.target === "energized") {
            return attributes.tired_energized(_url_base);
        } else if (mood.current === "tired" && mood.target === "relaxed") {
            return attributes.tired_relaxed(_url_base);
        } else if (mood.current === "tired" && mood.target === "focused") {
            return attributes.tired_focused(_url_base);

        } else if (mood.current === "stressed" && mood.target === "happy") {
            return attributes.stressed_happy(_url_base);
        } else if (mood.current === "stressed" && mood.target === "energized") {
            return attributes.stressed_energized(_url_base);
        } else if (mood.current === "stressed" && mood.target === "relaxed") {
            return attributes.stressed_relaxed(_url_base);
        } else if (mood.current === "stressed" && mood.target === "focused") {
            return attributes.stressed_focused(_url_base);

        } else if (mood.current === "shocked" && mood.target === "happy") {
            return attributes.shocked_happy(_url_base);
        } else if (mood.current === "shocked" && mood.target === "energized") {
            return attributes.shocked_energized(_url_base);
        } else if (mood.current === "shocked" && mood.target === "relaxed") {
            return attributes.shocked_relaxed(_url_base);
        } else if (mood.current === "shocked" && mood.target === "focused") {
            return attributes.shocked_focused(_url_base);
        }

        return _url_base;
    }

    const getRecommendations = (url: string) => {
        let _tmp_url = "";

        if (moodTransformation.current !== "" && moodTransformation.target !== "") {
            _tmp_url = createRecommendationURL(moodTransformation, url);
            setCurrentRecommendationURL(_tmp_url);
            console.log("Transform", moodTransformation.current, "to", moodTransformation.target, "- fetch recommendations");
            // scroll down automatically
            if (recommendationComponentRef.current) {
                recommendationComponentRef.current.scrollIntoView({behavior: "smooth", block: "center"});
            }
        }

        fetchRecommendation(_tmp_url, moodTransformation)
            .then((response) => {
                setRecommendation(response);
                // console.log(response);
                // getAudioFeatures(response);
                // console.log("Request successful:", response, "mood:", mood);
            })
            .catch((error) => {
                console.error('Error while fetching data in recommendation:', error);
            });
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
        <div className="text-2xl font-extralight" ref={recommendationComponentRef}>

            <div className={`flex flex-wrap justify-center`}>
                <div className={`flex-col m-5 w-ful ${carMode ? "w-1/4" : "sm:w-96"}`}>
                    {showPopup && (
                        <SessionExpiredPopupComponent onClose={onPopupClose}/>
                    )}

                    { /* Questionnaire (recommendation good/not good, yes/no) */}
                    {releaseButtons ? (
                        <>
                            <p className="mb-10">Listen to this song!</p>
                            <div>
                                {recommendation !== null && (!('error' in recommendation)) ? (
                                    <div>
                                        {carMode ? (
                                            <CarModePlayer
                                                playlist={recommendation}
                                                accessToken={cookies.spotifyToken}
                                            />
                                        ) : (
                                            <div className="sm:bg-gradient-radial from-black via-black to-gray-800 rounded-2xl sm:p-10">
                                                <Player
                                                    playlist={recommendation}
                                                    accessToken={cookies.spotifyToken}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-base">An error occurred. Reload website.</p>
                                )}
                            </div>
                            <EvaluationComponent
                                name={cookies.user}
                                currentMood={moodTransformation.current}
                                targetMood={moodTransformation.target}
                                recURL={currentRecommendationURL}
                            />
                        </>
                    ) : (
                        <>
                            <p className="text-base">Select mood first to get recommendations.</p>
                        </>
                    )}

                </div>
            </div>
            <div className="mt-32 mx-5">
                <p className="text-xs font-normal">
                    {/**The recommendations are based on users top 2 artists and top 3 titles derived from the data of the last six weeks, with additional.*/}
                </p>
                <div className="text-xs font-normal pt-10 flex items-center justify-center">
                    <p>Data provided by </p>
                    <Image src="/Spotify_Logo_RGB_White.png" width={70} height={10} alt="Spotify logo"
                           className="ml-1"></Image>
                </div>
            </div>
        </div>
    );
}

export default RecommendationComponent