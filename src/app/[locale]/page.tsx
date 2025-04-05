"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LandingPageImage from "../LandingPage.png";
import Logo from "../Logo.png";
import Footer from "../footer"

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100); // trigger after mount
  }, []);

  return (
    <div>
    <div className="relative font-mono min-h-screen w-full overflow-hidden">
       {/* <div className="absolute top-6 right-6 z-10">
        <a
          href="/signin"
          className="rounded-md bg-green-800 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900"
        >
          Sign In
        </a>
      </div> */}
{/* Sign In Button */}
      {/* Background image with fade-in */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-out ${
          visible ? "opacity-50" : "opacity-0"
        }`}
      >
        
        <Image
          src={LandingPageImage}
          alt="Front Image"
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      

      {/* Centered content with fade-in + white ombre overlay */}
<div className="relative z-10 flex items-center justify-center min-h-screen">
  {/* White gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-0" />

  <div
    className={`w-full flex flex-col items-center justify-center transition-all duration-1000 ease-out z-10 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
  >
    <Image
      src={Logo}
      alt="Logo"
      width={400}
      height={400}
      className=""
    />
    <h1 className="text-black text-3xl pb-20 font-bold text-center">
      Learn Braille Interactively
    </h1>
    <a
          href="/signin"
          className="rounded-md bg-green-800 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900"
        >
          Get Started
        </a>
  </div>
    </div>
    </div>
        <Footer/>
        </div>
  );
}
