"use client";
import { useEffect, useState } from "react";
import EndOfLevel from "./EndOfLevel";

export default function AlphabetLearning() {
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
    };

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
      setFeedback("❌ Incorrect. Try again!");
      setUserAnswer("");
    }
  };

  if (isLoading || questionNumber === null || !questions.length) {
    return <div className="p-10 font-mono">Loading questions...</div>;
  }

  if (isFinished) return <EndOfLevel />;

  const currentWord = questions[questionNumber] || "Loading...";

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Question {questionNumber + 1} of {questions.length}</h2>
      <h3 className="mb-2">Please read and then spell this word:</h3>
      <div className="text-2xl mb-6 font-semibold">{currentWord}</div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black"
        placeholder="Type your answer here"
      />

      {feedback && <p className="text-red-600 mb-2">{feedback}</p>}

      <button
        onClick={handleAnswer}
        className="px-6 py-2 cursor-pointer bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
