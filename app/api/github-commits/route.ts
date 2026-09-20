import { NextResponse } from "next/server";
import {
  fetchContributions,
  getGitHubSetupError,
  fetchRecentCommitMessages,
  fetchRecentActivity,
} from "@/lib/github";

export async function GET() {
  try {
    const [contributions, recentActivity] = await Promise.all([
      fetchContributions(),
      fetchRecentActivity(),
    ]);
    const commits = await fetchRecentCommitMessages();

    return NextResponse.json(
      {
        year: contributions?.year ?? new Date().getUTCFullYear(),
        totalContributions: contributions?.totalContributions ?? 0,
        weeks: contributions?.weeks ?? [],
        recentActivity,
        commits,
        fetchedAt: new Date().toISOString(),
        error: getGitHubSetupError() ?? undefined,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[github-commits] request failed:", error);

    return NextResponse.json(
      {
        year: new Date().getUTCFullYear(),
        totalContributions: 0,
        weeks: [],
        recentActivity: [],
        commits: [],
        fetchedAt: new Date().toISOString(),
        error: "GitHub activity is temporarily unavailable.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
