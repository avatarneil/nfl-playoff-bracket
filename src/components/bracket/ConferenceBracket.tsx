"use client";

import { useBracket } from "@/contexts/BracketContext";
import { cn } from "@/lib/utils";
import type { Conference } from "@/types";
import { Matchup } from "./Matchup";

interface ConferenceBracketProps {
  conference: Conference;
}

export function ConferenceBracket({ conference }: ConferenceBracketProps) {
  const { bracket, selectWinner, clearWinner } = useBracket();
  const confState = conference === "AFC" ? bracket.afc : bracket.nfc;
  const isAFC = conference === "AFC";

  return (
    <div className="flex flex-col gap-2">
      {/* Conference Header */}
      <div
        className={cn(
          "rounded-lg px-4 py-2 text-center font-bold text-white",
          // On mobile: always left-aligned
          // On desktop: AFC right-aligned, NFC left-aligned (toward center)
          "self-start lg:self-auto",
          isAFC ? "lg:self-end" : "lg:self-start",
          isAFC ? "bg-red-700" : "bg-blue-700",
        )}
      >
        {conference}
      </div>

      {/* Bracket Rounds
          Mobile: Always left-to-right (flex-row)
          Desktop: AFC right-to-left (flex-row-reverse), NFC left-to-right (flex-row)
          This creates the traditional bracket where both sides meet at the Super Bowl
      */}
      <div
        className={cn(
          "flex items-center gap-4 md:gap-6",
          // Mobile: always left to right
          "flex-row",
          // Desktop: AFC reverses to flow toward center, NFC stays left-to-right
          isAFC ? "lg:flex-row-reverse" : "lg:flex-row",
        )}
      >
        {/* Wild Card Round */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="text-center text-xs font-semibold uppercase text-gray-400">
            Wild Card
          </div>
          {confState.wildCard.map((matchup) => (
            <Matchup
              key={matchup.id}
              matchup={matchup}
              onSelectWinner={selectWinner}
              onClearWinner={clearWinner}
              size="sm"
            />
          ))}
        </div>

        {/* Divisional Round */}
        <div className="flex flex-col gap-8 md:gap-16">
          <div className="text-center text-xs font-semibold uppercase text-gray-400">
            Divisional
          </div>
          {confState.divisional.map((matchup) => (
            <Matchup
              key={matchup.id}
              matchup={matchup}
              onSelectWinner={selectWinner}
              onClearWinner={clearWinner}
              size="sm"
            />
          ))}
        </div>

        {/* Conference Championship */}
        <div className="flex flex-col">
          <div className="text-center text-xs font-semibold uppercase text-gray-400">
            {conference} Champ
          </div>
          {confState.championship && (
            <Matchup
              matchup={confState.championship}
              onSelectWinner={selectWinner}
              onClearWinner={clearWinner}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
