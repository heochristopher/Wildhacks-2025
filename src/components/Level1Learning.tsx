"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import EndOfLevel from "./EndOfLevel";

export default function Level1Learning() {
  const t = useTranslations("level1Learning");

  // Get the letters from translations (could be Hangul or English)
  const alphabet = t("letters").split("");
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const currentLetter =
    questionIndex !== null ? alphabet[questionIndex] : undefined;

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard", {
          credentials: "include",
        });
        const data = await res.json();
        const userProgress = data.progress?.level1?.learning?.lastCompleted ?? 0;
        if (userProgress < 0 || userProgress >= alphabet.length - 1) {
          setQuestionIndex(0); // fallback
          return;
        }
        setQuestionIndex(userProgress);
      } catch (err) {
        console.error("Failed to load user progress:", err);
        setQuestionIndex(0); // fallback
      }
    };

    fetchProgress();
  }, [alphabet.length]);

  const submitProgress = async (index: number) => {
    try {
      await fetch("http://localhost:8000/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          level: 1,
          score: "-1",
          lastCompleted: index,
        }),
      });
    } catch (err) {
      console.error("Error updating score:", err);
    }
  };

  // Only submit on page unload
  useEffect(() => {
    if (questionIndex === null) return;

    const handleBeforeUnload = () => {
      submitProgress(questionIndex);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [questionIndex]);

  // Speak the current letter
  useEffect(() => {
    window.speechSynthesis.cancel();
    if (currentLetter) {
      const utterance = new SpeechSynthesisUtterance(currentLetter);
      utterance.lang = "en-US";
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentLetter]);

  // Handle Arduino keyboard input from the WebSocket
  const handleArduinoInput = useCallback(
    (input: string) => {
      if (questionIndex === null || !currentLetter) return;

      // Normalize for Latin letters
      const isLatin = /^[A-Za-z]$/.test(currentLetter);
      const expectedLetter = isLatin ? currentLetter.toUpperCase() : currentLetter;
      const actualInput = isLatin ? input.toUpperCase() : input;

      if (actualInput === expectedLetter) {
        setFeedback("");
        if (questionIndex === alphabet.length - 1) {
          submitProgress(questionIndex);
          setIsFinished(true);
        } else {
          setQuestionIndex((prev) => (prev !== null ? prev + 1 : 0));
        }
      } else {
        setFeedback(t("feedbackIncorrect"));
      }
    },
    [alphabet.length, currentLetter, questionIndex, t]
  );

  // Set up the WebSocket connection to receive Arduino input
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      console.log("WebSocket connection established for Arduino input.");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Expect messages with type "keyboard" and payload as a character
        if (data.type === "keyboard" && typeof data.payload === "string") {
          handleArduinoInput(data.payload);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket connection closed.");

    return () => {
      ws.close();
    };
  }, [handleArduinoInput]);

  if (questionIndex === null) {
    return <div className="p-10 font-mono">Loading your progress...</div>;
  }

  if (isFinished) return <EndOfLevel />;

  return (
    <main
      role="main"
      className="p-10 font-mono min-h-screen flex flex-col items-center justify-center"
    >
      <h2 id="letterCount" className="text-xl mb-4">
        {t("letterCount", { current: questionIndex + 1, total: alphabet.length })}
      </h2>
      <h3 id="instruction" className="mb-2">
        {t("instruction")}
      </h3>
      <div tabIndex={0} className="text-4xl font-bold mb-6" aria-live="polite">
        {currentLetter}
      </div>
      {feedback && (
        <p role="alert" className="text-red-600 mb-2">
          {feedback}
        </p>
      )}
    </main>
  );
}
