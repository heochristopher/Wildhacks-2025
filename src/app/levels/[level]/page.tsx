// /app/levels/[level]/page.tsx
import { notFound } from "next/navigation";
import LevelOverview from "./LevelOverview";

const levelData = {
  1: {
    title: "Level 1: Learning",
    description: "Learn the braille representation of each letter.",
    startRoute: "/play/1learning",
  },
  2: {
    title:  "Level 1: Test",
    description: "Test your knowledge of the braille alphabet.",
    startRoute: "/play/1test",
  },
  3: {
    title: "Level 2: Learning",
    description: "Practice reading and writing words.",
    startRoute: "/play/2learning",
  },
  4: {
    title:  "Level 2: Test",
    description: "Test your knowledge of simple words.",
    startRoute: "/play/2test",
  },
  5: {
    title: "Level 3: Reading",
    description: "Learn how to read braille sentences.",
    startRoute: "/play/3reading",
  },
  6: {
    title:  "Level 3: Writing",
    description: "Learn how to write sentences with braille.",
    startRoute: "/play/3writing",
  }
};

export default function LevelPage({ params }: { params: { level: string } }) {
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
