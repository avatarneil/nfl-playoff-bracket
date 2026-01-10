"use client";

import { forwardRef } from "react";
import { useBracket } from "@/contexts/BracketContext";
import { ConferenceBracket } from "./ConferenceBracket";
import { SuperBowl } from "./SuperBowl";

interface BracketProps {
  showUserName?: boolean;
}

export const Bracket = forwardRef<HTMLDivElement, BracketProps>(
  function Bracket({ showUserName = true }, ref) {
    const { bracket } = useBracket();

    return (
      <div
        ref={ref}
        className="flex flex-col items-center gap-6 rounded-2xl bg-black p-4 md:p-6"
      >
        {/* Header */}
        {showUserName && bracket.userName && (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-400">
              {bracket.userName}&apos;s Bracket
            </h2>
            <h3 className="text-sm text-gray-500">{bracket.name}</h3>
          </div>
        )}

        {/* Main Bracket Layout
            Mobile: Vertical stack (AFC, NFC, Super Bowl) - each bracket scrolls horizontally left-to-right
            Desktop: Horizontal (AFC | Super Bowl | NFC) - traditional bracket layout meeting in middle
        */}
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-4 xl:gap-8">
          {/* AFC Bracket */}
          <div className="w-full overflow-x-auto lg:w-auto lg:overflow-visible">
            <ConferenceBracket conference="AFC" />
          </div>

          {/* Super Bowl - Between conferences on desktop, after both on mobile */}
          <div className="order-last flex justify-center lg:order-none lg:self-center">
            <SuperBowl />
          </div>

          {/* NFC Bracket */}
          <div className="w-full overflow-x-auto lg:w-auto lg:overflow-visible">
            <ConferenceBracket conference="NFC" />
          </div>
        </div>

        {/* Completion status */}
        {bracket.isComplete && (
          <div className="mt-2 rounded-full bg-green-500/20 px-6 py-2 text-center text-sm font-semibold text-green-400">
            Bracket Complete!
          </div>
        )}
      </div>
    );
  },
);
