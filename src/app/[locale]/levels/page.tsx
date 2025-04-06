"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function LevelsDashboard() {
  const router = useRouter();
  const t = useTranslations("levelsDashboard");

  const [progress, setProgress] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include", // assumes auth is cookie-based
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard progress");
        const data = await res.json();
        console.log("Dashboard data:", data);
        setProgress(data.progress);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const levels = [
    {
      id: "1",
      title: t("level1LearningTitle"),
      description: t("level1LearningDescription"),
      levelKey: "level1",
      typeKey: "learning",
      total: 26,
    },
    {
      id: "2",
      title: t("level1TestTitle"),
      description: t("level1TestDescription"),
      levelKey: "level1",
      typeKey: "test",
      total: 26,
    },
    {
      id: "3",
      title: t("level2LearningTitle"),
      description: t("level2LearningDescription"),
      levelKey: "level2",
      typeKey: "learning",
      total: 10,
    },
    {
      id: "4",
      title: t("level2TestTitle"),
      description: t("level2TestDescription"),
      levelKey: "level2",
      typeKey: "test",
      total: 10,
    },
    {
      id: "5",
      title: t("level3ReadingTitle"),
      description: t("level3ReadingDescription"),
      levelKey: "level3",
      typeKey: "reading",
      total: 3,
    },
    {
      id: "6",
      title: t("level3WritingTitle"),
      description: t("level3WritingDescription"),
      levelKey: "level3",
      typeKey: "test",
      total: 3,
    },
  ];

  const groupedLevels = levels.reduce((acc, level) => {
    if (!acc[level.levelKey]) acc[level.levelKey] = [];
    acc[level.levelKey].push(level);
    return acc;
  }, {} as { [key: string]: typeof levels });

  return (
    <main role="main" className="min-h-screen font-mono px-16 py-16">
      <h1 tabIndex={0} className="text-3xl font-bold text-center mb-6 mt-16">
        {t("welcomeMessage")}
      </h1>
      <h2 tabIndex={0} className="text-lg text-center mb-4">
        {t(
          "dashboardInstructions"
        )}
      </h2>
      {error && (
        <p role="alert" className="text-red-600 text-center">
          {error}
        </p>
      )}
      {isLoading ? (
        <div className="text-center">{t("loading")}</div>
      ) : (
        Object.entries(groupedLevels).map(([levelKey, levelItems], index) => (
          <section
            key={levelKey}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
            aria-labelledby={`group-${levelKey}-title`}
          >
            {/* Left side: Group title */}
            <div className="mb-4 md:mb-0 md:mr-6 w-full md:w-1/3">
              <h2
                id={`group-${levelKey}-title`}
                className="text-2xl font-bold text-black mb-1"
              >
                {t("levelGroup", { group: index + 1, level: levelKey })}
              </h2>
            </div>

            {/* Right side: Level Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-2/3">
              {levelItems.map((level) => {
                const levelProgress = progress?.[level.levelKey]?.[level.typeKey] || {};
                const { lastCompleted, score, difficulty } = levelProgress;

                return (
                  <div
                    key={level.id}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      router.push(
                        `/levels/${level.id}?lastCompleted=${
                          lastCompleted ?? 0
                        }&score=${score ?? -1}&difficulty=${difficulty ?? ""}`
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        router.push(
                          `/levels/${level.id}?lastCompleted=${
                            lastCompleted ?? 0
                          }&score=${score ?? -1}&difficulty=${difficulty ?? ""}`
                        );
                      }
                    }}
                    className="cursor-pointer bg-gray-50 hover:bg-green-100 border border-gray-200 rounded-lg p-4 transition w-full"
                    aria-label={`${level.title}: ${level.description}`}
                  >
                    <h3 className="text-lg font-semibold text-black">
                      {level.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                    {typeof lastCompleted === "number" && (
                      <p className="text-sm text-blue-700 mt-2 font-medium">
                        {t("lastCompleted", {
                          completed: lastCompleted + 1,
                          total: level.total,
                        })}
                      </p>
                    )}
                    {(score !== "-1" && score !== -1) && (
                      <p className="text-sm text-green-700 font-medium">
                        {t("scoreLabel", { score })}
                      </p>
                    )}
                    {difficulty && (
                      <p className="text-sm text-gray-700 font-medium">
                        {t("difficultyLabel", { difficulty })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
