"use client";
import { useRouter } from "next/navigation";

export default function EndOfLevel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-mono text-center">
      <h1 className="text-3xl font-bold mb-6">🎉 Great job!</h1>
      <p className="text-lg mb-10">Would you like to continue or return home?</p>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/levels")}
          className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Back to Levels
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-800 text-white rounded hover:bg-green-700"
        >
          Replay Level
        </button>
      </div>
    </div>
  );
}
