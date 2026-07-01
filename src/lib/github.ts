import { siteConfig } from "@/lib/site";

const REPO_PATH = siteConfig.github.replace("https://github.com/", "");

export async function getGithubStarCount(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_PATH}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}
