import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import SessionExpiredPopupComponent from "@/app/authorized/content/components/session-expired-popup-component";
import Image from "next/image";
import {router} from "next/client";

interface ArtistsItem {
    external_urls: {
        spotify: string;
    };
    name: string;
    images: {
        url: string;
        width: number;
        height: number;
    }[];
    error: {
        status: number;
    };
}

interface TracksItem {
    external_urls: {
        spotify: string;
    };
    name: string;
    artists: {
        name: string;
    }[];
    album: {
        images: {
            url: string;
            width: number;
            height: number;
        }[];
    };
    error: {
        status: number;
    };
}

function TopArtistComponent() {
    const [artistsDataObject, setArtistsDataObject] = useState<{ items: ArtistsItem[] } | null>(null);
    const [tracksDataObject, setTracksDataObject] = useState<{ items: TracksItem[] } | null>(null);
    const [spotifyToken, setSpotifyToken] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies();
    const [showPopup, setShowPopup] = useState(false);

    const onPopupClose = () => {
        setShowPopup(false);
        sessionStorage.clear();
        window.location.reload();
    }

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");

        async function fetchTopArtists(): Promise<any> {

            // Check if cached data is available
            const cachedDataObject = sessionStorage.getItem('cachedTopArtists');

            if (cachedDataObject) {
                console.log("Fetching users top artists: Using cached data from session storage");
                return JSON.parse(cachedDataObject);
            }

            try {
                console.log("Fetching users top artists: No cached data found in session storage. API will be requested.");

                const response = await fetch(
                    "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10", {
                        headers: {
                            Authorization: `Bearer ${spotifyToken}`
                        }
                    });

                if (!response.ok) {
                    handleSessionExpired();
                    new Error('Network response was not ok');
                }

                let _data = await response.json();
                sessionStorage.setItem('cachedTopArtists', JSON.stringify(_data));
                return _data;

            } catch (error) {
                handleSessionExpired();
                console.error('Error fetching profile:', error);
                throw error;
            }
        }

        async function fetchTopTracks(): Promise<any> {

            // Check if cached data is available
            const cachedDataObject = sessionStorage.getItem('cachedTopTracks');

            if (cachedDataObject) {
                console.log("Fetching users top tracks: Using cached data from session storage");
                return JSON.parse(cachedDataObject);
            }

            try {
                console.log("Fetching users top tracks: No cached data found in session storage. API will be requested.");

                const topTracks = await fetch(
                    "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10", {
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

                return _data;

            } catch (error) {
                handleSessionExpired();
                throw error;
            }
        }

        const handleSessionExpired = () => {
            if (!showPopup) {
                setShowPopup(true);
                // setCookie('spotifyToken', {path: '/'});
                removeCookie('spotifyToken', { path: '/' });
                removeCookie('spotifyToken', { path: '/authorized' });
            }
        };

        if (spotifyToken) {
            fetchTopTracks()
                .then((object) => {
                    if (!('error' in object)) {
                        setTracksDataObject(object);
                    } else {
                        handleSessionExpired();
                    }

                })
                .catch((error) => {
                    console.log("Error while fetching data:", error);
                });
            fetchTopArtists()
                .then((object) => {
                    if (!('error' in object)) {
                        setArtistsDataObject(object);
                    } else {
                        handleSessionExpired();
                    }
                })
                .catch((error) => {
                    console.error('Error while fetching data:', error);
                });
        }
    }, [cookies.spotifyToken, removeCookie, showPopup, spotifyToken]);

    return (
        <div className="text-center">
            {showPopup && (
                <SessionExpiredPopupComponent onClose={onPopupClose}/>
            )}
            <p className="mt-20 mb-5 sm:text-2xl text-base font-light">Check out your top 10 tracks!</p>
            <div className="flex flex-wrap justify-center">
                {tracksDataObject !== null && tracksDataObject.items.map((item, index) => (
                    <div key={index}
                         className="inline-block text-center m-2 lg:m-5 bg-gray-900 shadow-lg lg:p-6 p-2 rounded-lg sm:w-1/3 w-2/5 lg:w-60">
                        <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            <div className="flex justify-center items-center">
                                <img src={item.album.images[1].url} alt="Artist cover"
                                     width={item.album.images[1].width}
                                     height={item.album.images[1].height}
                                />
                            </div>
                            <p className="mt-3 text-xs">{item.name}</p>
                            <div className="text-xs pb-3 text-slate-400">
                                {item.artists.map((artist, index) => (
                                    <span key={index}>
                                        {artist.name}
                                        {index < item.artists.length - 1 && ", "}
                                    </span>
                                ))}
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <p className="mt-20 mb-5 sm:text-2xl text-base font-light">Check out your top 10 artists!</p>
            <div className="flex flex-wrap justify-center">
                {artistsDataObject !== null && artistsDataObject.items.map((item, index) => (
                    <div key={index}
                         className="inline-block text-center m-2 lg:m-5 bg-gray-900 shadow-lg lg:p-6 p-2 rounded-lg sm:w-1/3 w-2/5 lg:w-60">
                        <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            <p className="mt-3 mb-5 text-xl font-light text-slate-300">{item.name}</p>
                            <div className="flex justify-center items-center">
                                <img src={item.images[1].url} alt="Artist cover"
                                     width={item.images[1].width}
                                     height={item.images[1].height}
                                />
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <div className="mt-32 mx-5">
                <p className="text-xs">
                    The overview of the top tracks and artists is derived from the data of the last six weeks.
                </p>
                <div className="text-xs pt-10 flex items-center justify-center">
                    <p>Data provided by </p>
                    <Image src="/Spotify_Logo_RGB_White.png" width={70} height={10} alt="Spotify logo"
                           className="ml-1"></Image>
                </div>
            </div>
        </div>
    );
}

export default TopArtistComponent