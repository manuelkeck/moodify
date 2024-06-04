import LogoutButton from "@/components/user/logout-button";
import { useAuth0 } from "@auth0/auth0-react";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import CurrentMoodComponent from "@/components/user/current-mood-component";
import RecommendationComponent from "@/components/user/recommendation-component";
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Link from "next/link";

const Authorized: React.FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();
    const [currentMood, setCurrentMood] = useState("")
    const [userAvailable, setUserAvailable] = useState(true)

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
        toast.info('📱⌚️ Getting mood-based recommendations requires an iPhone app that is currently unreleased. Stay tuned.', {
            position: "top-center",
        });
    }, []);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        <div className="flex justify-center">
            <div className="text-base">
                <ToastContainer
                    position="top-center"
                    autoClose={20000}
                    hideProgressBar={false}
                    newestOnTop
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
                {user !== undefined && (
                    <CurrentMoodComponent
                        userName={user.name as string}
                        userSub={user.sub as string}
                        currentMood={currentMood}
                        setCurrentMood={setCurrentMood}
                        setUserAvailable={setUserAvailable}
                    />
                )}
                {currentMood !== "" ? (
                    <>
                        <RecommendationComponent mood={currentMood} carMode={false}/>
                    </>
                ) : (
                    <div>Loading Player ...</div>
                )}

                {!userAvailable ? (
                    <div className="mt-5 bg-gradient-radial from-black via-black to-gray-800 rounded-2xl sm:p-10">

                        <p>Corresponding Moodify iOS App instance not found.</p>
                        <Link className="underline" href={"/"}>Go back to Homepage</Link>
                    </div>
                ) : (
                    <></>
                )}
                <LogoutButton/>
            </div>
        </div>
    )
}

export default Authorized;
