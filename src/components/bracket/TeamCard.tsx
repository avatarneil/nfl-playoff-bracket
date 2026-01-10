"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { SeededTeam } from "@/types";

interface TeamCardProps {
  team: SeededTeam | null;
  isWinner?: boolean;
  isLoser?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TeamCard({
  team,
  isWinner = false,
  isLoser = false,
  onClick,
  disabled = false,
  size = "md",
}: TeamCardProps) {
  if (!team) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50",
          size === "sm" && "h-10 px-2",
          size === "md" && "h-12 px-3",
          size === "lg" && "h-14 px-4",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded bg-gray-700",
            size === "sm" && "h-6 w-6",
            size === "md" && "h-8 w-8",
            size === "lg" && "h-10 w-10",
          )}
        >
          <span className="text-xs text-gray-500">?</span>
        </div>
        <span className="text-sm text-gray-500">TBD</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border-2 transition-all duration-200",
        size === "sm" && "h-10 px-2",
        size === "md" && "h-12 px-3",
        size === "lg" && "h-14 px-4",
        // Winner state
        isWinner &&
          "border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/20",
        // Loser state
        isLoser && "border-gray-600 bg-gray-800/50 opacity-50",
        // Neutral state (clickable)
        !isWinner &&
          !isLoser &&
          !disabled &&
          "cursor-pointer border-gray-600 bg-gray-800 hover:border-gray-400 hover:bg-gray-700",
        // Disabled state
        disabled &&
          !isLoser &&
          "cursor-not-allowed border-gray-700 bg-gray-800/50 opacity-70",
      )}
      style={{
        borderLeftColor: isWinner ? "#EAB308" : team.primaryColor,
        borderLeftWidth: "6px",
        boxShadow: isWinner
          ? "inset 4px 0 8px -2px rgba(234, 179, 8, 0.4)"
          : `inset 4px 0 8px -2px ${team.primaryColor}40`,
      }}
    >
      {/* Team Logo */}
      <div
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded bg-white",
          size === "sm" && "h-6 w-6",
          size === "md" && "h-8 w-8",
          size === "lg" && "h-10 w-10",
        )}
      >
        <Image
          src={team.logoUrl}
          alt={`${team.city} ${team.name} logo`}
          fill
          className="object-contain p-0.5"
          sizes={size === "lg" ? "40px" : size === "md" ? "32px" : "24px"}
        />
      </div>

      {/* Seed Badge */}
      <div
        className={cn(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
          size === "lg" && "h-6 w-6 text-sm",
        )}
        style={{ backgroundColor: team.primaryColor }}
      >
        {team.seed}
      </div>

      {/* Team Info */}
      <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden">
        <span
          className={cn(
            "truncate font-semibold text-white",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          {team.city}
        </span>
        <span
          className={cn(
            "truncate text-gray-400",
            size === "sm" && "text-xs",
            size === "md" && "text-xs",
            size === "lg" && "text-sm",
          )}
        >
          {team.name}
        </span>
      </div>

      {/* Winner Checkmark */}
      {isWinner && (
        <svg
          className="ml-auto h-5 w-5 flex-shrink-0 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-label="Winner"
          role="img"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
