"use client";
import { useState, useEffect } from "react";
import EndOfTest from "./EndOfTest";
import { useSearchParams } from "next/navigation";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Level1Test() {
  const searchParams = useSearchParams();
  const currentDifficulty = searchParams.get("difficulty") ?? "easy";

  const [shuffledAlphabet, setShuffledAlphabet] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setShuffledAlphabet(shuffle(alphabet));
  }, []);

  const currentLetter = shuffledAlphabet[questionIndex];

  const submitProgress = async (score: number) => {
    try {
      const percent = score / shuffledAlphabet.length;
      let newDifficulty = currentDifficulty;

      if (percent < 0.5) {
        if (currentDifficulty === "medium") newDifficulty = "easy";
        else if (currentDifficulty === "hard") newDifficulty = "medium";
      } else if (percent > 0.8) {
        if (currentDifficulty === "easy") newDifficulty = "medium";
        else if (currentDifficulty === "medium") newDifficulty = "hard";
      }

      await fetch("http://localhost:8000/submitTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          level: 1,
          score: percent.toFixed(2).toString(),
          difficulty: newDifficulty,
        }),
      });
    } catch (err) {
      console.error("Error submitting test:", err);
    }
  };

  const handleAnswer = () => {
    const trimmed = userAnswer.trim().toUpperCase();

    if (trimmed === currentLetter) {
      setCorrectCount((prev) => prev + 1);
      setFeedback("✅ Correct!");
      nextQuestion();
    } else if (attempts === 0) {
      setFeedback("❌ Incorrect. One more try!");
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback("❌ Incorrect again.");
      nextQuestion();
      setUserAnswer("");
    }
  };

  const nextQuestion = () => {
    setUserAnswer("");
    setAttempts(0);

    if (questionIndex === shuffledAlphabet.length - 1) {
      setIsFinished(true);
      submitProgress(correctCount + 1);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  if (shuffledAlphabet.length === 0) {
    return <div className="p-10 font-mono">Preparing test...</div>;
  }

  if (isFinished) {
    return (
      <EndOfTest score={{ correct: correctCount, total: shuffledAlphabet.length }} />
    );
  }

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Letter {questionIndex + 1} of 26</h2>
      <h3 className="mb-2">Read the letter and then type it back:</h3>
      <div className="text-4xl font-bold mb-6">{currentLetter}</div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black text-center"
        placeholder="Type the letter"
        maxLength={1}
      />

      {feedback && <p className="text-red-600 mb-2">{feedback}</p>}

      <button
        onClick={handleAnswer}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
}
