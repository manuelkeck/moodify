import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";
import SessionExpiredPopupComponent from "@/app/authorized/session-expired-popup-component";

interface Item {
    external_urls: {
        spotify: string;
    };
    name: string;
    images: {
        url: string;
        width: number;
        height: number;
    }[];
}

function RecommendationComponent () {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [data, setData] = useState<{ items: Item[] } | null>(null);
    const [cookies, setCookie, removeCookie, removeAllCookies] = useCookies(['spotifyToken', 'user']);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");
        setName(cookies.user || "unknown user")
    }, [cookies.user, cookies.spotifyToken]);

    useEffect(() => {
        if (spotifyToken) {
            fetchData(spotifyToken)
                .then((data) => {
                    setData(data);
                    console.log('Data:', data);
                })
                .catch((error) => {
                    console.error('Error while fetching data:', error);
                });
        }
    }, [spotifyToken]);

    async function fetchData(accessToken: string): Promise<any> {
        try {
            const response = await fetch(
                "https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (!response.ok) {
                handleSessionExpired();
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            handleSessionExpired();
            console.error('Error fetching profile:', error);
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

    return(
        <div className="text-2xl font-extralight">
            <p className="mb-10">Listen to this song!</p>
            <div className="flex flex-wrap justify-center">
                <div className="flex-col">
                    {showPopup && (
                        <SessionExpiredPopupComponent onClose={onPopupClose}/>
                    )}
                    <div>
                        <p>[ Music recommendation ]</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecommendationComponent