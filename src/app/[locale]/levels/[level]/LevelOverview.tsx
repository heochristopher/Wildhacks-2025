"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface LevelOverviewProps {
  title: string;
  description: string;
  startRoute: string;
}

export default function LevelOverview({ title, description, startRoute }: LevelOverviewProps) {
  const router = useRouter();
  const t = useTranslations("levelOverview");

  return (
    <main role="main" className=" min-h-screen p-10 bg-white flex flex-col items-center justify-center font-mono">
      <h1 tabIndex={0} className="text-4xl font-bold mb-4 text-black">{title}</h1>
      <p tabIndex={0} className="text-lg text-gray-700 mb-10 text-center max-w-xl">{description}</p>
      <button
        tabIndex={0}
        onClick={() => router.push(startRoute)}
        className="cursor-pointer px-6 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition"
        aria-label={t("startAriaLabel")}
      >
        {t("buttonText")}
      </button>
    </main>
  );
}
