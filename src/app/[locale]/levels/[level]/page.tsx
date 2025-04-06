// /app/levels/[level]/page.tsx
import { notFound } from "next/navigation";
import LevelOverview from "@/components/LevelOverview";
import { useTranslations } from "next-intl";


export default function LevelPage({ params }: { params: { level: string } }) {
  const t = useTranslations("levelPage");
  const routes = {
    1: "/play/1learning",
    2: "/play/1test",
    3: "/play/2learning",
    4: "/play/2test",
    5: "/play/3reading",
    6: "/play/3writing"
  };
  
  // Level data with translatable text coming from JSON files.
  const levelData = {
    1: {
      title: t("level1LearningTitle"),
      description: t("level1LearningDescription"),
      startRoute: routes[1],
    },
    2: {
      title: t("level1TestTitle"),
      description: t("level1TestDescription"),
      startRoute: routes[2],
    },
    3: {
      title: t("level2LearningTitle"),
      description: t("level2LearningDescription"),
      startRoute: routes[3],
    },
    4: {
      title: t("level2TestTitle"),
      description: t("level2TestDescription"),
      startRoute: routes[4],
    },
    5: {
      title: t("level3ReadingTitle"),
      description: t("level3ReadingDescription"),
      startRoute: routes[5],
    },
    6: {
      title: t("level3WritingTitle"),
      description: t("level3WritingDescription"),
      startRoute: routes[6],
    },
  };

  const levelInfo = levelData[params.level as unknown as keyof typeof levelData];

  if (!levelInfo) {
    return notFound(); // 404 if invalid level
  }

  return (
    <LevelOverview
      title={levelInfo.title}
      description={levelInfo.description}
      startRoute={levelInfo.startRoute}
    />
  );
}
