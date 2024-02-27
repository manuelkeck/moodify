import SpotifyWebApi from "spotify-web-api-js";
import React from "react";

const spotify = new SpotifyWebApi();

function APIRequests() {

}

interface MoodComponentProps {
    mood: number;
}

const MoodComponent: React.FC<MoodComponentProps> = ({mood}) => {
    return (
        <div>
            {mood === 1 && (
                <div>
                    <p>Mood 1</p>
                </div>
            )}
            {mood === 2 && (
                <div>
                    <p>Mood 2</p>
                </div>
            )}
            {mood === 3 && (
                <div>
                    <p>Mood 3</p>
                </div>
            )}
        </div>
    );

}

export default MoodComponent;