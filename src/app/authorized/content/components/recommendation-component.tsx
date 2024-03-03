import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import SessionExpiredPopupComponent from "@/app/authorized/content/components/session-expired-popup-component";
import {createRequestResponseMocks} from "next/dist/server/lib/mock-request";

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

interface selectedMoodProps {
    selectedValue: string;
}

const RecommendationComponent: React.FC<selectedMoodProps> = ({selectedValue}) => {
    const [spotifyToken, setSpotifyToken] = useState("");
    // const [name, setName] = useState("unknown user");
    // const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [recommendation, setRecommendation] = useState<recommendationObject | null>(null);
    const [artists, setArtists] = useState("");
    const [iterator, setIterator] = useState(0);
    const [recommendationURL, setRecommendationURL] = useState("");

    const [cookies, removeCookie] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        if (cookies.spotifyToken) {
            setSpotifyToken(cookies.spotifyToken || "");
            // setName(cookies.user || "unknown user")
        } else {
            setShowPopup(true);
        }
    }, [cookies.user, cookies.spotifyToken]);

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

                    console.log("url: ", url);
                    setRecommendationURL(url);

                    getRecommendations(url);

                })
                .catch((error) => {
                    console.error('Error while fetching data:', error);
                });}

    }, [spotifyToken]);

    useEffect(() => {

        if (selectedValue !== "") {
            handleReload();
        }

    }, [selectedValue]);

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
                "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=3", {
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
                "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10", {
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

    async function fetchRecommendation(url: string): Promise<any> {

        // Check if cached data is available
        const cachedDataObject = sessionStorage.getItem('cachedRecommendations');
        if (cachedDataObject) {
            console.log("Fetching recommendations: Using cached data from session storage");
            return JSON.parse(cachedDataObject);
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
            sessionStorage.setItem('cachedRecommendations', JSON.stringify(_data));
            console.log("return data from recommendation fetching");
            return _data;

        } catch (error) {
            console.log("Error");
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    const handleSessionExpired = () => {
        if (!showPopup) {
            setShowPopup(true);
            removeCookie('spotifyToken', { path: '/' });
        }
    };

    const onPopupClose = () => {
        setShowPopup(false);
    }

    const getRecommendations = (url: string) => {
        fetchRecommendation(url)
            .then((response) => {
                setRecommendation(response);
                console.log("recommendation response: ", response);
            })
            .catch((error) => {
                console.error('Error while fetching data in recommendation:', error);
            });
    }

    const handleReload = () => {
        if (iterator === 9) {
            console.log("Requesting new recommendations...");
            getRecommendations(recommendationURL);
            setIterator(0);
        } else {
            if (iterator < 10) {
                let calculated = iterator + 1;
                setIterator(calculated);
            }
        }
         //else {
          //  setIterator(0);
            // console.log("Reload: Request to recommendation endpoint");
            // if (reload) {
            //     setReload(false);
            // } else {
            //     setReload(true);
            // }
        //}
    }

    return(
        <div className="text-2xl font-extralight">
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
                </div>
            </div>
            <div className="mt-32 mx-5">
                <p className="text-base">
                    *Recommendations are based on users top 2 artists and top 3 tracks.
                </p>
            </div>
        </div>
    );
}

export default RecommendationComponent