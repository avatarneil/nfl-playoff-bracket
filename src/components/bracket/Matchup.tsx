"use client";

import { Lock } from "lucide-react";
import { useBracket } from "@/contexts/BracketContext";
import { cn } from "@/lib/utils";
import type { Matchup as MatchupType, SeededTeam } from "@/types";
import { TeamCard } from "./TeamCard";

type Size = "sm" | "md" | "lg";

interface MatchupProps {
  matchup: MatchupType;
  onSelectWinner: (matchupId: string, winner: SeededTeam) => void;
  onClearWinner?: (matchupId: string) => void;
  size?: Size;
  /** Size on mobile (< lg breakpoint). Takes precedence over size on mobile. */
  mobileSize?: Size;
  /** Size on desktop (>= lg breakpoint). Takes precedence over size on desktop. */
  desktopSize?: Size;
  showConnector?: boolean;
  connectorSide?: "left" | "right";
}

export function Matchup({
  matchup,
  onSelectWinner,
  onClearWinner,
  size = "md",
  mobileSize,
  desktopSize,
  showConnector = false,
  connectorSide = "right",
}: MatchupProps) {
  const { isMatchupLocked, getLiveResultForMatchup } = useBracket();
  const { homeTeam, awayTeam, winner } = matchup;
  const isLocked = isMatchupLocked(matchup.id);
  const liveResult = getLiveResultForMatchup(matchup.id);
  const canSelect = homeTeam !== null && awayTeam !== null && !isLocked;

  const handleSelect = (team: SeededTeam) => {
    if (!canSelect) return;

    // If clicking on the current winner, clear the selection
    if (winner?.id === team.id && onClearWinner) {
      onClearWinner(matchup.id);
    } else {
      onSelectWinner(matchup.id, team);
    }
  };

  // Use responsive sizing if mobileSize/desktopSize are provided
  const effectiveSize = size;
  const effectiveMobileSize = mobileSize || size;
  const effectiveDesktopSize = desktopSize || size;

  // Get scores for locked games
  const homeScore = liveResult?.homeTeamId === homeTeam?.id 
    ? liveResult?.homeScore 
    : liveResult?.awayScore;
  const awayScore = liveResult?.awayTeamId === awayTeam?.id 
    ? liveResult?.awayScore 
    : liveResult?.homeScore;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-1",
        (effectiveMobileSize === "lg" || effectiveDesktopSize === "lg") &&
          "lg:gap-2",
      )}
    >
      {/* Lock indicator for locked matchups */}
      {isLocked && liveResult?.isComplete && (
        <div className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 shadow-md">
          <Lock className="h-3 w-3 text-white" />
        </div>
      )}

      {/* In-progress indicator */}
      {liveResult?.isInProgress && (
        <div className="absolute -right-1 -top-1 z-10">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500" />
          </span>
        </div>
      )}

      <div className="relative">
        <TeamCard
          team={homeTeam}
          isWinner={winner?.id === homeTeam?.id}
          isLoser={winner !== null && winner?.id !== homeTeam?.id}
          onClick={() => homeTeam && handleSelect(homeTeam)}
          disabled={!canSelect}
          size={effectiveSize}
          mobileSize={effectiveMobileSize}
          desktopSize={effectiveDesktopSize}
          isLocked={isLocked}
        />
        {/* Score display for locked complete games */}
        {isLocked && liveResult?.isComplete && homeScore !== null && homeScore !== undefined && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span className={cn(
              "font-mono text-lg font-bold",
              winner?.id === homeTeam?.id ? "text-green-400" : "text-gray-400"
            )}>
              {homeScore}
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <TeamCard
          team={awayTeam}
          isWinner={winner?.id === awayTeam?.id}
          isLoser={winner !== null && winner?.id !== awayTeam?.id}
          onClick={() => awayTeam && handleSelect(awayTeam)}
          disabled={!canSelect}
          size={effectiveSize}
          mobileSize={effectiveMobileSize}
          desktopSize={effectiveDesktopSize}
          isLocked={isLocked}
        />
        {/* Score display for locked complete games */}
        {isLocked && liveResult?.isComplete && awayScore !== null && awayScore !== undefined && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span className={cn(
              "font-mono text-lg font-bold",
              winner?.id === awayTeam?.id ? "text-green-400" : "text-gray-400"
            )}>
              {awayScore}
            </span>
          </div>
        )}
      </div>

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
