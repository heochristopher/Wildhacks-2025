"use client";
import { useState, useEffect } from "react";
import EndOfLevel from "./EndOfLevel";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Level1Test() {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const currentLetter =
    questionIndex !== null ? alphabet[questionIndex] : undefined;

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        const userProgress = data.progress?.level1?.learning?.lastCompleted ?? 0;
        if (userProgress < 0 || userProgress >= alphabet.length) {
          setQuestionIndex(0); // fallback
          return;
        }
        setQuestionIndex(userProgress);
      } catch (err) {
        console.error("Failed to load user progress:", err);
        setQuestionIndex(0); // fallback
      }
    };

    fetchProgress();
  }, []);

  const submitProgress = async (index: number) => {
    try {
      await fetch("http://localhost:8000/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          level: 1,
          score: "-1",
          lastCompleted: index,
        }),
      });
    } catch (err) {
      console.error("Error updating score:", err);
    }
  };

  // Only submit on page unload
  useEffect(() => {
    if (questionIndex === null) return;

    const handleBeforeUnload = () => {
      submitProgress(questionIndex);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [questionIndex]);

  const handleAnswer = () => {
    if (questionIndex === null) return;

    if (userAnswer.trim().toUpperCase() === alphabet[questionIndex]) {
      setFeedback("");
      setUserAnswer("");
4
      if (questionIndex === alphabet.length - 1) {
        submitProgress(questionIndex); // Submit once on final question
        setIsFinished(true);
      } else {
        setQuestionIndex((prev) => (prev !== null ? prev + 1 : 0));
      }
    } else {
      setFeedback("❌ Incorrect. Try again!");
      setUserAnswer("");
    }
  };

  if (questionIndex === null) {
    return <div className="p-10 font-mono">Loading your progress...</div>;
  }

  if (isFinished) return <EndOfLevel />;

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
