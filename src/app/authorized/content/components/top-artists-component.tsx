import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";
import SessionExpiredPopupComponent from "@/app/authorized/content/components/session-expired-popup-component";

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

function TopArtistComponent() {
    const [data, setData] = useState<{ items: Item[] } | null>(null);
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");
    const [cookies, setCookie, removeCookie, removeAllCookies] = useCookies(['spotifyToken', 'user']);
    const [showPopup, setShowPopup] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");
        if (spotifyToken) {
            fetchData(spotifyToken)
                .then((data) => {
                    setData(data);
                    // console.log('Data:', data);
                })
                .catch((error) => {
                    console.error('Error while fetching data:', error);
                });
        }
    }, [cookies.spotifyToken, spotifyToken]);

    async function fetchData(accessToken: string): Promise<any> {
        try {
            const response = await fetch(
                "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
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

    return (
        <div className="text-center">
            {showPopup && (
                <SessionExpiredPopupComponent onClose={onPopupClose}/>
            )}
            <p className="mt-20 mb-5 text-2xl font-extralight">Check out your top artists!</p>
            <div className="flex flex-wrap justify-center">
                {data !== null && data.items.map((item, index) => (
                    <div key={index} className="inline-block text-center mx-auto mb-5 lg:m-5 bg-gray-900 shadow-lg lg:p-6 p-2 rounded-lg">
                        <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            <p className="mb-5 text-base">{index + 1}. {item.name}</p>
                            <div className="flex justify-center items-center">
                                <img src={item.images[2].url} alt="Artist cover"
                                     width={item.images[2].width}
                                     height={item.images[2].height}
                                />
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopArtistComponent