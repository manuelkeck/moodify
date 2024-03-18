import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Link from "next/link";
import ErrorBoundary from "@/app/authorized/content/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Moodify",
    description: "Let the music change your mood",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="">
          <body className="">
              <div className="flex flex-col h-screen justify-between bg-black">

                  <header className="bg-black opacity-85 text-white sticky top-0 z-10">
                      <nav className="px-4 py-2">
                          <div className="flex items-center justify-between text-blue-gray-900">
                              <a href="/"
                                 className="mr-4 block cursor-pointer font-sans text-white">
                                  Moodify
                              </a>
                              <div className="">
                                  <ul className="flex gap-2 mt-2 mb-2 lg:flex-row lg:items-center">
                                      <li className="block p-1 font-sans font-normal text-blue-gray-900">
                                          <Link href="/" className="flex items-center">
                                              Home
                                          </Link>
                                      </li>
                                      <li className="block p-1 font-sans font-normal text-blue-gray-900">
                                          <Link href="/ai/" className="flex items-center">
                                              AI
                                          </Link>
                                      </li>
                                      {/*<li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">*/}
                                      {/*    <Link href="/authorized/" className="flex items-center">*/}
                                      {/*        About*/}
                                      {/*    </Link>*/}
                                      {/*</li>*/}
                                      <li className="block p-1 font-sans font-normal text-blue-gray-900">
                                          <Link href="/about/" className="">
                                              About
                                          </Link>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </nav>
                  </header>

                  <main className="flex-grow bg-black text-white py-8 flex items-center justify-center">
                      {children}
                  </main>

                  <footer className="bg-black text-center text-gray-500 py-4 px-6">
                      <p className="text-white py-5">🚀 v1.64.1</p>
                      <p>&copy; Copyright 2024 Manuel Keck</p>
                  </footer>

              </div>
          </body>
      </html>
    );
}
