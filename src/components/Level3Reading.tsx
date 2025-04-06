"use client";
import { useEffect, useState, useRef } from "react";
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

  // Ref for the input to auto-focus when a new question loads.
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch progress & sentence/question pairs on mount.
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
          `http://localhost:8000/generateContent/3?difficulty=${difficulty}&language=${t("language")}`
        );
        const contentData = await contentRes.json();

        const sentenceArray: string[] = contentData.content;
        const questionPairs: SentencePair[] = [];

        // Fetch questions concurrently for each sentence.
        await Promise.all(
          sentenceArray.map(async (sentence) => {
            const res = await fetch(`http://localhost:8000/generateContent/generateQuestion?language=${t("language")}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sentence }),
            });
            const q = await res.json();
            questionPairs.push({ sentence, question: q.question });
          })
        );

        setSentencePairs(questionPairs);
      } catch (err) {
        console.error(t("errorFetch"), err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const currentPair = sentencePairs[questionIndex];

  // Auto-focus the input when the question index changes.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionIndex]);

  // Optionally, you could also speak the current sentence whenever it changes.
  // useEffect(() => {
  //   if (!loading && currentPair) {
  //     window.speechSynthesis.cancel();
  //     const utterance = new SpeechSynthesisUtterance(currentPair.question);
  //     utterance.lang = t("lang");
  //     utterance.rate = Number(t("rate"));
  //     window.speechSynthesis.speak(utterance);
  //   }
  // }, [currentPair, loading, t]);

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
    if (questionIndex >= sentencePairs.length ) {
      setIsFinished(true);
      submitProgress(correctCount+1);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const submitProgress = async (score: number) => {
    try {
      let percent = (score) / sentencePairs.length;
      let newDifficulty = currentDifficulty;
      if (correctCount === 0) {
        percent = 0;
      }
      console.log(score, percent)
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
          isReading: true

        }),
      });
    } catch (err) {
      console.error("Error submitting reading progress:", err);
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

      {/* Instructions */}
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>

      {/* Display current sentence and question */}
      <p className="text-lg mb-2">{currentPair.sentence}</p>
      <p tabIndex={0} className="mb-4">{currentPair.question}</p>

      {/* Hidden label for input */}
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
            handleSubmit();
          }
        }}
        onFocus={() => {
          // When input is focused, speak the current sentence aloud.
          if (currentPair && currentPair.question) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(currentPair.question);
            utterance.lang = t("lang");
            utterance.rate = Number(t("rate"));
            window.speechSynthesis.speak(utterance);
          }
        }}
        className="border border-gray-400 px-4 py-2 mb-4 rounded w-96 text-black"
        placeholder={t("inputPlaceholder")}
        maxLength={300}
        aria-labelledby="instruction questionCount"
      />

      {/* Feedback message announced via role="alert" */}
      {feedback && (
        <p role="alert" aria-live="assertive" className="text-red-600 mb-2">
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
