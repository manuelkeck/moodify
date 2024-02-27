import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";

function MusicRecommendation () {
    const [spotifyToken, setSpotifyToken] = useState("");
    const [name, setName] = useState("unknown user");
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const [cookies] = useCookies(['spotifyToken', 'user']);

    useEffect(() => {
        setSpotifyToken(cookies.spotifyToken || "");
        setName(cookies.user || "unknown user")

        if (spotifyToken) {
            fetchProfile(spotifyToken)
                .then((recommendationData) => {
                    console.log('Recommendations:', recommendationData);
                })
                .catch((error) => {
                    console.error('Fehler beim Abrufen des Benutzerprofils:', error);
                });
        }
    }, [spotifyToken, cookies.user, cookies.spotifyToken]);

    async function fetchProfile(accessToken: string): Promise<any> {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
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
        <div>
            <p>Music recommendations</p>
            <p>For {name}</p>
        </div>
    )
}

export default MusicRecommendation