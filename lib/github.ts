export type ContributionDay = {
  date: string;
  count: number;
};

export type ContributionWeek = {
  days: ContributionDay[];
};

export type ContributionData = {
  weeks: ContributionWeek[];
  totalContributions: number;
  year: number;
};

export type ActivityEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    head?: string;
    commits?: { message: string; sha?: string }[];
  };
};

export type RecentCommitMessage = {
  id: string;
  message: string;
  repoName: string;
  repoUrl: string;
  commitUrl: string | null;
  sha: string | null;
  shortSha: string | null;
  createdAt: string;
};

type GitHubFetchOptions = {
  accept?: string;
  revalidate?: number;
};

export const GITHUB_USERNAME = "mahirmlk";

const GRAPHQL_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

function getGitHubAuth() {
  const username = process.env.GITHUB_USERNAME || GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  return { username, token };
}

export function getGitHubSetupError() {
  // Deliberately generic: this string is exposed to browsers via the API
  // response, so it must never reveal which env var or credential is missing.
  if (!process.env.GITHUB_TOKEN) {
    return "GitHub feed is not configured.";
  }

  return null;
}

async function fetchGitHubJson<T>(url: string, options?: GitHubFetchOptions) {
  const auth = getGitHubAuth();
  if (!auth) {
    throw new Error("Missing GitHub credentials");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
      Accept: options?.accept ?? "application/vnd.github+json",
    },
    cache: "force-cache",
    next: { revalidate: options?.revalidate ?? 1800 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

export async function fetchContributions(): Promise<ContributionData | null> {
  const auth = getGitHubAuth();
  if (!auth) return null;

  try {
    const year = new Date().getUTCFullYear();
    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GRAPHQL_QUERY,
        variables: { username: auth.username, from, to },
      }),
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`GitHub GraphQL responded with ${res.status}`);
    }

    const json = (await res.json()) as GraphQLResponse;
    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      year,
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
        })),
      })),
    };
  } catch (error) {
    console.error("GitHub Contributions Error:", error);
    return null;
  }
}

export async function fetchRecentActivity(): Promise<ActivityEvent[]> {
  const auth = getGitHubAuth();
  if (!auth) return [];

  try {
    return await fetchGitHubJson<ActivityEvent[]>(
      `https://api.github.com/users/${auth.username}/events/public?per_page=10`
    );
  } catch (error) {
    console.error("GitHub Activity Error:", error);
    return [];
  }
}

type CommitLookupResponse = {
  sha: string;
  commit: {
    message: string;
  };
};

type CommitSearchResponse = {
  items: Array<{
    sha: string;
    html_url: string;
    repository?: {
      full_name: string;
      html_url: string;
    };
    commit: {
      message: string;
      author?: {
        date?: string;
      };
      committer?: {
        date?: string;
      };
    };
  }>;
};

export async function fetchRecentCommitMessages(limit = 8): Promise<RecentCommitMessage[]> {
  const auth = getGitHubAuth();
  if (!auth) return [];

  try {
    const query = encodeURIComponent(`author:${auth.username} is:public`);
    const commits = await fetchGitHubJson<CommitSearchResponse>(
      `https://api.github.com/search/commits?q=${query}&sort=author-date&order=desc&per_page=${limit}`,
      {
        accept: "application/vnd.github.cloak-preview+json",
        revalidate: 1800,
      }
    );

    return commits.items
      .filter((item) => item.repository?.full_name && item.commit.message.trim().length > 0)
      .map((item) => ({
        id: item.sha,
        message: item.commit.message.split("\n")[0].trim(),
        repoName: item.repository?.full_name ?? "Unknown repository",
        repoUrl: item.repository?.html_url ?? "",
        commitUrl: item.html_url ?? null,
        sha: item.sha,
        shortSha: item.sha.slice(0, 7),
        createdAt: item.commit.author?.date ?? item.commit.committer?.date ?? new Date().toISOString(),
      }));
  } catch (error) {
    console.error("GitHub Commit History Error:", error);
    return [];
  }
}
