"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EndOfTestProps {
  score: {
    correct: number;
    total: number;
  };
}

export default function EndOfTest({ score }: EndOfTestProps) {
  const router = useRouter();
  const t = useTranslations("endOfTest");
  const percentage = Math.round((score.correct / score.total) * 100);

  return (
    <main
      role="main"
      className="min-h-screen flex flex-col justify-center items-center font-mono text-center p-10"
    >
      <h1 className="text-3xl font-bold mb-6" tabIndex={0}>
        {t("congrats")}
      </h1>
      <p className="text-lg mb-4" tabIndex={0}>
        {t("scoreText", {
          correct: score.correct,
          total: score.total,
          percentage: percentage,
        })}
      </p>
      <p className="text-lg mb-10" tabIndex={0}>
        {t("continuePrompt")}
      </p>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/levels")}
          className="px-6 py-3 bg-gray-700 cursor-pointer text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          aria-label={t("backLevelsAria")}
        >
          {t("backLevels")}
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-800 cursor-pointer text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800"
          aria-label={t("replayTestAria")}
        >
          {t("replayTest")}
        </button>
      </div>
    </main>
  );
}
