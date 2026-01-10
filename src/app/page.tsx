"use client";

import { useEffect, useRef, useState } from "react";
import { BracketControls } from "@/components/BracketControls";
import { Bracket } from "@/components/bracket/Bracket";
import { WelcomeDialog } from "@/components/dialogs/WelcomeDialog";
import { BracketProvider, useBracket } from "@/contexts/BracketContext";
import { getStoredUser } from "@/lib/storage";

function BracketApp() {
  useBracket(); // Access context to ensure it's available
  const [showWelcome, setShowWelcome] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const bracketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
    const user = getStoredUser();
    if (!user || !user.name) {
      setShowWelcome(true);
    }
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            NFL Playoff Bracket
          </h1>
          <p className="mt-2 text-lg text-gray-400">2025-26 Season</p>
        </header>

        {/* Controls */}
        <div className="mb-6">
          <BracketControls bracketRef={bracketRef} />
        </div>

        {/* Bracket */}
        <div className="overflow-x-auto pb-8">
          <div className="min-w-fit">
            <Bracket ref={bracketRef} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Click on a team to select them as the winner of each matchup.</p>
          <p>Your progress is automatically saved.</p>
        </div>
      </div>

      {/* Welcome Dialog */}
      <WelcomeDialog
        open={showWelcome}
        onComplete={() => setShowWelcome(false)}
      />
    </main>
  );
}

export default function Home() {
  return (
    <BracketProvider>
      <BracketApp />
    </BracketProvider>
  );
}
