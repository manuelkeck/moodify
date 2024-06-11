import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import {useCookies} from "react-cookie";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()
    const [cookies] = useCookies()

    return (
        <>
            <button
                className="transition duration-150 ease-in-out mt-10 bg-stone-600 active:bg-gray-700 text-white py-2 px-4 rounded-2xl cursor-pointer"
                onClick={() => loginWithRedirect()}
            >
                Login / Signup with Auth0
            </button>
        </>
    )
}

export default LoginButton