import { NextResponse } from "next/server";
import { fetchLiveResults } from "@/lib/espn-api";

// Cache the results for 60 seconds to avoid hammering ESPN's API
let cachedResults: Awaited<ReturnType<typeof fetchLiveResults>> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
  const now = Date.now();

  // Return cached results if still valid
  if (cachedResults && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedResults, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    });
  }

  try {
    const results = await fetchLiveResults();
    cachedResults = results;
    cacheTimestamp = now;

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Failed to fetch live standings:", error);

    // If we have stale cached data, return it
    if (cachedResults) {
      return NextResponse.json(cachedResults, {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
          "X-Stale": "true",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch live standings" },
      { status: 500 },
    );
  }
}
