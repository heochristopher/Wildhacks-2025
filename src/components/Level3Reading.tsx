"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import EndOfTest from "./EndOfTest";

interface SentencePair {
  sentence: string;
  question: string;
}

export default function Level3Reading() {
  const t = useTranslations("level3Reading");
  const [sentencePairs, setSentencePairs] = useState<SentencePair[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentencesAndQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/generateContent/3");
        const data = await res.json();
        const sentenceArray: string[] = data.content;
        const questionPairs: SentencePair[] = [];

        for (const sentence of sentenceArray) {
          const res = await fetch("http://localhost:8000/generateContent/generateQuestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sentence }),
          });
          const q = await res.json();
          questionPairs.push({ sentence, question: q.question });
        }

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

  const handleSubmit = async () => {
    if (!currentPair) return;
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
      setFeedback(t("feedbackCorrect"));
      next();
    } else if (attempts === 0) {
      setFeedback(t("feedbackIncorrectOne"));
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback(t("feedbackIncorrectTwo"));
      next();
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

  if (loading)
    return (
      <div className="p-10 font-mono">
        {t("loading")}
      </div>
    );

  if (isFinished)
    return (
      <EndOfTest score={{ correct: correctCount, total: sentencePairs.length }} />
    );

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      {/* Question count */}
      <h2 id="questionCount" className="text-xl mb-4">
        {t("questionCount", { current: questionIndex + 1, total: sentencePairs.length })}
      </h2>

      {/* Display sentence and question */}
      <p className="text-lg mb-2">{currentPair.sentence}</p>
      <p className="mb-4">{currentPair.question}</p>

      {/* Hidden label for input */}
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
            handleSubmit();
          }
        }}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-64 text-black text-center"
        placeholder={t("inputPlaceholder")}
        maxLength={100}
        aria-labelledby="questionCount"
      />

      {/* Feedback message with alert role */}
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
        aria-label={t("submitAriaLabel")}
      >
        {t("submit")}
      </button>
    </main>
  );
}
