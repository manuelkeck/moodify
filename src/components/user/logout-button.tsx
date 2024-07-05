import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {ENV_URL} from "../../../env-config";

const LogoutButton = () => {
    const { logout } = useAuth0()

    return (
        <>
            <button
                className="transition w-40 duration-150 ease-in-out mt-3 bg-stone-600 active:bg-stone-700 text-white py-2 px-6 rounded-2xl cursor-pointer"
                onClick={() => logout({logoutParams: {returnTo: ENV_URL}})}
            >
                Logout
            </button>
        </>
    )
}

export default LogoutButton