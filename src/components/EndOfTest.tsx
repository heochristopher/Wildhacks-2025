"use client";
import { useRouter } from "next/navigation";

interface EndOfLevelProps {
  score: {
    correct: number;
    total: number;
  };
}

export default function EndOfLevel({ score }: EndOfLevelProps) {
  const router = useRouter();
  const percentage = Math.round((score.correct / score.total) * 100);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-mono text-center">
      <h1 className="text-3xl font-bold mb-6">🎉 Great job!</h1>
      <p className="text-lg mb-4">
        You got <strong>{score.correct}</strong> out of <strong>{score.total}</strong> correct (
        {percentage}%)
      </p>
      <p className="text-lg mb-10">Would you like to continue or return home?</p>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/levels")}
          className="px-6 py-3 bg-gray-700 cursor-pointer text-white rounded hover:bg-gray-600"
        >
          Back to Levels
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-800 cursor-pointer text-white rounded hover:bg-green-700"
        >
          Replay Test
        </button>
      </div>
    </div>
  );
}
