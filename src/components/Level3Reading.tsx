"use client";
import { useEffect, useState } from "react";
import EndOfTest from "./EndOfTest";

interface SentencePair {
  sentence: string;
  question: string;
}

export default function Level3Reading() {
  const [sentencePairs, setSentencePairs] = useState<SentencePair[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch sentence pairs and their associated questions on mount.
  useEffect(() => {
    const fetchSentencesAndQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/generateContent/3");
        const data = await res.json();

        const sentenceArray: string[] = data.content;
        // Fetch questions concurrently for each sentence.
        const questionPairs: SentencePair[] = await Promise.all(
          sentenceArray.map(async (sentence) => {
            const res = await fetch("http://localhost:8000/generateContent/generateQuestion", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sentence }),
            });
            const q = await res.json();
            return { sentence, question: q.question };
          })
        );

        setSentencePairs(questionPairs);
      } catch (err) {
        console.error("Error fetching sentence/question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentencesAndQuestions();
  }, []);

  const currentPair = sentencePairs[questionIndex];

  // Use Speech Synthesis to say the question, then after 1 second say the answer.
  useEffect(() => {
    if (!loading && currentPair) {
      // Cancel any ongoing speech.
      window.speechSynthesis.cancel();

      // After 1 second, speak the sentence (answer).
      const answerUtterance = new SpeechSynthesisUtterance(currentPair.sentence);
      answerUtterance.lang = "en-US";
      answerUtterance.rate = 0.75; // adjust rate as needed
      window.speechSynthesis.speak(answerUtterance);

      setTimeout(() => {
        const questionUtterance = new SpeechSynthesisUtterance(currentPair.question);
        questionUtterance.lang = "en-US";
        questionUtterance.rate = 0.75; // adjust rate as needed
        window.speechSynthesis.speak(questionUtterance);
       }, 2000)
    }
  }, [currentPair, loading]);

  const handleSubmit = async () => {
    if (!currentPair) return;

    try {
      const res = await fetch("http://localhost:8000/generateContent/checkAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: currentPair.sentence,
          question: currentPair.question,
          answer: userAnswer,
        }),
      });

      const data = await res.json();
      const verdict = data.verdict;

      if (verdict === "Correct") {
        setCorrectCount((prev) => prev + 1);
        setFeedback("✅ Correct!");
        next();
      } else if (attempts === 0) {
        setFeedback("❌ Incorrect. One more try!");
        setAttempts(1);
        setUserAnswer("");
      } else {
        setFeedback("❌ Incorrect again.");
        next();
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      setFeedback("Error checking answer.");
    }
  };

  const next = () => {
    setAttempts(0);
    setUserAnswer("");
    if (questionIndex >= sentencePairs.length - 1) {
      setIsFinished(true);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div className="p-10 font-mono">Loading reading activity...</div>;
  }

  if (isFinished) {
    return <EndOfTest score={{ correct: correctCount, total: sentencePairs.length }} />;
  }

  return (
    <div className="p-10 font-mono min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">
        Reading {questionIndex + 1} of {sentencePairs.length}
      </h2>
      <p className="text-lg mb-2">{currentPair.sentence}</p>
      <p className="mb-4">{currentPair.question}</p>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black"
        placeholder="Type your answer"
      />

      {feedback && <p className="text-red-600 mb-2">{feedback}</p>}

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
      >
        Submit Answer
      </button>
    </div>
  );
}
