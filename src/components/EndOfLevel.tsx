"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EndOfLevel() {
  const router = useRouter();
  const t = useTranslations("endOfLevel");

  return (
    <main
      role="main"
      className="min-h-screen flex flex-col justify-center items-center font-mono text-center p-10"
    >
      <h1 className="text-3xl font-bold mb-6" tabIndex={0}>
        {t("congrats")}
      </h1>
      <p className="text-lg mb-10" tabIndex={0}>
        {t("continuePrompt")}
      </p>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/levels")}
          className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          aria-label={t("backLevelsAria")}
        >
          {t("backLevels")}
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-800 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
          aria-label={t("replayLevelAria")}
        >
          {t("replayLevel")}
        </button>
      </div>
    </main>
  );
}
