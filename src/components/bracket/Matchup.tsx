"use client";

import { cn } from "@/lib/utils";
import type { Matchup as MatchupType, SeededTeam } from "@/types";
import { TeamCard } from "./TeamCard";

interface MatchupProps {
  matchup: MatchupType;
  onSelectWinner: (matchupId: string, winner: SeededTeam) => void;
  size?: "sm" | "md" | "lg";
  showConnector?: boolean;
  connectorSide?: "left" | "right";
}

export function Matchup({
  matchup,
  onSelectWinner,
  size = "md",
  showConnector = false,
  connectorSide = "right",
}: MatchupProps) {
  const { homeTeam, awayTeam, winner } = matchup;
  const canSelect = homeTeam !== null && awayTeam !== null;

  const handleSelect = (team: SeededTeam) => {
    if (canSelect) {
      onSelectWinner(matchup.id, team);
    }
  };

  return (
    <div
      className={cn("relative flex flex-col gap-1", size === "lg" && "gap-2")}
    >
      <TeamCard
        team={homeTeam}
        isWinner={winner?.id === homeTeam?.id}
        isLoser={winner !== null && winner?.id !== homeTeam?.id}
        onClick={() => homeTeam && handleSelect(homeTeam)}
        disabled={!canSelect}
        size={size}
      />
      <TeamCard
        team={awayTeam}
        isWinner={winner?.id === awayTeam?.id}
        isLoser={winner !== null && winner?.id !== awayTeam?.id}
        onClick={() => awayTeam && handleSelect(awayTeam)}
        disabled={!canSelect}
        size={size}
      />
      {/* Connector line to next round */}
      {showConnector && (
        <div
          className={cn(
            "absolute top-1/2 h-0.5 w-4 bg-gray-600",
            connectorSide === "right" ? "-right-4" : "-left-4",
          )}
        />
      )}
    </div>
  );
}
