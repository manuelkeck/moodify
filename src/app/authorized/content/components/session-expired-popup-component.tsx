import {useRouter} from "next/navigation";
import {useState} from "react";
import {useCookies} from "react-cookie";

interface SessionExpiredPopupProps {
    onClose: () => void;
}

function SessionExpiredPopupComponent({ onClose }: SessionExpiredPopupProps) {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(true);
    const [cookies, removeCookie] = useCookies();

    const handleClick = () => {
        setShowPopup(false);
        onClose();
        removeCookie('spotifyToken', { path: '/' });
        // router.push("/");
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85">
            <div className="bg-stone-800 p-6 rounded shadow-lg">
                <p className="mb-3">Session expired. Log in again.</p>
                <a href="/">
                    <button
                        onClick={() => handleClick()}
                        className="transition duration-150 ease-in-out bg-red-500 hover:bg-red-700 text-white font-medium text-base py-2 px-4 rounded mt-4 cursor-pointer"
                    >
                        Login
                    </button>
                </a>
            </div>
        </div>
    );
}

export default SessionExpiredPopupComponent