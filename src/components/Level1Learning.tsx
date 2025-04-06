"use client";
import { useState } from "react";
import EndOfLevel from "./EndOfLevel";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Level1Test() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const currentLetter = alphabet[questionIndex];

  const handleAnswer = () => {
    if (userAnswer.trim().toUpperCase() === currentLetter) {
      setFeedback("");
      setUserAnswer("");

      if (questionIndex === alphabet.length - 1) {
        setIsFinished(true);
      } else {
        setQuestionIndex((prev) => prev + 1);
      }
    } else {
      setFeedback("❌ Incorrect. Try again!");
      setUserAnswer("");
    }
  };

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
