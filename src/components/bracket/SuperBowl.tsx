"use client";

import { Trophy } from "lucide-react";
import { useBracket } from "@/contexts/BracketContext";
import type { SeededTeam } from "@/types";
import { TeamCard } from "./TeamCard";

export function SuperBowl() {
  const { bracket, selectWinner } = useBracket();
  const { superBowl } = bracket;

  if (!superBowl) return null;

  const { homeTeam, awayTeam, winner } = superBowl;
  const canSelect = homeTeam !== null && awayTeam !== null;

  const handleSelect = (team: SeededTeam) => {
    if (canSelect) {
      selectWinner(superBowl.id, team);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Super Bowl Header */}
      <div className="flex flex-col items-center gap-2">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div className="rounded-lg bg-gradient-to-r from-red-700 via-purple-700 to-blue-700 px-6 py-2 text-center font-bold text-white shadow-lg">
          Super Bowl LX
        </div>
      </div>

      {/* Matchup */}
      <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-yellow-500/30 bg-gray-800/50 p-6">
        {/* AFC Champion */}
        <div className="w-48">
          <div className="mb-1 text-center text-xs font-semibold uppercase text-red-400">
            AFC Champion
          </div>
          <TeamCard
            team={homeTeam}
            isWinner={winner?.id === homeTeam?.id}
            isLoser={winner !== null && winner?.id !== homeTeam?.id}
            onClick={() => homeTeam && handleSelect(homeTeam)}
            disabled={!canSelect}
            size="lg"
          />
        </div>

        <div className="text-2xl font-bold text-gray-500">VS</div>

        {/* NFC Champion */}
        <div className="w-48">
          <div className="mb-1 text-center text-xs font-semibold uppercase text-blue-400">
            NFC Champion
          </div>
          <TeamCard
            team={awayTeam}
            isWinner={winner?.id === awayTeam?.id}
            isLoser={winner !== null && winner?.id !== awayTeam?.id}
            onClick={() => awayTeam && handleSelect(awayTeam)}
            disabled={!canSelect}
            size="lg"
          />
        </div>

        {/* Champion Display */}
        {winner && (
          <div className="mt-4 flex flex-col items-center gap-2 rounded-lg bg-yellow-500/20 px-6 py-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <div className="text-center">
              <div className="text-sm font-semibold uppercase text-yellow-500">
                Super Bowl Champion
              </div>
              <div className="text-xl font-bold text-white">
                {winner.city} {winner.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
