"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { vote, removeVote, getScore, getUserVote } from "@/services/votesApi";
import confetti from "canvas-confetti";

interface VoteButtonsProps {
  storyId: string;
  initialScore?: number;
  initialUserVote?: 1 | -1 | 0;
  onScoreChange?: (score: number, userVote: 1 | -1 | 0) => void;
  size?: "sm" | "md";
  layout?: "horizontal" | "vertical";
}

export default function VoteButtons({
  storyId,
  initialScore = 0,
  initialUserVote = 0,
  onScoreChange,
  size = "md",
  layout = "horizontal",
}: VoteButtonsProps) {
  const { isAuthenticated } = useAuthStore();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  console.log(score)
  // Load initial vote state from backend when authenticated
  useEffect(() => {
    setIsHydrated(true);

    const loadInitialState = async () => {
      if (!isAuthenticated) {
        // Use props directly for non-authenticated users
        return;
      }

      try {
        // Load both user vote and score in parallel
        const [userVoteResult, scoreResult] = await Promise.all([
          getUserVote(storyId),
          getScore(storyId),
        ]);

        if (userVoteResult.success && userVoteResult.data) {
          setUserVote(userVoteResult.data.voteValue);
        }

        if (scoreResult.success && scoreResult.data) {
          setScore(scoreResult.data.score);
          onScoreChange?.(scoreResult.data.score, userVoteResult.data?.voteValue ?? 0);
        }
      } catch {
        // Silently fail - use prop values as fallback
      }
    };

    loadInitialState();
  }, [isAuthenticated, storyId, onScoreChange]);

  const triggerConfetti = () => {
    // Fire confetti from both sides
    const count = 50;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Yellow and white confetti (EDN colors)
    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#f9c937"] });
    fire(0.2, { spread: 60, colors: ["#ffffff"] });
    fire(0.35, { spread: 100, decay: 0.91, colors: ["#f9c937"] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ["#f9c937"] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ["#ffffff"] });
  };

  const handleVote = async (newVote: 1 | -1) => {
    if (!isAuthenticated || isLoading) return;

    const previousScore = score;
    const previousUserVote = userVote;
    const isFirstVote = userVote === 0;

    // Optimistic update
    let scoreDelta = 0;
    if (userVote === newVote) {
      // Toggle off (removing vote)
      scoreDelta = -newVote;
      setUserVote(0);
    } else if (userVote === 0) {
      // New vote
      scoreDelta = newVote;
      setUserVote(newVote);
    } else {
      // Changing vote
      scoreDelta = newVote * 2;
      setUserVote(newVote);
    }
    setScore((s) => s + scoreDelta);

    setIsLoading(true);

    try {
      if (userVote === newVote) {
        // Removing vote
        const result = await removeVote(storyId);
        if (!result.success) {
          // Revert optimistic update
          setScore(previousScore);
          setUserVote(previousUserVote);
        } else {
          onScoreChange?.(result.data!.score, 0);
        }
      } else {
        // Adding or changing vote
        const result = await vote(storyId, newVote);
        if (!result.success) {
          // Revert optimistic update
          setScore(previousScore);
          setUserVote(previousUserVote);
        } else {
          // Trigger confetti only for first vote (upvote)
          if (isFirstVote && newVote === 1) {
            triggerConfetti();
          }
          setScore(result.data!.score);
          setUserVote(result.data!.userVote);
          onScoreChange?.(result.data!.score, result.data!.userVote);
        }
      }
    } catch {
      // Revert on error
      setScore(previousScore);
      setUserVote(previousUserVote);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = () => handleVote(1);
  const handleDownvote = () => handleVote(-1);

  const sizeClasses = size === "sm" ? {
    container: "gap-1",
    button: "w-7 h-7 text-sm",
    score: "text-sm min-w-[2rem]",
  } : {
    container: "gap-2",
    button: "w-10 h-10 text-lg",
    score: "text-xl min-w-[3rem]",
  };

  const isVertical = layout === "vertical";

  // Don't render actual buttons until hydrated (avoids SSR mismatch)
  if (!isHydrated) {
    return (
      <div
        className={`
          flex ${isVertical ? "flex-col" : "flex-row"} items-center ${sizeClasses.container}
          opacity-50
        `}
      >
        <div className={`${sizeClasses.button} border-2 border-black rounded-lg bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`} />
        <div className={`${sizeClasses.score} font-syne font-extrabold text-center text-black/70`}>
          {initialScore}
        </div>
        <div className={`${sizeClasses.button} border-2 border-black rounded-lg bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`} />
      </div>
    );
  }

  return (
    <div
      className={`
        flex ${isVertical ? "flex-col" : "flex-row"} items-center ${sizeClasses.container}
        ${isAuthenticated ? "" : "opacity-60"}
      `}
      title={!isAuthenticated ? "Iniciá sesión para votar" : undefined}
    >
      {/* Upvote button */}
      <button
        onClick={handleUpvote}
        disabled={!isAuthenticated || isLoading}
        className={`
          ${sizeClasses.button}
          flex items-center justify-center
          border-2 border-black rounded-lg
          transition-all duration-150
          ${userVote === 1
            ? "bg-edn-neon-yellow shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-edn-neon-yellow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          }
          active:translate-y-1 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          disabled:cursor-not-allowed disabled:opacity-50
        `}
        aria-label="Upvote"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 ${userVote === 1 ? "text-black" : "text-black/60"}`}
        >
          <path d="M12 4l8 12H4z" />
        </svg>
      </button>

      {/* Score */}
      <div
        className={`
          ${sizeClasses.score}
          font-syne font-extrabold text-center
          ${userVote === 1 ? "text-black" : userVote === -1 ? "text-red-600" : "text-black/70"}
        `}
      >
        {score > 0 ? `+${score}` : score}
      </div>

      {/* Downvote button */}
      <button
        onClick={handleDownvote}
        disabled={!isAuthenticated || isLoading}
        className={`
          ${sizeClasses.button}
          flex items-center justify-center
          border-2 border-black rounded-lg
          transition-all duration-150
          ${userVote === -1
            ? "bg-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          }
          active:translate-y-1 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
          disabled:cursor-not-allowed disabled:opacity-50
        `}
        aria-label="Downvote"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 ${userVote === -1 ? "text-white" : "text-black/60"}`}
        >
          <path d="M12 20l-8-12h8z" />
        </svg>
      </button>
    </div>
  );
}