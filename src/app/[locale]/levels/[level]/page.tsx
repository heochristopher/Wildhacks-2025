import { notFound } from "next/navigation";
import LevelOverview from "@/components/LevelOverview";
import { useTranslations } from "next-intl";

export default function LevelPage({ params }: { params: { level: string } }) {
  const t = useTranslations("levelPage");

  const levelData = {
    1: {
      title: t("level1LearningTitle", "Level 1: Learning"),
      description: t("level1LearningDescription", "Learn the braille representation of each letter."),
      startRoute: "/play/1learning",
    },
    2: {
      title: t("level1TestTitle", "Level 1: Test"),
      description: t("level1TestDescription", "Test your knowledge of the braille alphabet."),
      startRoute: "/play/1test",
    },
    3: {
      title: t("level2LearningTitle", "Level 2: Learning"),
      description: t("level2LearningDescription", "Practice reading and writing words."),
      startRoute: "/play/2learning",
    },
    4: {
      title: t("level2TestTitle", "Level 2: Test"),
      description: t("level2TestDescription", "Test your knowledge of simple words."),
      startRoute: "/play/2test",
    },
    5: {
      title: t("level3ReadingTitle", "Level 3: Reading"),
      description: t("level3ReadingDescription", "Learn how to read braille sentences."),
      startRoute: "/play/3reading",
    },
    6: {
      title: t("level3WritingTitle", "Level 3: Writing"),
      description: t("level3WritingDescription", "Learn how to write sentences with braille."),
      startRoute: "/play/3writing",
    },
  };

  const levelInfo = levelData[params.level as unknown as keyof typeof levelData];

  if (!levelInfo) {
    return notFound();
  }

  return (
    <main role="main" className="p-6">
      <LevelOverview
        title={levelInfo.title}
        description={levelInfo.description}
        startRoute={levelInfo.startRoute}
      />
    </main>
  );
}
