"use client";
import { useEffect, useState } from "react";
import EndOfTest from "./EndOfTest";

export default function Level3Reading() {
  const [sentences, setSentences] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        // Get difficulty from dashboard
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        const difficulty = data.progress?.level3?.reading?.difficulty ?? "easy";
        setCurrentDifficulty(difficulty);

        // Get content using difficulty
        const contentRes = await fetch(
          `http://localhost:8000/generateContent/3?difficulty=${difficulty}&language=English`
        );
        const contentData = await contentRes.json();
        setSentences(contentData.content.slice(0, 3)); // Limit to 3
      } catch (err) {
        console.error("Failed to fetch sentences", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentences();
  }, []);

  const currentSentence = sentences[questionIndex]?.trim();

  const handleAnswer = () => {
    const user = userAnswer.trim().toLowerCase();
    const expected = currentSentence?.toLowerCase();

    if (user === expected) {
      setCorrectCount((prev) => prev + 1);
      setFeedback("✅ Correct!");
      nextQuestion();
    } else if (attempts === 0) {
      setFeedback("❌ Incorrect. One more try!");
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback("❌ Incorrect again.");
      nextQuestion();
    }
  };

  const submitProgress = async (score: number) => {
    try {
      const percent = (score + 1) / sentences.length;
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          level: 3,
          score: percent.toFixed(2).toString(),
          difficulty: newDifficulty,
        }),
      });
    } catch (err) {
      console.error("Error submitting test progress:", err);
    }
  };

  const nextQuestion = () => {
    setUserAnswer("");
    setAttempts(0);
    setFeedback("");

    if (questionIndex >= sentences.length - 1) {
      setIsFinished(true);
      submitProgress(correctCount);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <div className="p-10 font-mono">Loading sentences...</div>;
  }

  if (isFinished) {
    return <EndOfTest score={{ correct: correctCount, total: sentences.length }} />;
  }

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Sentence {questionIndex + 1} of {sentences.length}</h2>
      <h3 className="mb-2">Read and type this sentence exactly:</h3>
      <div className="text-lg font-semibold mb-6">"{currentSentence}"</div>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-96 text-black"
        placeholder="Type your answer here"
      />

      {feedback && <p className="text-red-600 mb-2">{feedback}</p>}

      <button
        onClick={handleAnswer}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
