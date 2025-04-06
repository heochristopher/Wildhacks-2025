"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import EndOfLevel from "./EndOfLevel";

export default function Level2Learning() {
  const t = useTranslations("level2Learning");
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionNumber, setQuestionNumber] = useState<number | null>(null); // index-based
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // Load progress & questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();

        const progressData = data.progress?.level2?.learning ?? {};
        const difficulty = data.progress?.level2?.test.difficulty ?? "easy";
        const lastCompleted = progressData.lastCompleted ?? 0;

        setCurrentDifficulty(difficulty);
        setQuestionNumber(lastCompleted); // will be the index of the next question

        const contentRes = await fetch(
          `http://localhost:8000/generateContent/2?difficulty=${difficulty}&language=English`
        );
        const contentData = await contentRes.json();
        setQuestions(contentData.content.slice(0, 10)); // limit to 10 words
      } catch (err) {
        console.error("Error loading dashboard or content", err);
        setQuestionNumber(0); // fallback
      } finally {
        setIsLoading(false);
      }
      // Once questions are loaded, speak the current word.
      if (!isLoading && questions.length > 0) {
        const currentWord = questions[questionNumber];
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


    fetchData();
  }, []);

  // Submit progress to FastAPI
  const submitProgress = async (index: number) => {
    try {
      await fetch("http://localhost:8000/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          level: 2,
          score: "-1",
          lastCompleted: index,
          questions: questions.slice(index)
        }),
      });
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  // Save on unload
  useEffect(() => {
    if (questionNumber === null) return;

    const handleUnload = () => {
      submitProgress(questionNumber);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      submitProgress(questionNumber);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [questionNumber]);

  const handleAnswer = () => {
    const currentWord = questions[questionNumber!]?.trim().toLowerCase();
    const answer = userAnswer.trim().toLowerCase();

    if (answer === currentWord) {
      setFeedback("");
      setUserAnswer("");

      const nextIndex = questionNumber! + 1;

      if (nextIndex >= questions.length) {
        submitProgress(nextIndex);
        setIsFinished(true);
      } else {
        setQuestionNumber(nextIndex);
      }
    } else {
      setFeedback(t("feedbackIncorrect"));
      setUserAnswer("");
    }
  };

  if (isLoading || questionNumber === null || !questions.length) {
    return (
      <div className="p-10 font-mono">
        {t("loading")}
      </div>
    );
  }

  if (isFinished) return <EndOfLevel />;

  const currentWord = questions[questionNumber] || t("loadingFallback");
  console.log(questionNumber);
  console.log(currentWord);

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      {/* Question count */}
      <h2 id="questionCount" className="text-xl mb-4">
        {t("questionCount", { current: questionNumber + 1, total: 10 })}
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
