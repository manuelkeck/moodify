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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
          <body>
              <div className="flex flex-col min-h-screen">

                  <header className="bg-black text-white sticky top-0 z-10">
                      <nav className="lg:px-8 lg:py-4">
                          <div className="flex items-center justify-between text-blue-gray-900">
                              <a href="/"
                                 className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased text-white">
                                  Moodify
                              </a>
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
                                              About
                                          </a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </nav>
                  </header>

                  <main className="flex-1 bg-black text-white px-6 py-8">
                      <div className="flex flex-col items-center justify-center h-full">
                          {children}
                      </div>
                  </main>

                  <footer className="bg-black text-center text-gray-500 py-4 px-6">
                      &copy; Copyright 2024 Manuel Keck
                  </footer>

              </div>
          </body>
      </html>
  );
}
