import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import Image from "next/image";

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
    const [cookies] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");
        setName(cookies.user || "unknown user")
    }, [cookies.user, cookies.spotifyToken]);

    useEffect(() => {
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
    }, [spotifyToken]);

    async function fetchData(accessToken: string): Promise<any> {
        try {
            const response = await fetch(
                "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    return(
        <div className="flex-col">
            {data !== null && data.items.map((item, index) => (
                    <div key={index} className="inline-block text-center m-10 bg-gray-900 shadow-lg p-6 rounded-lg">
                        <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            <p className="mb-5">{index+1}. {item.name}</p>
                            <div className="flex justify-center items-center">
                                <img src={item.images[1].url} alt="Artist cover"
                                     width={item.images[1].width}
                                     height={item.images[1].height}/>
                            </div>
                        </a>
                    </div>
            ))}
        </div>
    );
}

export default MusicRecommendation