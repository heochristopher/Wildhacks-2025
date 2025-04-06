"use client";
import { useEffect, useState } from "react";
import EndOfLevel from "./EndOfLevel";

export default function AlphabetLearning() {
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
      setFeedback("❌ Incorrect. Try again!");
      setUserAnswer("");
    }
  };

  if (isLoading) {
    return <div className="p-10 font-mono">Loading questions...</div>;
  }

  if (isFinished) {
    return <EndOfLevel />;
  }

  const currentWord = questions[questionNumber - 1] || "Loading...";

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
        className="px-6 py-2 cursor-pointer bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
