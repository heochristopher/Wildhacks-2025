"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LevelsDashboard() {
  const router = useRouter();
  const t = useTranslations("levelsDashboard");

  const levels = [
    {
      id: "1",
      title: t("level1LearningTitle", "Level 1: Learning"),
      description: t("level1LearningDescription", "Learn the braille representation of each letter."),
    },
    {
      id: "2",
      title: t("level1TestTitle", "Level 1: Test"),
      description: t("level1TestDescription", "Test your knowledge of the braille alphabet."),
    },
    {
      id: "3",
      title: t("level2LearningTitle", "Level 2: Learning"),
      description: t("level2LearningDescription", "Practice reading and writing words."),
    },
    {
      id: "4",
      title: t("level2TestTitle", "Level 2: Test"),
      description: t("level2TestDescription", "Test your knowledge of simple words."),
    },
    {
      id: "5",
      title: t("level3ReadingTitle", "Level 3: Reading"),
      description: t("level3ReadingDescription", "Learn how to read braille sentences."),
    },
    {
      id: "6",
      title: t("level3WritingTitle", "Level 3: Writing"),
      description: t("level3WritingDescription", "Learn how to write sentences with braille."),
    },
  ];

  return (
    <div className="min-h-screen p-10 bg-gray-100 font-mono">
      <h1 className="text-4xl font-bold text-center mb-10">
        {t("pageTitle", "Choose a Braille Level")}
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
