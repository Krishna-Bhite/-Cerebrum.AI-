"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";
import Link from "next/link";

export function WavyBackgroundDemo() {
  return (
    <WavyBackground
      className="max-w-4xl mx-auto flex flex-col items-center justify-between"
      containerClassName="w-full h-screen"
    >
      <>
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
          Ready to ace your next interview?
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
          Practice on real interview questions and get instant feedback with AI
          powered practice.
        </p>
      </>
      <Link href={"/home"} className="cursor-pointer">
        <button className="p-[3px] relative mt-[60px]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            Get Started 🎉
          </div>
        </button>
      </Link>
    </WavyBackground>
  );
}
