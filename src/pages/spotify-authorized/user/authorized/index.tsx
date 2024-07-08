import LogoutButton from "@/components/user/logout-button";
import { useAuth0 } from "@auth0/auth0-react";
import React, {useEffect, useRef, useState} from "react";
import { useRouter } from "next/navigation";
import CurrentMoodComponent from "@/components/user/current-mood-component";
import RecommendationComponent from "@/components/user/recommendation-component";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Link from "next/link";
import QRCode from "qrcode.react";

const Authorized: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();
    const [currentMood, setCurrentMood] = useState("")
    const [userAvailable, setUserAvailable] = useState(true)
    const [showQR, setShowQR] = useState(false)
    const [currentEnergyLevel, setCurrentEnergyLevel] = useState(0)

    useEffect(() => {
        const redirectIfUnauthorized = async () => {
            try {
                if (!isAuthenticated && !isLoading) {
                    router.push('/');
                    console.log("Not authenticated: Redirecting to root")
                }
            } catch (error) {
                console.error('Error redirecting:', error);
            }
        };

        redirectIfUnauthorized().then(r => "");
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        // Check if db entry for auth0 key exists and create if no entry exists
        const createNewAuth0User = async () => {
            if (user !== undefined) {
                const data = {
                    "auth0Sub": user.sub as string,
                    "prevMood": "",
                    "currentMood": "optimal energy",
                    "lastUpdate": new Date()
                }
                const newEntry = await fetch('/api/auth0', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                })
            }
        }

        createNewAuth0User().then(r => "");
    }, [user]);

    useEffect(() => {
        toast.info('📱⌚️ Getting mood-based recommendations requires an iPhone app that is currently unreleased. Stay tuned.', {
            position: "top-center",
        });
    }, []);

    if (isLoading) {
        return (
            <>
                <div>
                    Loading ...
                </div>
            </>
        )
    }

    return (
        <div className="flex justify-center">
            <div className="text-base">
                <ToastContainer
                    position="top-center"
                    autoClose={20000}
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
            <div className="text-center">
                {user !== undefined ? (
                    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-32 space-y-8 lg:space-y-0">
                        <RecommendationComponent
                            energy_state={currentMood}
                            carMode={false}
                            setCurrentEnergyLevel={setCurrentEnergyLevel}
                        />
                        <CurrentMoodComponent
                            userName={user.name as string}
                            userSub={user.sub as string}
                            currentMood={currentMood}
                            setCurrentMood={setCurrentMood}
                            setUserAvailable={setUserAvailable}
                            currentEnergyLevel={currentEnergyLevel}
                        />
                    </div>

                ) : (
                    <div>
                        Loading Player ...
                    </div>
                )}

                {!userAvailable ? (
                    <div
                        className="mt-5 bg-gradient-radial from-black via-black to-gray-800 rounded-2xl sm:p-10 text-xs">
                        <p>MoodiSense iOS and watchOS are needed.</p>
                        <p>Download these apps and enter your auth0 key in App settings.</p>
                        <p className="pb-5">After downloading the apps, logout and login again on this site.</p>
                        <Link className="underline" href={"/"}>Go back to Homepage</Link>
                    </div>
                ) : (<></>)}

                <LogoutButton/>

                <p className="font-light text-xs text-gray-500 mt-10">Auth0 key: {user?.sub}</p>
                <button className="font-light text-xs text-gray-500 underline" onClick={() => setShowQR(true)}>
                    <p>Show QR-Code</p>
                </button>

                {showQR ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-55">
                        <div className="flex flex-col items-center bg-gradient-radial from-black via-black to-gray-800 rounded-2xl p-10 shadow-lg">
                            <QRCode value={user?.sub || ""} size={200}/>
                            <p className="mt-2 text-xs">{user?.sub}</p>
                            <div className="mt-5" onClick={() => setShowQR(false)}>
                                <p className="transition duration-150 ease-in-out hover:bg-stone-600 bg-stone-500 py-2 px-6 cursor-pointer rounded-2xl ">Done</p>
                            </div>
                        </div>
                    </div>
                ):(<></>)}
            </div>
        </div>
    )
}

export default Authorized;
