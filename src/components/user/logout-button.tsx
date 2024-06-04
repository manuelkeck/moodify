import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LogoutButton = () => {
    const { logout } = useAuth0()

    return (
        <>
            <button
                className="transition duration-150 ease-in-out mt-10 bg-gray-600 active:bg-gray-700 text-white py-2 px-6 rounded-2xl cursor-pointer"
                //onClick={() => logout({logoutParams: {returnTo: "http://localhost:3000"}})}
                onClick={() => logout({logoutParams: {returnTo: "https://changeyourmood.vercel.app"}})}
            >
                Logout
            </button>
        </>
    )
}

export default LogoutButton