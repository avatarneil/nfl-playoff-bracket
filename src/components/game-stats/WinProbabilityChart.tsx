"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WinProbabilityPoint } from "@/types";

interface WinProbabilityChartProps {
  data: WinProbabilityPoint[];
  homeColor: string;
  awayColor: string;
  homeTeamName: string;
  awayTeamName: string;
}

// Quarter markers in seconds elapsed
const QUARTER_MARKERS = [
  { seconds: 0, label: "Q1" },
  { seconds: 15 * 60, label: "Q2" },
  { seconds: 30 * 60, label: "Q3" },
  { seconds: 45 * 60, label: "Q4" },
  { seconds: 60 * 60, label: "OT" },
];

function formatQuarterTick(seconds: number): string {
  if (seconds === 0) return "Q1";
  if (seconds === 15 * 60) return "Q2";
  if (seconds === 30 * 60) return "Q3";
  if (seconds === 45 * 60) return "Q4";
  if (seconds >= 60 * 60) return "OT";
  return "";
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: WinProbabilityPoint;
  }>;
  homeTeamName: string;
  awayTeamName: string;
}

function CustomTooltip({ active, payload, homeTeamName, awayTeamName }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const homeWin = data.homeWinPercentage;
  const awayWin = 100 - homeWin;

  return (
    <div className="max-w-xs rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-lg">
      <div className="mb-2 text-xs text-gray-400">
        Q{data.quarter} {data.clock}
      </div>
      {data.playText && (
        <p className="mb-2 text-xs leading-relaxed text-gray-300">{data.playText}</p>
      )}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">{awayTeamName}</span>
          <span className="font-bold text-white">{awayWin.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">{homeTeamName}</span>
          <span className="font-bold text-white">{homeWin.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

export function WinProbabilityChart({
  data,
  homeColor,
  awayColor,
  homeTeamName,
  awayTeamName,
}: WinProbabilityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
        No win probability data available
      </div>
    );
  }

  // Calculate domain for x-axis
  const maxSeconds = Math.max(...data.map((d) => d.secondsElapsed));
  const xDomain = [0, Math.max(maxSeconds, 60 * 60)]; // At least show to end of regulation

  // Filter quarter markers to show only relevant ones
  const visibleMarkers = QUARTER_MARKERS.filter((m) => m.seconds <= xDomain[1]);

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="homeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={homeColor} stopOpacity={0.8} />
              <stop offset="50%" stopColor={homeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={homeColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="awayGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={awayColor} stopOpacity={0.8} />
              <stop offset="50%" stopColor={awayColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={awayColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="secondsElapsed"
            type="number"
            domain={xDomain}
            ticks={visibleMarkers.map((m) => m.seconds)}
            tickFormatter={formatQuarterTick}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />

          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
            tickFormatter={(v) => `${v}%`}
          />

          {/* 50% reference line */}
          <ReferenceLine y={50} stroke="#6b7280" strokeDasharray="3 3" />

          {/* Quarter dividers */}
          {visibleMarkers.slice(1).map((marker) => (
            <ReferenceLine
              key={marker.label}
              x={marker.seconds}
              stroke="#374151"
              strokeDasharray="2 2"
            />
          ))}

          <Tooltip
            content={<CustomTooltip homeTeamName={homeTeamName} awayTeamName={awayTeamName} />}
            cursor={{ stroke: "#6b7280", strokeDasharray: "3 3" }}
          />

          <Area
            type="monotone"
            dataKey="homeWinPercentage"
            stroke={homeColor}
            fill="url(#homeGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: homeColor, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: awayColor }} />
          <span className="text-gray-400">{awayTeamName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: homeColor }} />
          <span className="text-gray-400">{homeTeamName}</span>
        </div>
      </div>
    </div>
  );
}
