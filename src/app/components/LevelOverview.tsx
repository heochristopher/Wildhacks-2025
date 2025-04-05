// /components/LevelOverview.tsx
"use client";
import { useRouter } from "next/navigation";

interface LevelOverviewProps {
  title: string;
  description: string;
  startRoute: string;
}

export default function LevelOverview({ title, description, startRoute }: LevelOverviewProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen p-10 bg-white flex flex-col items-center justify-center font-mono">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-xl">{description}</p>
      <button
        onClick={() => router.push(startRoute)}
        className="cursor-pointer px-6 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition"
      >
        Start
      </button>
    </div>
  );
}
