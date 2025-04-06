"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LevelsDashboard() {
  const router = useRouter();
  const t = useTranslations("levelsDashboard");

  const levels = [
    {
      id: "1",
      title: t("level1LearningTitle"),
      description: t("level1LearningDescription"),
    },
    {
      id: "2",
      title: t("level1TestTitle"),
      description: t("level1TestDescription"),
    },
    {
      id: "3",
      title: t("level2LearningTitle"),
      description: t("level2LearningDescription"),
    },
    {
      id: "4",
      title: t("level2TestTitle"),
      description: t("level2TestDescription"),
    },
    {
      id: "5",
      title: t("level3ReadingTitle"),
      description: t("level3ReadingDescription"),
    },
    {
      id: "6",
      title: t("level3WritingTitle"),
      description: t("level3WritingDescription"),
    },
  ];

  return (
    <div className="min-h-screen p-10 bg-gray-100 font-mono">
      <h1 className="text-4xl font-bold text-center mb-10">
        {t("pageTitle")}
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        {levels.map((level) => (
          <div
            key={level.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/levels/${level.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push(`/levels/${level.id}`);
              }
            }}
            className="cursor-pointer bg-white shadow-md rounded-lg p-6 hover:bg-green-100 transition"
            aria-label={`${level.title}: ${level.description}`}
          >
            <h2 className="text-xl font-semibold">{level.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{level.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
