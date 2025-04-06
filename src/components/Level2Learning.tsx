"use client";
import { useEffect, useState, useRef } from "react";
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
  
  // Create a ref for the input to auto-focus it.
  const inputRef = useRef<HTMLInputElement>(null);

  // Load progress & questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();

        const progressData = data.progress?.level2?.learning ?? {};
        const difficulty = data.progress?.level2?.test?.difficulty ?? "easy";
        const lastCompleted = progressData.lastCompleted ?? 0;
        console.log("lastCompleted", lastCompleted);
        setCurrentDifficulty(difficulty);
        if (lastCompleted >= 9){
          console.log("lastCompleted", lastCompleted);
          setQuestionNumber(0); // fallback
        } else {
          setQuestionNumber(lastCompleted); // will be the index of the next question

        }

        const contentRes = await fetch(
          `http://localhost:8000/generateContent/2?difficulty=${difficulty}&language=${t("language")}`
        );
        const contentData = await contentRes.json();
        setQuestions(contentData.content.slice(0, 10)); // limit to 10 words
      } catch (err) {
        console.error("Error loading dashboard or content", err);
        setQuestionNumber(0); // fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [t]);

  // Auto-focus the input field whenever a new question is loaded.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionNumber]);

  // When questions are loaded, speak the current word.
  useEffect(() => {
    if (!isLoading && questions.length > 0 && questionNumber !== null) {
      const currentWord = questions[questionNumber];
      if (currentWord) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = "en-US";
        utterance.rate = 0.75;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isLoading, questions, questionNumber]);

  // Save progress on unload.
  // useEffect(() => {
  //   if (questionNumber === null) return;

  //   const handleUnload = () => {
  //     submitProgress(questionNumber);
  //   };

  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => {
  //     submitProgress(questionNumber);
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, [questionNumber]);

  const submitProgress = async (index: number) => {
    try {
      console.log(index)
      await fetch("http://localhost:8000/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          level: 2,
          score: "-1",
          lastCompleted: index-1,
          questions: questions.slice(index),
        }),
      });
      setQuestionNumber(0);
    } catch (err) {
      console.error("Failed to update progress:", err);
    }
  };

  const handleAnswer = () => {
    const currentWord = questions[questionNumber!]?.trim().toLowerCase();
    const answer = userAnswer.trim().toLowerCase();

    if (answer === currentWord) {
      setFeedback("");
      setUserAnswer("");

      const nextIndex = questionNumber! + 1;
      if (nextIndex >= questions.length) {
        submitProgress(nextIndex);
        console.log(nextIndex);
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

      {/* Hidden label for screen readers */}
      <label htmlFor="userAnswer" className="sr-only">
        {t("inputLabel")}
      </label>
      <input
        id="userAnswer"
        ref={inputRef}
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAnswer();
          }
        }}
        onFocus={() => {
          // When input is focused, speak the current word aloud.
          if (currentWord) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(currentWord);
            utterance.lang = "en-US";
            utterance.rate = 0.75;
            window.speechSynthesis.speak(utterance);
          }
        }}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black text-center"
        placeholder={t("inputPlaceholder")}
        maxLength={50}
        aria-labelledby="instruction questionCount"
      />

      {/* Feedback message */}
      {feedback && (
        <p role="alert" aria-live="assertive" className="text-red-600 mb-2">
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
