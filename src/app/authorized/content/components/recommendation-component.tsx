import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import SessionExpiredPopupComponent from "@/app/authorized/content/components/session-expired-popup-component";

interface recommendationObject {
    id: string;
    tracks: {
        name: string;
        artist: [];
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

function RecommendationComponent () {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hasSession, setHasSession] = useState(false);
    const [recommendation, setRecommendation] = useState<recommendationObject | null>(null);
    const [artists, setArtists] = useState("");

    const [cookies, setCookie, removeCookie, removeAllCookies] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        if (cookies.spotifyToken) {
            setSpotifyToken(cookies.spotifyToken || "");
            setName(cookies.user || "unknown user")
            setHasSession(true);
        } else {
            setShowPopup(true);
        }
    }, [cookies.user, cookies.spotifyToken]);

    useEffect(() => {
        if (spotifyToken) {
            Promise.all([fetchTracks(spotifyToken), fetchArtists(spotifyToken)])
                .then(([_tracksData, _artistsData]) => {

                    let trackIDs: string[] = ["", "", ""];
                    let artistIDs: string[] = ["", ""];

                    // Get IDs of tracks and artists
                    if (_tracksData !== null && _artistsData !== null) {
                        _tracksData.items.forEach((item: { id: string; }, index: number) => {
                            trackIDs[index] = item.id;
                        });
                        _artistsData.items.forEach((item: { id: string; }, index: number) => {
                            artistIDs[index] = item.id;
                        });
                    }

                    // Create URL to request suitable recommendations
                    let _base_url = "https://api.spotify.com/v1/recommendations?limit=1&";
                    let _seed_tracks = "seed_tracks=";
                    let _seed_artists = "seed_artists=";

                    trackIDs.forEach((id) => {
                        if (_seed_tracks !== "seed_tracks=") {
                            _seed_tracks = _seed_tracks.concat("%2C");
                        }
                        _seed_tracks = _seed_tracks.concat(id);
                    });
                    artistIDs.forEach((id) => {
                        if (_seed_artists !== "seed_artists=") {
                            _seed_artists = _seed_artists.concat("%2C");
                        }
                        _seed_artists = _seed_artists.concat(id);
                    });

                    let url = _base_url.concat(_seed_artists);
                    url = url.concat("&");
                    url = url.concat(_seed_tracks);

                    fetchRecommendation(spotifyToken, url)
                        .then((response) => {
                            setRecommendation(response);
                            // console.log("recommendation: ", response);
                            let _artists_list = response.tracks[0].artists.map((artist: { name: string }) => artist.name).join(', ');
                            setArtists(_artists_list);
                        })
                        .catch((error) => {
                            console.error('Error while fetching data:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error while fetching data:', error);
                });}

    }, [spotifyToken]);

    async function fetchTracks(accessToken: string): Promise<any> {
        try {
            const topTracks = await fetch(
                "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=3", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (!topTracks.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await topTracks.json();
        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchArtists(accessToken: string): Promise<any> {
        try {
            const topArtists = await fetch(
                "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=2", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (!topArtists.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await topArtists.json();
        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async function fetchRecommendation(accessToken: string, url: string): Promise<any> {
        try {
            const recommendation = await fetch(
                url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (!recommendation.ok) {
                handleSessionExpired();
                new Error('Network response was not ok');
            }

            return await recommendation.json();
        } catch (error) {
            handleSessionExpired();
            // console.error('Error fetching profile:', error);
            throw error;
        }
    }

    const handleSessionExpired = () => {
        if (!showPopup) {
            setShowPopup(true);
            setHasSession(false);
            removeCookie('spotifyToken', { path: '/' });
        }
    };

    const onPopupClose = () => {
        setShowPopup(false);
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
                                <div className="bg-gray-900 p-10 rounded-lg">
                                    <a href={recommendation.tracks[0].external_urls.spotify} target="_blank"
                                       rel="noopener noreferrer">
                                        <img src={recommendation.tracks[0].album.images[1].url} alt="Album cover"
                                             width={recommendation.tracks[0].album.images[1].width}
                                             height={recommendation.tracks[0].album.images[1].height}/>
                                        <div className="flex-col">
                                            <p className="pt-5">{recommendation.tracks[0].name}</p>
                                            <p className="text-base">{artists}</p>
                                        </div>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <p>No recommendation found.</p>
                        )}
                    </div>

                </div>
            </div>
            <div className="mt-32 mx-5">
                <p className="text-base">
                    *Recommendations are based on user's top 2 artists and top 3 tracks.
                </p>
            </div>
        </div>
    );
}

export default RecommendationComponent