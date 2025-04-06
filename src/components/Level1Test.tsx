"use client";
import { useState } from "react";
import EndOfLevel from "./EndOfLevel";

export default function AlphabetLearning() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = () => {
    if (questionNumber >= 10) {
      setIsFinished(true);
    } else {
      setQuestionNumber((prev) => prev + 1);
    }
  };

  if (isFinished) {
    return <EndOfLevel />;
  }

  return (
    <div className="flex flex-col p-10 items-center justify-center font-mono min-h-screen">
      <h2 className="text-xl mb-4 ">Question {questionNumber} of 10</h2>
      {/* your question logic goes here */}
      <button
        onClick={handleAnswer}
        className="mt-4 px-6 py-2 bg-green-700 cursor-pointer text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
