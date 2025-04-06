"use client";
import { useEffect, useState } from "react";
import EndOfTest from "./EndOfTest";

export default function Level2Test() {
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0); // 0 or 1

  // Fetch progress and content
  useEffect(() => {
    const fetchProgressAndContent = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        const levelData = data.progress?.level2?.test;
        const difficulty = levelData?.difficulty ?? "easy";

        setCurrentDifficulty(difficulty);

        const contentRes = await fetch(
          `http://localhost:8000/generateContent/2?difficulty=${difficulty}&language=English`
        );
        const contentData = await contentRes.json();
        setQuestions(contentData.content.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch progress/content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressAndContent();
  }, []);

  const submitProgress = async (score: number) => {
    try {
      const percent = (score+1) / 10;
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
          level: 2,
          score: percent.toFixed(2),
          difficulty: newDifficulty,
        }),
      });
      await fetch("http://localhost:8000/submitTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          level: 2,
          score: percent.toFixed(2),
          difficulty: newDifficulty,
        }),
      });
    } catch (err) {
      console.error("Error submitting progress:", err);
    }
  };

  const handleAnswer = () => {
    const currentWord = questions[questionNumber - 1]?.trim().toLowerCase();
    const answer = userAnswer.trim().toLowerCase();

    if (answer === currentWord) {
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
    }
  };

  const nextQuestion = () => {
    setUserAnswer("");
    setAttempts(0);
    if (questionNumber >= 10) {
      setIsFinished(true);
      submitProgress(correctCount);
    } else {
      setQuestionNumber((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <div className="p-10 font-mono">Loading questions...</div>;
  }

  if (isFinished) {
    return <EndOfTest score={{ correct: correctCount, total: 10 }} />;
  }

  const currentWord = questions[questionNumber - 1] || "Loading...";

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Question {questionNumber} of 10</h2>
      <h3 className="mb-2">Please read and then spell this word:</h3>
      <div className="text-2xl mb-6 font-semibold">{currentWord}</div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black"
        placeholder="Type your answer here"
      />

      {feedback && <p className="text-red-600 mb-2">{feedback}</p>}

      <button
        onClick={handleAnswer}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
