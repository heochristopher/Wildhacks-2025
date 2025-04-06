"use client";
import { useEffect, useState } from "react";
import EndOfTest from "./EndOfTest";

export default function Level2Learning() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0); // 0 or 1

  // Fetch questions on mount
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

  // Compute current word
  const currentWord = questions[questionNumber - 1] || "Loading...";

  // When currentWord changes, speak it using the Speech Synthesis API
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.lang = "en-US"; // Adjust the language if needed
      window.speechSynthesis.speak(utterance);
    }
  }, [currentWord, isLoading, questions]);

  const handleAnswer = () => {
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const expectedAnswer = currentWord.trim().toLowerCase();

    if (trimmedAnswer === expectedAnswer) {
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
    if (questionNumber >= 10) {
      setIsFinished(true);
    } else {
      setQuestionNumber((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <div className="p-10 font-mono">Loading questions...</div>;
  }

  if (isFinished) {
    return <EndOfTest score={{ correct: correctCount, total: 10 }} />;
  }

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Question {questionNumber} of 10</h2>
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
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
