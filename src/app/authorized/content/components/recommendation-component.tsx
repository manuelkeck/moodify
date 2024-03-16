import React, {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";
import SessionExpiredPopupComponent from "@/app/authorized/content/components/session-expired-popup-component";
import Image from "next/image";
import MoodTransformationAttributes from "@/app/authorized/content/components/helper/mood-transformation-attributes";
import EvaluationComponent from "@/app/authorized/content/components/evaluation";

interface recommendationObject {
    id: string;
    tracks: {
        name: string;
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
    }[];
}

interface MoodTuple {
    current: string;
    target: string;
}

interface selectedMoodProps {
    selectedValue: MoodTuple;
}

const RecommendationComponent: React.FC<selectedMoodProps> = ({selectedValue}) => {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [recommendation, setRecommendation] = useState<recommendationObject | null>(null);
    const [iterator, setIterator] = useState(0);
    const [recommendationURL, setRecommendationURL] = useState("");
    const [currentRecommendationURL, setCurrentRecommendationURL] = useState("");
    const [moodTransformation, setMoodTransformation] = useState<MoodTuple>({current: "", target: ""});
    const [releaseButtons, setReleaseButtons] = useState(false);

    const [cookies, removeCookie] = useCookies();
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
            console.log("both moods selected");
        } else {
            console.log("one mood deselected:", moodTransformation);
            setReleaseButtons(false);
        }
        //setSelectedMood(selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        if (spotifyToken) {
            Promise.all([fetchTracks(), fetchArtists()])
                .then(([_tracksData, _artistsData]) => {

                    // Create URL to request suitable recommendations
                    let _base_url = "https://api.spotify.com/v1/recommendations?limit=10&";
                    let _seed_tracks = "seed_tracks=";
                    let _seed_artists = "seed_artists=";

                    _tracksData.forEach((id) => {
                        if (_seed_tracks !== "seed_tracks=") {
                            _seed_tracks = _seed_tracks.concat("%2C");
                        }
                        _seed_tracks = _seed_tracks.concat(id);
                    });
                    _artistsData.forEach((id) => {
                        if (_seed_artists !== "seed_artists=") {
                            _seed_artists = _seed_artists.concat("%2C");
                        }
                        _seed_artists = _seed_artists.concat(id);
                    });

                    let url = _base_url.concat(_seed_artists);
                    url = url.concat("&");
                    url = url.concat(_seed_tracks);

                    // console.log("url: ", url);
                    setRecommendationURL(url);
                    getRecommendations(url);

                })
                .catch((error) => {
                    console.error('Error while fetching data:', error);
                });}

    }, [spotifyToken, moodTransformation]);

    async function fetchTracks(): Promise<[any, any, any]> {

        // Check if cached data is available
        const cachedDataObject = sessionStorage.getItem('cachedTopTracks');
        if (cachedDataObject) {
            console.log("Fetching users top tracks for recommendation: Using cached data from session storage");

            const parsedData = JSON.parse(cachedDataObject);
            const track_one = parsedData.items[0].id;
            const track_two = parsedData.items[1].id;
            const track_three = parsedData.items[2].id;

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

            // const parsedData = JSON.parse(_data);
            const track_one = _data.items[0].id;
            const track_two = _data.items[1].id;
            const track_three = _data.items[2].id;

            return [track_one, track_two, track_three];

        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchArtists(): Promise<[any, any]> {

        // Check if cached data is available
        const cachedDataObject = sessionStorage.getItem('cachedTopArtists');
        if (cachedDataObject) {
            console.log("Fetching users top artists for recommendation: Using cached data from session storage");

            const parsedData = JSON.parse(cachedDataObject);
            const artist_one = parsedData.items[0].id;
            const artist_two = parsedData.items[1].id;

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

            // const parsedData = JSON.parse(_data);
            const artist_one = _data.items[0].id;
            const artist_two = _data.items[1].id;

            return [artist_one, artist_two];

        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchRecommendation(url: string, mood: MoodTuple): Promise<any> {

        let _cachedDataObject = null;

        // Check if cached data is available
        if (mood.current === "") {
            _cachedDataObject = sessionStorage.getItem('cachedRecommendations');

        } else if (mood.current === "angry" && mood.target === "happy") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "angry" && mood.target === "relaxed") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "angry" && mood.target === "energized") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "angry" && mood.target === "concentrated") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');

        } else if (mood.current === "tired" && mood.target === "happy") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "tired" && mood.target === "relaxed") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "tired" && mood.target === "energized") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "tired" && mood.target === "concentrated") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');

        } else if (mood.current === "stressed" && mood.target === "happy") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "stressed" && mood.target === "relaxed") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "stressed" && mood.target === "energized") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "stressed" && mood.target === "concentrated") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');

        } else if (mood.current === "shocked" && mood.target === "happy") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "shocked" && mood.target === "relaxed") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "shocked" && mood.target === "energized") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');
        } else if (mood.current === "shocked" && mood.target === "concentrated") {
            _cachedDataObject = sessionStorage.getItem('cachedAngryRecommendations');

        }

        /*
        } else if (mood.current === "sad" && mood.target === "happy") {
            _cachedDataObject = sessionStorage.getItem('cachedSadRecommendations');
        } else if (mood.current === "sad" && mood.target === "relaxed") {
            _cachedDataObject = sessionStorage.getItem('cachedSadRecommendations');
        } else if (mood.current === "sad" && mood.target === "energized") {
            _cachedDataObject = sessionStorage.getItem('cachedSadRecommendations');
        } else if (mood.current === "sad" && mood.target === "concentrated") {
            _cachedDataObject = sessionStorage.getItem('cachedSadRecommendations');
        } else if (mood.current === "sad" && mood.target === "pensive") {
            _cachedDataObject = sessionStorage.getItem('cachedSadRecommendations');

        } else if (mood.current === "heartbroken" && mood.target === "happy") {
            _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
        } else if (mood.current === "heartbroken" && mood.target === "relaxed") {
            _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
        } else if (mood.current === "heartbroken" && mood.target === "energized") {
            _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
        } else if (mood.current === "heartbroken" && mood.target === "concentrated") {
            _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
        } else if (mood.current === "heartbroken" && mood.target === "pensive") {
            _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
        } else if (mood.current === "heartbroken" && mood.target === "healed") {
            _cachedDataObject = sessionStorage.getItem('cachedSleepyRecommendations');
        }
        */

        if (_cachedDataObject) {
            if (mood.current === "") {
                console.log("Fetching recommendations without mood selected: Using cached data from session storage");
            } else {
                console.log("Transform", mood.current, "to", mood.target, "- Using cached data from session storage");
            }
            return JSON.parse(_cachedDataObject);
        } else {
            console.log("Transform", mood.current, "to", mood.target, "- Calling API...");
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
                console.log("handle session expired doesnt work..? recommendation-component");
                new Error('Network response was not ok');
            }

            let _data = await response_recommendation.json();

            if (mood.current === "") {
                sessionStorage.setItem('cachedRecommendations', JSON.stringify(_data));

            } else if (mood.current === "angry" && mood.target === "happy") {
                sessionStorage.setItem('cachedAngryHappyRecommendations', JSON.stringify(_data));
            } else if (mood.current === "angry" && mood.target === "energized") {
                sessionStorage.setItem('cachedAngryEnergizedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "angry" && mood.target === "relaxed") {
                sessionStorage.setItem('cachedAngryRelaxedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "angry" && mood.target === "concentrated") {
                sessionStorage.setItem('cachedAngryConcentratedRecommendations', JSON.stringify(_data));

            } else if (mood.current === "tired" && mood.target === "happy") {
                sessionStorage.setItem('cachedTiredHappyRecommendations', JSON.stringify(_data));
            } else if (mood.current === "tired" && mood.target === "energized") {
                sessionStorage.setItem('cachedTiredEnergizedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "tired" && mood.target === "relaxed") {
                sessionStorage.setItem('cachedTiredRelaxedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "tired" && mood.target === "concentrated") {
                sessionStorage.setItem('cachedTiredConcentratedRecommendations', JSON.stringify(_data));

            } else if (mood.current === "stressed" && mood.target === "happy") {
                sessionStorage.setItem('cachedStressedHappyRecommendations', JSON.stringify(_data));
            } else if (mood.current === "stressed" && mood.target === "energized") {
                sessionStorage.setItem('cachedStressedEnergizedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "stressed" && mood.target === "relaxed") {
                sessionStorage.setItem('cachedStressedRelaxedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "stressed" && mood.target === "concentrated") {
                sessionStorage.setItem('cachedStressedConcentratedRecommendations', JSON.stringify(_data));

            } else if (mood.current === "shocked" && mood.target === "happy") {
                sessionStorage.setItem('cachedShockedHappyRecommendations', JSON.stringify(_data));
            } else if (mood.current === "shocked" && mood.target === "energized") {
                sessionStorage.setItem('cachedShockedEnergizedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "shocked" && mood.target === "relaxed") {
                sessionStorage.setItem('cachedShockedRelaxedRecommendations', JSON.stringify(_data));
            } else if (mood.current === "shocked" && mood.target === "concentrated") {
                sessionStorage.setItem('cachedShockedConcentratedRecommendations', JSON.stringify(_data));

            } else if (mood.current === "sad" && mood.target === "happy") {
                // sessionStorage.setItem('cachedSadRecommendations', JSON.stringify(_data));

            } else if (mood.current === "heartbroken" && mood.target === "happy") {
                // sessionStorage.setItem('cachedHeartRecommendations', JSON.stringify(_data));
            } else {
                console.log("Mood not found. Check recommendation-component.tsx");
            }

            return _data;

        } catch (error) {
            console.log("Error");
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
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
            console.log("handle session expired event")
            // removeCookie('spotifyToken', { path: '/' });

            setShowPopup(true);
        }
    };

    const onPopupClose = () => {
        setShowPopup(false);
    }

    const createRecommendationURL = (mood: MoodTuple) => {
        let _url_base = recommendationURL.concat("&");
        const attributes = new MoodTransformationAttributes();
        
        if (mood.current === "angry" && mood.target === "happy") {
            return attributes.angry_happy(_url_base);
        } else if (mood.current === "angry" && mood.target === "energized") {
            return attributes.angry__energized(_url_base);
        } else if (mood.current === "angry" && mood.target === "relaxed") {
            return attributes.angry_relaxed(_url_base);
        } else if (mood.current === "angry" && mood.target === "concentrated") {
            return attributes.angry_concentrated(_url_base);

        } else if (mood.current === "tired" && mood.target === "happy") {
            return attributes.tired_happy(_url_base);
        } else if (mood.current === "tired" && mood.target === "energized") {
            return attributes.tired_energized(_url_base);
        } else if (mood.current === "tired" && mood.target === "relaxed") {
            return attributes.tired_relaxed(_url_base);
        } else if (mood.current === "tired" && mood.target === "concentrated") {
            return attributes.tired_concentrated(_url_base);

        } else if (mood.current === "stressed" && mood.target === "happy") {
            return attributes.stressed_happy(_url_base);
        } else if (mood.current === "stressed" && mood.target === "energized") {
            return attributes.stressed_energized(_url_base);
        } else if (mood.current === "stressed" && mood.target === "relaxed") {
            return attributes.stressed_relaxed(_url_base);
        } else if (mood.current === "stressed" && mood.target === "concentrated") {
            return attributes.stressed_concentrated(_url_base);

        } else if (mood.current === "shocked" && mood.target === "happy") {
            return attributes.shocked_happy(_url_base);
        } else if (mood.current === "shocked" && mood.target === "energized") {
            return attributes.shocked_energized(_url_base);
        } else if (mood.current === "shocked" && mood.target === "relaxed") {
            return attributes.shocked_relaxed(_url_base);
        } else if (mood.current === "shocked" && mood.target === "concentrated") {
            return attributes.shocked_concentrated(_url_base);
        }

        return _url_base;
    }

    const getRecommendations = (url: string) => {
        let _tmp_url = url;

        if (moodTransformation.current !== "" && moodTransformation.target !== "") {
            _tmp_url = createRecommendationURL(moodTransformation);
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
                // getAudioFeatures(response);
                // console.log("Request successful:", response, "mood:", mood);
            })
            .catch((error) => {
                console.error('Error while fetching data in recommendation:', error);
            });
    }

    const handleReload = () => {
        if (iterator === 9) {
            console.log("Requesting new recommendations...");
            setIterator(0);
        } else {
            if (iterator < 10) {
                let calculated = iterator + 1;
                setIterator(calculated);
            }
        }
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
            <p className="mb-10">Listen to this song!*</p>
            <div className="flex flex-wrap justify-center">
                <div className="flex-col">
                    {showPopup && (
                        <SessionExpiredPopupComponent onClose={onPopupClose}/>
                    )}
                    <div>
                        {recommendation !== null ? (
                            <>
                                <div className="bg-gray-900 py-10 px-3 rounded-lg max-w-md mx-auto flex flex-col items-center w-60">
                                    <a href={recommendation.tracks[iterator].external_urls.spotify} target="_blank"
                                       rel="noopener noreferrer" className="items-center">
                                        <img src={recommendation.tracks[iterator].album.images[1].url}
                                             alt="Album cover"
                                             className="mx-auto"
                                             width={(recommendation.tracks[iterator].album.images[1].width)*0.5}
                                             height={recommendation.tracks[iterator].album.images[1].height}/>
                                        <div className="flex-col">
                                            <p className="pt-5">{recommendation.tracks[iterator].name}</p>
                                            <div className="text-base">
                                                {recommendation.tracks[iterator].artists.map(artist => artist.name).join(', ')}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <p className="text-base">No recommendation found.</p>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={handleReload}
                            className="text-base font-medium underline pt-5"
                        >
                            Reload
                        </button>
                    </div>

                    {/* Questionnaire (recommendation good/not good, yes/no)*/}
                    {releaseButtons ? (<EvaluationComponent
                        name={cookies.user}
                        currentMood={moodTransformation.current}
                        targetMood={moodTransformation.target}
                        recURL={currentRecommendationURL}
                    />):(<></>)}

                </div>
            </div>
            <div className="mt-32 mx-5">
                <p className="text-xs font-normal">
                    *The default recommendations and mood-based recommendations are based on users top 2 artists of the
                    last 6 weeks and top 3 titles of the last 6 months.
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