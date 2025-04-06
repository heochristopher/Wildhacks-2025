"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LandingPageImage from "../LandingPage.png";
import Logo from "../Logo.png";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("homepage");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100); // trigger after mount
  }, []);

  return (
    <div role="main">
      <div className="relative font-mono min-h-screen w-full overflow-hidden">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-green-800"
        >
          {t("skipToContent")}
        </a>

        {/* Background image with proper alt text and ARIA */}
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-out ${
            visible ? "opacity-50" : "opacity-0"
          }`}
          role="img"
          aria-label={t("backgroundAriaLabel")}
        >
          <Image
            src={LandingPageImage}
            alt="" // Decorative image, described by parent aria-label
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority // Load immediately as it's above the fold
          />
        </div>

        {/* Main content section */}
        <div
          id="main-content"
          className="relative z-10 flex items-center justify-center min-h-screen"
          aria-labelledby="main-heading"
        >
          {/* White gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-0"
            aria-hidden="true"
          />

          <div
            className={`w-full flex flex-col items-center justify-center transition-all duration-1000 ease-out z-10 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Logo with proper description */}
            <div role="banner">
              <Image
                src={Logo}
                alt={t("logoAlt")}
                width={400}
                height={400}
                priority // Load immediately as it's above the fold
              />
            </div>

            <h1 tabIndex={0} id="main-heading" className="text-black text-3xl pb-20 font-bold text-center">
              {t("description")}
            </h1>

            {/* Navigation section */}
            <nav aria-label="Primary navigation">
              <Link
                href="/signin"
                className="rounded-md bg-green-800 px-8 py-2.5 text-sm font-semibold text-white shadow-sm 
                           hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800
                           transition-colors duration-200"
                role="button"
                aria-label={t("getStartedAriaLabel")}
              >
                {t("getStarted")}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
