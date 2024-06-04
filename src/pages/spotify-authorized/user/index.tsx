import Link from "next/link";
import React from "react";
import LoginButton from "@/components/user/login-button";

const Auth0LoginPage = () => {
    return (
        <div className="flex-row text-center">
            <LoginButton />

            <div
                className="font-normal text-xs flex flex-col items-center justify-center bg-black text-white underline mt-10">
                <Link href="/">Go back and use Moodify as Guest</Link>
            </div>
        </div>
    );
}

export default Auth0LoginPage

