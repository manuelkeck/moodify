import Image from "next/image";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import WebPlayback from "@/app/spotify-player/webplayer";
import {useCookies} from "react-cookie";

interface songResponse {
    song: string,
    artist: string
}

const VoiceAssist = () => {
    const [text, setText] = useState<string>()
    const [songURI, setSongURI] = useState<string>("")
    const [cookies] = useCookies();
    const [showPlayer, setShowPlayer] = useState(false)

    useEffect(() => {
        if (songURI === "") {
            setShowPlayer(true)
        }
    }, [songURI]);

    function record() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        let songName = ""
        let artistName = ""

        recognition.lang = 'de-DE'

        // get recommendation first
        recognition.onresult = async function(event) {
            const transcript = event.results[0][0].transcript;
            setText(transcript)
            const response = await fetch('/api/airecom', {
                method: 'POST',
                body: JSON.stringify({
                    text: transcript
                })
            })

            const data: songResponse = await response.json();

            songName = data.song
            artistName = data.artist

            await generateUserAnswer(transcript, songName, artistName)
                .then(() => {
                    // Get song URI from content provider based on title and artist (spotify)
                    fetchSpotifyTrackURI(songName, artistName)
                        .then((response) => {
                            if (!('error' in response)) {
                                const songURI = response.tracks.items[0].uri;
                                setSongURI(songURI);
                            } else {
                                console.log("Error while fetching song URI from Spotify: ", response)
                            }

                        })
                        .catch((error) => {
                            console.log("Error while fetching data:", error);
                        });
                })
        }
        recognition.start()
    }

    async function generateUserAnswer(transcript: string, song: string, artist: string) {
        // generate text to speech for user experience
        const response = await fetch('/api/voiceassist', {
            method: 'POST',
            body: JSON.stringify({
                text: transcript,
                song: song,
                artist: artist
            })
        }).then(r => r.json())

        // Text to speech
        let utterance = new SpeechSynthesisUtterance(response.text);
        return new Promise<void>((resolve) => {
            utterance.onend = () => {
                resolve();
            };
            window.speechSynthesis.speak(utterance);
        });
    }

    async function fetchSpotifyTrackURI(song: string, artist: string): Promise<any> {
        try {
            const query = `track:${song} artist:${artist}`
            const encodedQuery = encodeURIComponent(query)

            const songURI = await fetch(
                `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`, {
                    headers: {
                        Authorization: `Bearer ${cookies.sp_auth0}`
                    }
                });

            if (!songURI.ok) {
                new Error('Network response was not ok');
            }

            return await songURI.json();

        } catch (error) {
            throw error;
        }
    }

    return (
        <div className="">
            <div className="relative w-full">
                <Image
                    src="/interieur1.png"
                    alt="Car interieur"
                    layout="responsive"
                    width={100}
                    height={100}
                    className="w-full h-auto"
                    quality={100}
                />

                <div className="absolute animate-ping" style={{top: '47%', left: '38.6%'}}>
                    <div className="w-14 h-14 bg-white bg-opacity-70 rounded-full"></div>
                </div>

                <div className="absolute" style={{top: '48%', left: '39%'}}>
                    <div className="w-10 h-10 bg-white bg-opacity-40 rounded-full"></div>
                </div>

                <div className="absolute rounded-full" style={{top: '45.5%', left: '37.7%'}}>
                    <div className="w-20 h-20 cursor-pointer" onClick={record}></div>
                </div>

                <div className="absolute" style={{bottom: '3%', left: '27%'}}>
                    <div
                        className="relative w-72 h-20 bg-white bg-opacity-65 rounded-2xl flex flex-col">
                        <p className="mt-2 mx-2 text-xs font-bold">{cookies.user}:</p>
                        <p className="mx-2">{text}</p>
                    </div>
                </div>
                <div className="absolute top-1/2 left-2 h-96 w-96 overflow-y-scroll p-4 text-xs transform -translate-y-1/2">
                    <ul>
                        <li className="py-2 opacity-65 font-bold">Beispielhafte Sprachbefehle:</li>
                        <li className="py-2 opacity-65">Wettervorhersage</li>
                        <li className="py-2 opacity-65">Restaurantvorschläge</li>
                        <li className="py-2 opacity-65">Musikwünsche</li>
                        <li className="py-2 opacity-65">Navigation</li>
                        <li className="py-2 opacity-65">Temperaturregelung</li>
                        <li className="py-2 opacity-65">Zeitpunkt nächster Servicetermin</li>
                        <li className="py-2 opacity-65">Reichweite der Tankfüllung</li>
                        <li className="py-2 opacity-65">Momentan zugelassene Geschwindigkeit</li>
                        <li className="py-2 opacity-65">Management der Assistenz Systeme</li>
                        <li className="py-2 opacity-65">Steuerung von Anrufen</li>
                        <li className="py-2 opacity-65">SMS Nachrichten vorlesen oder diktieren</li>
                        <li className="py-2 opacity-65">Aussage über Stimmung</li>
                        <li className="py-2 opacity-65">Aktuelle Situation</li>
                        <li className="py-2 opacity-65">Reiseziel</li>
                        <li className="py-2 opacity-65">Grund der Fahrt</li>
                    </ul>
                </div>

                {cookies.sp_auth0 !== "" && cookies.sp_auth0 !== undefined && songURI !== "" && showPlayer? (
                    <div>
                        <div className="absolute top-1/2 right-7 w-96 justify-center transform -translate-y-1/2">
                            <div
                                className="w-96 justify-center bg-gradient-radial from-black/70 via-black/70 to-stone-500/70 rounded-2xl p-6 mb-2">
                                <WebPlayback
                                    songURI={songURI}
                                    token={cookies.sp_auth0}
                                />
                            </div>
                            <p className="w-60 opacity-65 text-center mx-auto">
                                Spotify Premium account from
                                <span className="font-bold text-cyan-400"> {cookies.user} </span>
                                logged in.
                            </p>
                        </div>
                    </div>
                ) : (<></>)}

            </div>

            <div className="flex justify-center">
                <div
                    className="transition duration-150 w-40 text-center text-base ease-in-out mt-10 bg-stone-600 hover:bg-stone-700 text-white font-medium py-2 px-4 rounded-2xl cursor-pointer">
                    <Link href="/spotify-authorized/user/authorized">Go Back</Link>
                </div>
            </div>
        </div>
    )
}

export default VoiceAssist