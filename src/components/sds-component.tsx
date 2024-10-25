import Image from "next/image";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import WebPlayback from "@/app/spotify-player/webplayer";
import {useCookies} from "react-cookie";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

interface songResponse {
    song: string,
    artist: string
}

const SDSComponent = () => {
    const [text, setText] = useState<string>()
    const [songURI, setSongURI] = useState<string>("")
    const [cookies] = useCookies();
    const [showPlayer, setShowPlayer] = useState(false)
    const [infoText, setInfoText] = useState("")
    const [recording, setRecording] = useState(false)
    const [releaseRecord, setReleaseRecord] = useState(false)
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (songURI !== "") {
            setShowPlayer(true)
        }
    }, [songURI]);

    useEffect(() => {
        toast.info('🔊 Ensure your speaker is on.', {
            position: "top-center",
        });
    }, []);

    useEffect(() => {
        const browserLanguage = navigator.language || navigator.languages[0];

        if (browserLanguage.startsWith('de')) {
            setLanguage('de');
        }

        if (!releaseRecord) {
            let initText = ""
            if (browserLanguage.startsWith('de')) {
                initText = "Hallo! Ich bin dein persönlicher Sprachassistent. " +
                    "Drücke die Sprachsteuerungstaste am Lenkrad, um mit mir zu sprechen. " +
                    "Ich helfe dir gerne, die passende Musik für deine Fahrt zu finden."
            } else {
                initText = "Hello! I'm your personal voice assistant. Press the voice " +
                    "control button on the steering wheel to talk to me. I'll be happy to " +
                    "help you find the perfect music for your drive."
            }
            //text2speech(initText).then(r => setReleaseRecord(true))
            text2speechNLP(initText).then(r => setReleaseRecord(true))
        }
    }, []);

    useEffect(() => {
        text2speech(infoText).then(r => "")
    }, [infoText]);

    async function text2speechNLP(initText: string) {
        try {
            const response = await fetch('/api/nlp', {
                method: 'POST',
                body: JSON.stringify({ text: initText })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);

                return new Promise<void>((resolve) => {
                    audio.addEventListener('ended', () => {
                        // console.log("Audio playback finished");
                        resolve();
                    });
                    audio.play();
                });
            } else {
                console.error('Error fetching the MP3 file:', response.statusText);
                throw new Error('Error fetching the MP3 file');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    function text2speech(text: string) {
        let utterance = new SpeechSynthesisUtterance(text)
        return new Promise<void>((resolve) => {
            utterance.onend = () => {
                resolve();
            };
            window.speechSynthesis.speak(utterance);

            document.addEventListener('click', function handleClick() {
                window.speechSynthesis.speak(utterance);
                document.removeEventListener('click', handleClick);
            });
        });
    }

    function noSpeechSignalRecognized() {
        toast.info('🎙️ Voice input not recognised.', {
            position: "top-center",
        });
    }

    function record() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        let songName = "";
        let artistName = "";

        if (language === 'de') {
            recognition.lang = 'de-DE';
        } else {
            recognition.lang = 'en-US';
        }

        setRecording(true);

        let timeoutId: ReturnType<typeof setTimeout>;

        const stopRecognitionAfterTimeout = () => {
            timeoutId = setTimeout(() => {
                recognition.stop();
                setRecording(false);
                setReleaseRecord(true);
                // setInfoText("Keine Eingabe erkannt. Bitte versuchen Sie es erneut.");
                noSpeechSignalRecognized();
            }, 5000);
        };

        const clearRecognitionTimeout = () => {
            clearTimeout(timeoutId);
        };

        stopRecognitionAfterTimeout();

        // get recommendation first
        recognition.onresult = async function(event) {
            clearRecognitionTimeout();
            recognition.stop();
            setReleaseRecord(false)

            const transcript = event.results[0][0].transcript;

            setText(transcript);

            const response = await fetch('/api/airecom', {
                method: 'POST',
                body: JSON.stringify({
                    text: transcript
                })
            });

            setRecording(false);

            const data: songResponse = await response.json();

            songName = data.song;
            artistName = data.artist;

            await generateUserAnswer(transcript, songName, artistName)
                .then(() => {
                    // Get song URI from content provider based on title and artist (spotify)
                    fetchSpotifyTrackURI(songName, artistName)
                        .then((response) => {
                            if (!('error' in response)) {
                                const songURI = response.tracks.items[0].uri;
                                setSongURI(songURI);
                            } else {
                                //console.log("Error while fetching song URI from Spotify: ", response);
                                //setInfoText("Es tut mir Leid, es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
                            }
                        })
                        .catch((error) => {
                            //console.log("Error while fetching data:", error);
                            //setInfoText("Es tut mir Leid, es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
                        });
                    setReleaseRecord(true)
                });
        };

        recognition.onend = function() {
            clearRecognitionTimeout();
            setRecording(false);
        };

        recognition.onerror = function(event) {
            clearRecognitionTimeout();
            recognition.stop();
            setRecording(false);
            //console.error("Speech recognition error:", event.error);
            //setInfoText("Es tut mir Leid, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        };

        recognition.start();
    }

    async function generateUserAnswer(transcript: string, song: string, artist: string) {
        let outputLanguage = "english"
        if (language === 'de') {
            outputLanguage = "german"
        }

        // generate text to speech for user experience
        const response = await fetch('/api/voiceassist', {
            method: 'POST',
            body: JSON.stringify({
                text: transcript,
                song: song,
                artist: artist,
                language: outputLanguage
            })
        }).then(r => r.json())

        // Text to speech (browser's speech capability)
        // let utterance = new SpeechSynthesisUtterance(response.text);
        // return new Promise<void>((resolve) => {
        //     utterance.onend = () => {
        //         resolve();
        //     };
        //     window.speechSynthesis.speak(utterance);
        // });

        try {
            await text2speechNLP(response.text);
            //console.log('The audio has finished playing.');
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async function fetchSpotifyTrackURI(song: string, artist: string): Promise<any> {
        // console.log("song:", song)
        // console.log("artist:", artist)

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
                if (language === 'de') {
                    setInfoText("Es tut mir Leid, der Song konnte nicht auf Spotify gefunden werden. Wie kann ich dir sonst helfen?")
                } else {
                    setInfoText("I'm sorry but the song couldn't be found on Spotify. Please try it again.")
                }

            }

            return await songURI.json();

        } catch (error) {
            throw error;
        }
    }

    return (
        <div className="relative">
            <div className="text-base">
                <ToastContainer
                    position="top-center"
                    autoClose={10000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                />
            </div>
            <div className="lg:opacity-100 opacity-0">
                <div className="relative w-full">
                    <Image
                        src="/car-interieur.png"
                        alt="Car interieur"
                        layout="responsive"
                        width={100}
                        height={100}
                        className="w-full h-auto"
                        quality={100}
                    />

                    {releaseRecord ? (
                        !recording ? (
                            <div>
                                <div className="absolute animate-ping" style={{top: '47%', left: '38.6%'}}>
                                    <div className="w-14 h-14 bg-white bg-opacity-70 rounded-full"></div>
                                </div>

                                <div className="absolute" style={{top: '48%', left: '39%'}}>
                                    <div className="w-10 h-10 bg-white bg-opacity-40 rounded-full"></div>
                                </div>

                                <div className="absolute rounded-full" style={{top: '45.5%', left: '37.7%'}}>
                                    <div className="w-20 h-20 cursor-pointer" onClick={record}></div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/*<div className="absolute" style={{top: '48%', left: '39%'}}>
                                    <div className="w-10 h-10 bg-blue-900 opacity-65 rounded-full"></div>
                                </div>
                                <div className="absolute" style={{top: '48%', left: '39%'}}>
                                    <div className="flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
                                            <div
                                                className="absolute w-full h-full animate-pulse bg-blue-400 opacity-65 rounded-full"></div>
                                            <p className="text-3xl relative">🎤</p>
                                        </div>
                                    </div>
                                </div>*/}
                                <div className="absolute" style={{top: '49%', left: '39.5%'}}>
                                    <div className="w-6 h-6 bg-red-700 animate-pulse opacity-85 rounded-full"></div>
                                </div>
                            </div>
                        )
                    ) : (<></>)}

                    <div className="absolute" style={{bottom: '3%', left: '27%'}}>
                        <div className="relative w-80 h-20 bg-white bg-opacity-65 rounded-2xl flex flex-col">
                            <p className="mt-2 mx-2 text-xs font-bold">{cookies.user}:</p>
                            <p className="mx-2">{text}</p>
                        </div>
                    </div>
                    {language === 'de' ? (
                        <div
                            className="absolute top-1/2 left-2 h-96 w-72 overflow-y-scroll p-4 text-xs transform -translate-y-1/2 custom-scrollbar">
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
                    ) : (
                        <div
                            className="absolute top-1/2 left-2 h-96 w-96 overflow-y-scroll p-4 text-xs transform -translate-y-1/2 custom-scrollbar">
                            <ul>
                                <li className="py-2 opacity-65 font-bold">Example Voice Commands:</li>
                                <li className="py-2 opacity-65">Weather Forecast</li>
                                <li className="py-2 opacity-65">Restaurant Suggestions</li>
                                <li className="py-2 opacity-65">Music Requests</li>
                                <li className="py-2 opacity-65">Navigation</li>
                                <li className="py-2 opacity-65">Temperature Control</li>
                                <li className="py-2 opacity-65">Next Service Appointment</li>
                                <li className="py-2 opacity-65">Fuel Range</li>
                                <li className="py-2 opacity-65">Current Speed Limit</li>
                                <li className="py-2 opacity-65">Management of Assistance Systems</li>
                                <li className="py-2 opacity-65">Control of Calls</li>
                                <li className="py-2 opacity-65">Read or Dictate SMS Messages</li>
                                <li className="py-2 opacity-65">Mood Statement</li>
                                <li className="py-2 opacity-65">Current Situation</li>
                                <li className="py-2 opacity-65">Travel Destination</li>
                                <li className="py-2 opacity-65">Reason for the Trip</li>
                            </ul>
                        </div>
                    )}

                    {cookies.sp_auth0 !== "" && cookies.sp_auth0 !== undefined && songURI !== "" && showPlayer ? (
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
            <div
                className="lg:opacity-0 opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 flex flex-col items-center justify-center text-center"
                style={{pointerEvents: 'none'}}>

                <p>Screen resolution of at least </p>
                <p>1024x762 px needed</p>
                <Image
                    className="mt-10 animate-pulse"
                    src="/icons8-enlarge-100.png"
                    alt="Arrow icon"
                    width={45}
                    height={45}
                />
            </div>
        </div>
    )
}

export default SDSComponent