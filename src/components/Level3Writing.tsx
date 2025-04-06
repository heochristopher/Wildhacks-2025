"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import EndOfTest from "./EndOfTest";

export default function Level3Writing() {
  const t = useTranslations("level3Writing");
  const [sentences, setSentences] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // Fetch sentences on mount.
  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/generateContent/3?difficulty=easy&language=English"
        );
        const data = await res.json();
        setSentences(data.content);
      } catch (err) {
        console.error(t("errorFetch"), err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentences();
  }, [t]);

  const currentSentence = sentences[questionIndex]?.trim();

  // Speak the current sentence when it changes.
  useEffect(() => {
    if (currentSentence) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.lang = "en-US";
      utterance.rate = 0.75; // Adjust rate as needed.
      window.speechSynthesis.speak(utterance);
    }
  }, [currentSentence]);

  const handleAnswer = () => {
    const user = userAnswer.trim().toLowerCase();
    const expected = currentSentence?.toLowerCase();

    if (user === expected) {
      setCorrectCount((prev) => prev + 1);
      setFeedback("✅ Correct!");
      const utterance = new SpeechSynthesisUtterance("Correct!");
      utterance.lang = "en-US";
      utterance.rate = 0.75;
      utterance.onend = () => {
        setTimeout(() => {nextQuestion();}, 1000)
      };
      window.speechSynthesis.speak(utterance);
    } else if (attempts === 0) {
      setFeedback("❌ Incorrect. One more try!");
      const utterance = new SpeechSynthesisUtterance("Incorrect. One more try!");
      utterance.lang = "en-US";
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback("❌ Incorrect again.");
      const utterance = new SpeechSynthesisUtterance("Incorrect. Next question!");
      utterance.lang = "en-US";
      utterance.rate = 0.75;
      // Wait until the utterance finishes before moving on.
      utterance.onend = () => {
        setTimeout(() => {nextQuestion();}, 1000)
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextQuestion = () => {
    setUserAnswer("");
    setAttempts(0);
    setFeedback("");

    if (questionIndex >= 2) {
      setIsFinished(true);
    } else {
      setQuestionIndex((prev) => prev + 1);
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
    return <EndOfTest score={{ correct: correctCount, total: 3 }} />;
  }

  return (
    <main role="main" className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      {/* Question count */}
      <h2 id="questionCount" className="text-xl mb-4">
        {t("questionCount", { current: questionIndex + 1, total: 3 })}
      </h2>
      
      {/* Instructions */}
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>
      
      {/* Display current sentence */}
      <div className="text-lg font-semibold mb-6">
        "{currentSentence}"
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
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-96 text-black"
        placeholder={t("inputPlaceholder")}
        maxLength={300}
        aria-labelledby="instruction questionCount"
      />

      {/* Feedback message announced via role="alert" */}
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}

      {/* Submit button */}
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
