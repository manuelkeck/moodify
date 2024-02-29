import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";

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

function MusicRecommendation () {
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
                "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
                // "https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
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

    const handleClick = () => {
        setShowPopup(false);
        router.push("/");
    }

    return(
        <div className="flex-col">
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85">
                    <div className="bg-stone-700 p-6 rounded shadow-lg">
                        <p className="mb-3">Session expired. Log in again.</p>
                        <button
                            onClick={() => handleClick()}
                            className="transition duration-150 ease-in-out bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}

            {data !== null && data.items.map((item, index) => (
                <div key={index} className="inline-block text-center m-10 bg-gray-900 shadow-lg p-6 rounded-lg">
                    <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        <p className="mb-5">{index+1}. {item.name}</p>
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
    );
}

export default MusicRecommendation