import {useState} from "react";
import {useRouter} from "next/navigation";

function SessionExpiredPopupComponent() {
    const router = useRouter();


    const handleClick = () => {
        router.push("/");
    }

    return (
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
    );
}

export default SessionExpiredPopupComponent