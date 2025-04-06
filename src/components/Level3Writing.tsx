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

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const res = await fetch("http://localhost:8000/generateContent/3?difficulty=easy&language=English");
        const data = await res.json();
        setSentences(data.content);
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
    return <div className="p-10 font-mono">Loading sentences...</div>;
  }

  if (isFinished) {
    return <EndOfTest score={{ correct: correctCount, total: 3 }} />;
  }

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Sentence {questionIndex + 1} of 3</h2>
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
