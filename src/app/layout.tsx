import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Home from "@/app/page";
import Link from "next/link";
import {headers} from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moodify",
  description: "Let the music change your mood",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
      <html lang="en">
        <body className="overflow-y-auto flex flex-col min-h-screen bg-black">
          <div className="">
            <nav
                className="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-black rounded-none shadow-md h-max backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
              <div className="flex items-center justify-between text-blue-gray-900">
                <a href="/"
                   className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased text-white">
                  Moodify
                </a>
                <div className="flex items-center gap-4">
                  <div className="hidden mr-4 lg:block">
                    <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                      <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        <a href="/" className="flex items-center">
                          Home
                        </a>
                      </li>
                      <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        <Link href="/authorized/content/mood-selection/" className="flex items-center">
                          Mood
                        </Link>
                      </li>
                      <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        <a href="#" className="flex items-center">
                          ---
                        </a>
                      </li>
                      <li className="block p-1 font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        <a href="#" className="flex items-center">
                          ---
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
            <main className="flex-grow">
                {children}
            </main>
            <div className="w-full text-gray-500 px-4 py-2 lg:px-8 lg:py-4 flex items-center justify-center bg-black">
              <p>&copy; Copyright 2024 Manuel Keck</p>
            </div>
          </div>
        </body>
      </html>
  );
}
