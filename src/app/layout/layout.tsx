import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Link from "next/link";
import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {MOODIFY_VERSION} from "../../../env-config";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
    title: "Moodify",
    description: "Let the music change your mood",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const { loginWithRedirect } = useAuth0()

    return (
        <div className="">
            <div className="flex flex-col h-screen justify-between bg-black">
                <div className="bg-black opacity-85 text-white sticky top-0 z-10">
                    <nav className="px-4 py-2">
                        <div className="flex items-center justify-between text-blue-gray-900">
                            <Link href="/" className="mr-4 block cursor-pointer font-sans text-white">
                                Moodify
                            </Link>
                            <div className="">
                                <ul className="flex gap-2 lg:flex-row lg:items-center">
                                    <li className="block p-1 font-sans font-normal text-blue-gray-900">
                                        <Link href="/" className="flex items-center">
                                            Home
                                        </Link>
                                    </li>
                                    {/*<li className="block p-1 font-sans font-normal text-blue-gray-900">
                                        <Link href="/ai/" className="flex items-center">
                                            AI
                                        </Link>
                                    </li>*/}
                                    {/*<li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">*/}
                                    {/*    <Link href="/authorized/" className="flex items-center">*/}
                                    {/*        Index*/}
                                    {/*    </Link>*/}
                                    {/*</li>*/}
                                    <li className="block p-1 font-sans font-normal text-blue-gray-900">
                                        <Link href="/about" className="">
                                            About
                                        </Link>
                                    </li>
                                    {/*<li className="block p-1 font-sans font-normal text-blue-gray-900">
                                        <Link href="/spotify-authorized/user/authorized" className="" onClick={() => loginWithRedirect()}>
                                            Login
                                        </Link>
                                    </li>*/}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>

                <main className="flex-grow bg-black text-white py-8 flex items-center justify-center scroll-smooth">
                    {children}
                </main>

                <footer className="bg-black text-center text-gray-500 py-4 px-6">
                    <p className="text-white py-5 text-xs">🚀 {MOODIFY_VERSION}</p>
                    <p>&copy; 2024 Manuel Keck. All rights reserved.</p>
                </footer>

            </div>
        </div>
    );
}
