"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import EndOfLevel from "./EndOfLevel";

export default function Level1Learning() {
  const t = useTranslations("level1Learning");

  // Get the letters from translations (could be Hangul or English)
  const alphabet = t("letters").split("");

  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const currentLetter = alphabet[questionIndex];

  const handleAnswer = () => {
    const trimmedInput = userAnswer.trim();
    // Check if currentLetter is a Latin character using a regex
    const isLatin = /^[A-Za-z]$/.test(currentLetter);
    const expectedLetter = isLatin ? currentLetter.toUpperCase() : currentLetter;
    const actualInput = isLatin ? trimmedInput.toUpperCase() : trimmedInput;

    if (actualInput === expectedLetter) {
      setFeedback("");
      setUserAnswer("");

      if (questionIndex === alphabet.length - 1) {
        setIsFinished(true);
      } else {
        setQuestionIndex((prev) => prev + 1);
      }
    } else {
      setFeedback(t("feedbackIncorrect"));
      setUserAnswer("");
    }
  };

  if (isFinished) return <EndOfLevel />;

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      {/* Letter count and instructions */}
      <h2 id="letterCount" className="text-xl mb-4">
        {t("letterCount", { current: questionIndex + 1, total: alphabet.length })}
      </h2>
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>

      {/* Current letter displayed with polite live region */}
      <div className="text-4xl font-bold mb-6" aria-live="polite">
        {currentLetter}
      </div>

      {/* Hidden label for screen readers */}
      <label htmlFor="userAnswer" className="sr-only">
        {t("inputLabel")}
      </label>
      <input
        id="userAnswer"
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAnswer();
          }
        }}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black text-center"
        placeholder={t("inputPlaceholder")}
        maxLength={1}
        aria-labelledby="instruction letterCount"
      />

      {/* Feedback message announced via role="alert" */}
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}

      {/* Submit button with aria-label */}
      <button
        onClick={handleAnswer}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
        aria-label={t("submitAriaLabel")}
      >
        {t("submit")}
      </button>
    </main>
  );
}
