"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type {
  ActivityEvent,
  ContributionWeek,
  RecentCommitMessage,
} from "@/lib/github";

const GITHUB_USERNAME = "mahirmlk";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const REFRESH_INTERVAL_MS = 30000;
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EVENT_LABELS: Record<string, string> = {
  PushEvent: "Pushed to",
  CreateEvent: "Created",
  PullRequestEvent: "Opened PR in",
  IssuesEvent: "Opened issue in",
  ForkEvent: "Forked",
  PullRequestReviewEvent: "Reviewed PR in",
};

type ContributionCell = {
  date: string;
  count: number;
  level: number;
};

type GitHubCommitsResponse = {
  year: number;
  totalContributions: number;
  weeks: ContributionWeek[];
  recentActivity: ActivityEvent[];
  commits: RecentCommitMessage[];
  fetchedAt: string;
  error?: string;
};

function formatFetchedAt(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function formatCommitDate(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getContributionLevel(count: number) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function levelColor(level: number) {
  if (level <= 0) return "#ebedf0";
  if (level === 1) return "#9be9a8";
  if (level === 2) return "#40c463";
  if (level === 3) return "#30a14e";
  return "#216e39";
}

function getWeekdayIndex(dateString: string) {
  const day = new Date(`${dateString}T00:00:00Z`).getUTCDay();
  return day === 0 ? 6 : day - 1;
}

function flattenWeeks(weeks: ContributionWeek[]) {
  return weeks
    .flatMap((week) => week.days)
    .map((day) => ({
      date: day.date,
      count: day.count,
      level: getContributionLevel(day.count),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildWeeks(contributions: ContributionCell[]) {
  if (contributions.length === 0) {
    return { weeks: [], monthPositions: [] };
  }

  const firstDate = new Date(`${contributions[0].date}T00:00:00Z`);
  const leadingNulls = getWeekdayIndex(contributions[0].date);
  const cells: Array<ContributionCell | null> = Array.from({ length: leadingNulls }, () => null);
  cells.push(...contributions);

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: Array<Array<ContributionCell | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  const monthPositions: Array<{ label: string; weekIndex: number }> = [];
  const seenMonths = new Set<number>();

  contributions.forEach((day) => {
    const current = new Date(`${day.date}T00:00:00Z`);
    const month = current.getUTCMonth();

    if (current.getUTCDate() !== 1 || seenMonths.has(month)) {
      return;
    }

    const diffDays = Math.floor((current.getTime() - firstDate.getTime()) / 86400000);
    const cellIndex = diffDays + leadingNulls;
    monthPositions.push({
      label: MONTH_LABELS[month],
      weekIndex: Math.floor(cellIndex / 7),
    });
    seenMonths.add(month);
  });

  if (!seenMonths.has(firstDate.getUTCMonth())) {
    monthPositions.unshift({
      label: MONTH_LABELS[firstDate.getUTCMonth()],
      weekIndex: 0,
    });
  }

  return { weeks, monthPositions };
}

function formatDateTooltip(day: ContributionCell) {
  const date = new Date(`${day.date}T00:00:00Z`);
  return `${day.count === 0 ? "No" : day.count} contribution${day.count !== 1 ? "s" : ""} on ${date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  )}`;
}

function GitHubActivity({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-[var(--fg-muted)]">No recent public activity.</p>;
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => {
        const label = EVENT_LABELS[event.type] ?? "Activity in";
        const date = new Date(event.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <li
            key={event.id}
              className="flex flex-wrap items-center gap-2 border-l-2 border-[var(--border)] pl-3 text-sm text-[var(--fg-muted)]"
          >
            <time className="mono w-16 shrink-0 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              {date}
            </time>
            <span>{label}</span>
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="break-all font-medium text-[var(--fg)] underline decoration-[var(--border-hover)] underline-offset-4"
            >
              {event.repo.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function GitHubCommitsSection() {
  const [data, setData] = useState<GitHubCommitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; date: string } | null>(null);

  const fetchGitHubData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/github-commits", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`GitHub activity feed responded with ${response.status}`);
      }

      const nextData = (await response.json()) as GitHubCommitsResponse;
      setData(nextData);
      setError(nextData.error ?? null);
    } catch {
      setError("Unable to load GitHub contributions right now.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchGitHubData();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void fetchGitHubData(true);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void fetchGitHubData(true);
      }
    };

    window.addEventListener("focus", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const contributions = useMemo(() => flattenWeeks(data?.weeks ?? []), [data]);
  const graphData = useMemo(() => buildWeeks(contributions), [contributions]);
  const statusText = loading ? "Loading" : refreshing ? "Refreshing" : error ? "Feed issue" : "Live";

  const cellSize = 11;
  const cellGap = 4;
  const weekdayLabelWidth = 34;
  const monthLabelHeight = 18;
  const legendHeight = 32;

  const totalWeeks = graphData.weeks.length;
  const svgWidth = weekdayLabelWidth + totalWeeks * (cellSize + cellGap);
  const svgHeight = monthLabelHeight + 7 * (cellSize + cellGap) + legendHeight;

  const handleCellHover = (day: ContributionCell | null, event: React.MouseEvent<SVGRectElement>) => {
    if (!day) return;
    const cellRect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(cellRect.left + cellRect.width / 2, 110), window.innerWidth - 110);

    setTooltip({
      text: formatDateTooltip(day),
      x,
      y: cellRect.top - 10,
      date: day.date,
    });
  };

  const weekdayLabels = [
    { label: "Mon", row: 0 },
    { label: "Wed", row: 2 },
    { label: "Fri", row: 4 },
  ];

  return (
    <section id="github-activity" className="site-container section-block">
      <Reveal>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-eyebrow">GitHub Activity</p>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)" }}
            >
              Contribution graph and recent commits.
            </h2>
            <p className="section-copy mt-5 max-w-3xl">
              A GitHub-style overview of public contributions in {data?.year ?? new Date().getFullYear()},
              followed by recent public activity and commit messages from{" "}
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--fg)] underline decoration-[var(--border-hover)] underline-offset-4"
              >
                @{GITHUB_USERNAME}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)]">
              <span className="gh-live-dot" />
              {statusText}
              {data?.fetchedAt ? ` / ${formatFetchedAt(data.fetchedAt)}` : ""}
            </div>
            <button
              type="button"
              onClick={() => void fetchGitHubData(true)}
              className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
            >
              View Profile <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100} className="mt-8">
        <div className="gh-graph-container">
          <div className="gh-graph-header">
            <div className="gh-graph-count">
              {data?.totalContributions ?? 0} contributions in {data?.year ?? new Date().getFullYear()}
            </div>
            <p className="gh-graph-meta">Auto-refreshing every 30 seconds.</p>
          </div>

          {loading ? (
            <div className="gh-graph-skeleton" />
          ) : data && graphData.weeks.length > 0 ? (
            <>
            <div className="gh-graph-scroll-wrapper">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight - legendHeight}`}
                className="gh-graph-svg"
                preserveAspectRatio="xMinYMin meet"
              >
                {graphData.monthPositions.map((month, index) => (
                  <text
                    key={`${month.label}-${index}`}
                    x={weekdayLabelWidth + month.weekIndex * (cellSize + cellGap)}
                    y={12}
                    className="gh-month-label"
                  >
                    {month.label}
                  </text>
                ))}

                {weekdayLabels.map(({ label, row }) => (
                  <text
                    key={label}
                    x={0}
                    y={monthLabelHeight + row * (cellSize + cellGap) + cellSize - 1}
                    className="gh-weekday-label"
                  >
                    {label}
                  </text>
                ))}

                {graphData.weeks.map((week, weekIndex) => (
                  <g key={weekIndex}>
                    {week.map((day, dayIndex) => (
                      <rect
                        key={day ? day.date : `empty-${weekIndex}-${dayIndex}`}
                        x={weekdayLabelWidth + weekIndex * (cellSize + cellGap)}
                        y={monthLabelHeight + dayIndex * (cellSize + cellGap)}
                        width={cellSize}
                        height={cellSize}
                        rx={2}
                        ry={2}
                        fill={levelColor(day?.level ?? 0)}
                        className={day ? "gh-cell" : "gh-cell gh-cell-empty"}
                        onMouseEnter={day ? (event) => handleCellHover(day, event) : undefined}
                        onMouseLeave={day ? () => setTooltip(null) : undefined}
                        onClick={
                          day
                            ? (event) => {
                                if (!window.matchMedia("(pointer: coarse)").matches) return;
                                if (tooltip?.date === day.date) {
                                  setTooltip(null);
                                } else {
                                  handleCellHover(day, event);
                                }
                              }
                            : undefined
                        }
                      />
                    ))}
                  </g>
                ))}
              </svg>

              <div className="gh-legend">
                <span className="gh-legend-text">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="gh-legend-cell"
                    style={{ backgroundColor: levelColor(level) }}
                  />
                ))}
                <span className="gh-legend-text">More</span>
              </div>
            </div>
            {tooltip && (
              <div
                className="gh-tooltip"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                }}
              >
                {tooltip.text}
              </div>
            )}
            </>
          ) : (
            <div className="gh-graph-error">{error ?? "No contribution data available."}</div>
          )}
        </div>
      </Reveal>

      <Reveal delay={150} className="mt-8">
        <div className="gh-commits-container">
          <div className="gh-commits-header">
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                Recent Public Activity
              </p>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                Latest visible actions pulled from the GitHub public events feed.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <GitHubActivity events={data?.recentActivity ?? []} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200} className="mt-8">
        {data && data.commits.length > 0 ? (
          <div className="gh-commits-container">
            <div className="gh-commits-header">
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                  Recent Commit Messages
                </p>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">
                  Commit messages extracted from recent public push events.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {data.commits.map((commit) => (
                <article key={commit.id} className="gh-commit-row">
                  <div className="min-w-0">
                    <p className="text-sm leading-7 text-[var(--fg)]">{commit.message}</p>
                    <p className="mono mt-2 break-words text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                      {commit.repoName}
                      {commit.shortSha ? ` / ${commit.shortSha}` : ""}
                      {` / ${formatCommitDate(commit.createdAt)}`}
                    </p>
                  </div>
                  {commit.commitUrl ? (
                    <a
                      href={commit.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mono inline-flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
                    >
                      Open Commit <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <a
                      href={commit.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mono inline-flex shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
                    >
                      Open Repo <ArrowUpRight size={14} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="gh-commits-empty">
            No recent public push commits are available right now, but the activity feed above is live.
          </div>
        )}
      </Reveal>
    </section>
  );
}
