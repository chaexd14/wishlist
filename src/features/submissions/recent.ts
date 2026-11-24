export const RECENT_SUBMISSION_KEY = "birthday-wishlist-last-submission-v1";
export const RECENT_SUBMISSION_CHANGE_EVENT = "birthday-wishlist-recent-submission-change";

export type RecentSubmission = { id: string; reference: string; fingerprint: string };

export function parseRecentSubmission(value: string): RecentSubmission | null {
  try {
    const parsed = JSON.parse(value || "null") as Partial<RecentSubmission> | null;
    return parsed && typeof parsed.id === "string" && typeof parsed.reference === "string" && typeof parsed.fingerprint === "string"
      ? parsed as RecentSubmission : null;
  } catch { return null; }
}

export function getRecentSubmissionSnapshot() { return localStorage.getItem(RECENT_SUBMISSION_KEY) ?? ""; }

export function rememberSubmission(submission: RecentSubmission) {
  localStorage.setItem(RECENT_SUBMISSION_KEY, JSON.stringify(submission));
  window.dispatchEvent(new Event(RECENT_SUBMISSION_CHANGE_EVENT));
}

export function subscribeToRecentSubmission(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(RECENT_SUBMISSION_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(RECENT_SUBMISSION_CHANGE_EVENT, onChange);
  };
}
