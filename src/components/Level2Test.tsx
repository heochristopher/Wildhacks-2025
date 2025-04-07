"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import EndOfTest from "./EndOfTest";

export default function Level2Test() {
  const t = useTranslations("level2Test");
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0); // 0 or 1
  const [isComposing, setIsComposing] = useState(false);
  // Create a ref for the input to auto-focus it.
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref to hold the WebSocket connection.
  const wsRef = useRef<WebSocket | null>(null);

  const currentWord =
    questions[questionNumber - 1] || t("loadingFallback");

  // Fetch progress and content on mount.
  useEffect(() => {
    const fetchProgressAndContent = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        const levelData = data.progress?.level2?.test;
        const difficulty = levelData?.difficulty ?? "easy";
        setCurrentDifficulty(difficulty);

        const contentRes = await fetch(
          `http://localhost:8000/generateContent/2?difficulty=${difficulty}&language=${t("language")}`
        );
        const contentData = await contentRes.json();
        setQuestions(contentData.content.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch progress/content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressAndContent();
  }, [t]);

  // Auto-focus the input field when the question number changes.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionNumber]);

  // Setup WebSocket connection on mount.
  useEffect(() => {
    // Adjust the URL as needed.
    const ws = new WebSocket("ws://localhost:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established for LCD display.");
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed.");
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, []);

  // Whenever the current word changes, send it to the backend via WebSocket.
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && currentWord) {
      const message = JSON.stringify({
        type: "lcd",
        payload: currentWord,
      });
      wsRef.current.send(message);
      console.log("Sent word to LCD:", currentWord);
    }
  }, [currentWord]);

  const handleAnswer = () => {
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const isLatin = /^[A-Za-z]$/.test(currentWord);
    const expectedAnswer = isLatin
      ? currentWord.toUpperCase().normalize("NFC")
      : currentWord.normalize("NFD");
    const actualInput = isLatin
      ? trimmedAnswer.toUpperCase().normalize("NFC")
      : trimmedAnswer.normalize("NFD");

    console.log("User answer:", actualInput, "Expected:", expectedAnswer);

    if (actualInput === expectedAnswer) {
      setCorrectCount((prev) => prev + 1);
      setFeedback(t("feedbackCorrect"));
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else if (attempts === 0) {
      setFeedback(t("feedbackIncorrectOne"));
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback(t("feedbackIncorrectTwo"));
      if (questionNumber >= 10) {
        setIsFinished(true);
        submitProgress(correctCount); // no +1 because it was incorrect
      } else {
        nextQuestion();
      }
      setTimeout(() => {  
        nextQuestion();
      }, 1000);
    }
  };

  const nextQuestion = () => {
    setFeedback("");
    setUserAnswer("");
    setAttempts(0);
    if (questionNumber >= 10) {
      setIsFinished(true);
      submitProgress(correctCount + 1);
    } else {
      setQuestionNumber((prev) => prev + 1);
    }
  };

  const submitProgress = async (score: number) => {
    try {
      let percent = score / 10;
      let newDifficulty = currentDifficulty;
      if (correctCount === 0) {
        percent = 0;
      }
      if (percent < 0.5) {
        if (currentDifficulty === "medium") newDifficulty = "easy";
        else if (currentDifficulty === "hard") newDifficulty = "medium";
      } else if (percent > 0.8) {
        if (currentDifficulty === "easy") newDifficulty = "medium";
        else if (currentDifficulty === "medium") newDifficulty = "hard";
      }

      await fetch("http://localhost:8000/submitTest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          level: 2,
          score: percent.toFixed(2),
          difficulty: newDifficulty,
          isReading: false,
        }),
      });
    } catch (err) {
      console.error("Error submitting progress:", err);
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

      {/* Display current word with live region */}
      <div tabIndex={0} className="text-2xl mb-6 font-semibold" aria-live="polite">
        {currentWord}
      </div>

      {/* Hidden label for input */}
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
        ref={inputRef}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black text-center"
        placeholder={t("inputPlaceholder")}
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
