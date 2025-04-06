"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import EndOfLevel from "./EndOfLevel";

export default function Level2Learning() {
  const t = useTranslations("level2Learning");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function fetchAndSpeak() {
      // Fetch questions only if still loading.
      if (isLoading) {
        try {
          const res = await fetch(
            "http://localhost:8000/generateContent/2?difficulty=easy&language=English"
          );
          const data = await res.json();
          setQuestions(data.content); // assuming data.content is an array of words
        } catch (err) {
          console.error("Error fetching content:", err);
        } finally {
          setIsLoading(false);
        }
      }
      // Once questions are loaded, speak the current word.
      if (!isLoading && questions.length > 0) {
        const currentWord = questions[questionNumber - 1];
        if (currentWord) {
          // Cancel any ongoing speech before starting a new utterance.
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(currentWord);
          utterance.lang = "en-US"; // adjust language as needed
          utterance.rate = 0.75; // adjust rate as needed
          window.speechSynthesis.speak(utterance);
        }
      }
    }
    fetchAndSpeak();
  }, [isLoading, questions, questionNumber]);


  const handleAnswer = () => {
    const currentWord = questions[questionNumber - 1]?.trim().toLowerCase();
    const answer = userAnswer.trim().toLowerCase();

    if (answer === currentWord) {
      setFeedback("");
      setUserAnswer("");

      if (questionNumber >= 10) {
        setIsFinished(true);
      } else {
        setQuestionNumber((prev) => prev + 1);
      }
    } else {
      setFeedback(t("feedbackIncorrect"));
      setUserAnswer("");
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
    return <EndOfLevel />;
  }

  const currentWord = questions[questionNumber - 1] || t("loadingFallback");

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      {/* Question count */}
      <h2 id="questionCount" className="text-xl mb-4">
        {t("questionCount", { current: questionNumber, total: 10 })}
      </h2>
      
      {/* Instructions */}
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>
      
      {/* Display current word */}
      <div className="text-2xl mb-6 font-semibold" aria-live="polite">
        {currentWord}
      </div>

      {/* Hidden label for input field */}
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

      {/* Feedback message */}
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleAnswer}
        className="px-6 py-2 cursor-pointer bg-green-700 text-white rounded hover:bg-green-600"
        aria-label={t("submitAriaLabel")}
      >
        {t("submit")}
      </button>
    </main>
  );
}
