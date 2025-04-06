"use client";
import { useRouter } from "next/navigation";
import Footer from "@/app/footer";

export default function LevelsDashboard() {
  const router = useRouter();

  const levels = [
    {
      id: "1",
      title: "Level 1",
      options: [
        { id: "1", label: "Learning" },
        { id: "2", label: "Test" },
      ],
    },
    {
      id: "2",
      title: "Level 2",
      options: [
        { id: "3", label: "Learning" },
        { id: "4", label: "Test" },
      ],
    },
    {
      id: "3",
      title: "Level 3",
      options: [
        { id: "5", label: "Reading" },
        { id: "6", label: "Writing" },
      ],
    },
  ];

  return (
    <div>
    <div className="min-h-screen p-10 bg-gray-100 font-mono">
      <h1 className="text-4xl font-bold text-center mb-10">Welcome to Your Dashboard</h1>
      <h1 className="text-xl font-bold text-center mb-10">Please choose a level and mode</h1>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {levels.map((level) => (
          <div key={level.id} className="flex flex-col py-16 sm:flex-row sm:items-center justify-between bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2 sm:mb-0">{level.title}</h2>
            <div className="flex gap-4">
              {level.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => router.push(`/levels/${option.id}`)}
                  className="bg-green-800 text-lg text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 transition"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </div>
  );
}
