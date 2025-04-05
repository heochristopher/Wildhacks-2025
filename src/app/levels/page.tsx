"use client";
import { useRouter } from "next/navigation";

export default function LevelsDashboard() {
  const router = useRouter();

  const levels = [
    {
      id: "1",
      title: "Level 1: Learning",
      description: "Learn the braille representation of each letter.",
    },
    {
      id: "2",
      title: "Level 1: Test",
      description: "Test your knowledge of the braille alphabet.",
    },
    {
      id: "3",
      title: "Level 2: Learning",
      description: "Practice reading and writing words.",
    },
    {
      id: "4",
      title: "Level 2: Test",
      description: "Test your knowledge of simple words.",
    },
    {
      id: "5",
      title: "Level 3: Reading",
      description: "Learn how to read braille sentences.",
    },
    {
      id: "6",
      title: "Level 3: Writing",
      description: "Learn how to write sentences with braille.",
    },
  ];

  return (
    <div className="min-h-screen p-10 bg-gray-100 font-mono">
      <h1 className="text-4xl font-bold text-center mb-10">Choose a Braille Level</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {levels.map((level) => (
          <div
            key={level.id}
            onClick={() => router.push(`/levels/${level.id}`)}
            className="cursor-pointer bg-white shadow-md rounded-lg p-6 hover:bg-green-100 transition"
          >
            <h2 className="text-xl font-semibold">{level.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{level.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
