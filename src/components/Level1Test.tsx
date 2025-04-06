"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import EndOfTest from "./EndOfTest";
import { useSearchParams } from "next/navigation";


function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Level1Test() {
  const t = useTranslations("level1Test");

  const alphabet = t("letters").split("");
  const searchParams = useSearchParams();
  const currentDifficulty = searchParams.get("difficulty") ?? "easy";

  const [shuffledAlphabet, setShuffledAlphabet] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0); // track up to 2 tries
  const [isComposing, setIsComposing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shuffle the alphabet once on mount
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

  const handleAnswer = () => {
    if (isSubmitting || isComposing) return;
    setIsSubmitting(true);

    const trimmedInput = userAnswer.trim();
    const isLatin = /^[A-Za-z]$/.test(currentLetter);
    const expectedLetter = isLatin
      ? currentLetter.toUpperCase().normalize("NFC")
      : currentLetter.normalize("NFD");
    const actualInput = isLatin
      ? trimmedInput.toUpperCase().normalize("NFC")
      : trimmedInput.normalize("NFD");

    console.log(actualInput, expectedLetter);

    if (actualInput === expectedLetter) {
      setCorrectCount((prev) => prev + 1);
      setFeedback(t("feedbackCorrect"));
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else if (attempts === 0) {
      setFeedback(t("feedbackIncorrectOne"));
      setAttempts(1);
      setUserAnswer("");
      setIsSubmitting(false);
    } else {
      setFeedback(t("feedbackIncorrectTwo"));
      setTimeout(() => {
        nextQuestion();
      }, 1000);
      setUserAnswer("");
    }
  };


  const nextQuestion = () => {

    setUserAnswer("");
    setAttempts(0);
    setFeedback("");

    if (questionIndex === shuffledAlphabet.length - 1) {
      setIsFinished(true);
      submitProgress(correctCount + 1);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
    setIsSubmitting(false);
  };

  if (shuffledAlphabet.length === 0) {
    return (
      <div className="p-10 font-mono">
        {t("loadingTest")}
      </div>
    );
  }

  if (isFinished) {
    return (
      <EndOfTest score={{ correct: correctCount, total: shuffledAlphabet.length }} />
    );
  }

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      {/* Question count */}
      <h2 id="questionCount" className="text-xl mb-4">
        {t("questionCount", { current: questionIndex + 1, total: shuffledAlphabet.length })}
      </h2>
      
      {/* Instructions */}
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>
      
      {/* Display current letter with live region */}
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
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={(e) => {
          setIsComposing(false);
          setUserAnswer(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isComposing) {
            handleAnswer();
          }
        }}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black text-center"
        placeholder={t("inputPlaceholder")}
        maxLength={1}
        aria-labelledby="instruction questionCount"
      />

      {/* Feedback message announced immediately */}
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}

      {/* Submit button with ARIA label */}
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
