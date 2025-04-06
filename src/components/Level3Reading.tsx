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
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");

  // Fetch sentence pairs and their associated questions on mount.
  // Fetch progress & sentences/questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        const levelData = data.progress?.level3?.reading;
        const difficulty = levelData?.difficulty ?? "easy";
        setCurrentDifficulty(difficulty);

        const contentRes = await fetch(
          `http://localhost:8000/generateContent/3?difficulty=${difficulty}&language=English`
        );
        const contentData = await contentRes.json();

        const sentenceArray: string[] = contentData.content;
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
        console.error(t("errorFetch"), err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const submitProgress = async (score: number) => {
    try {
      const percent = (score + 1) / sentencePairs.length;
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
      console.error("Error submitting reading progress:", err);
    }
  };

  // Use Speech Synthesis to speak the current sentence and question.
  // useEffect(() => {
  //   if (!loading && currentPair) {
  //     window.speechSynthesis.cancel();
  //     // Speak the sentence (the answer) first.
  //     const sentenceUtterance = new SpeechSynthesisUtterance(currentPair.sentence);
  //     sentenceUtterance.lang = "en-US";
  //     sentenceUtterance.rate = 0.75;
  //     window.speechSynthesis.speak(sentenceUtterance);
  //     // Then speak the question after 2 seconds.
  //     setTimeout(() => {
  //       const questionUtterance = new SpeechSynthesisUtterance(currentPair.question);
  //       questionUtterance.lang = "en-US";
  //       questionUtterance.rate = 0.75;
  //       window.speechSynthesis.speak(questionUtterance);
  //     }, 2000);
  //   }
  // }, [currentPair, loading]);

  const handleSubmit = async () => {
    const currentPair = sentencePairs[questionIndex];
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
      nextQuestion();
    } else if (attempts === 0) {
      setFeedback(t("feedbackIncorrectOne"));
      setAttempts(1);
      setUserAnswer("");
    } else {
      setFeedback(t("feedbackIncorrectTwo"));
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    setAttempts(0);
    setUserAnswer("");
    setFeedback("");
    if (questionIndex >= sentencePairs.length - 1) {
      setIsFinished(true);
      submitProgress(correctCount);
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

  const currentPair = sentencePairs[questionIndex];

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

      {/* Feedback message announced via role="alert" */}
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
