"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import EndOfTest from "./EndOfTest";

export default function Level2Test() {
  const t = useTranslations("level2Test");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0); // 0 or 1

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/generateContent/2?difficulty=easy&language=English"
        );
        const data = await res.json();
        setQuestions(data.content.slice(0, 10)); // Limit to 10 questions
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = () => {
    const currentWord = questions[questionNumber - 1]?.trim().toLowerCase();
    const answer = userAnswer.trim().toLowerCase();

    if (answer === currentWord) {
      setCorrectCount((prev) => prev + 1);
      setFeedback(t("feedbackCorrect"));
      nextQuestion();
    } else if (attempts === 0) {
      setFeedback(t("feedbackIncorrectOne"));
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback(t("feedbackIncorrectTwo"));
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    setUserAnswer("");
    setAttempts(0);
    if (questionNumber >= 10) {
      setIsFinished(true);
    } else {
      setQuestionNumber((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 font-mono">
        {t("loading")}
      </div>
    );
  }

  if (isFinished) {
    return <EndOfTest score={{ correct: correctCount, total: 10 }} />;
  }

  const currentWord = questions[questionNumber - 1] || t("loadingFallback");

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      {/* Question Count */}
      <h2 id="questionCount" className="text-xl mb-4">
        {t("questionCount", { current: questionNumber, total: 10 })}
      </h2>

      {/* Instructions */}
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>

      {/* Display current word with live region */}
      <div className="text-2xl mb-6 font-semibold" aria-live="polite">
        {currentWord}
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
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black"
        placeholder={t("inputPlaceholder")}
        maxLength={50}
        aria-labelledby="instruction questionCount"
      />

      {/* Feedback message announced via role="alert" */}
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}

      {/* Submit Button */}
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
