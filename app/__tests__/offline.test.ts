import { describe, it, expect } from "vitest";

// Test the isOfflineError logic (extracted inline in page.tsx)
function isOfflineError(err: unknown): boolean {
  if (typeof navigator !== "undefined" && !navigator.onLine) return true;
  if (err instanceof TypeError && /fetch|network|aborted/i.test(err.message)) return true;
  return false;
}

describe("isOfflineError", () => {
  it("detects TypeError: Failed to fetch", () => {
    expect(isOfflineError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("detects TypeError: NetworkError", () => {
    expect(isOfflineError(new TypeError("NetworkError when attempting to fetch resource."))).toBe(true);
  });

  it("detects TypeError: The operation was aborted", () => {
    expect(isOfflineError(new TypeError("The operation was aborted"))).toBe(true);
  });

  it("does not flag regular errors as offline", () => {
    expect(isOfflineError(new Error("Something went wrong"))).toBe(false);
  });

  it("does not flag API error messages", () => {
    expect(isOfflineError(new Error("Missing required fields"))).toBe(false);
  });

  it("does not flag non-Error values", () => {
    expect(isOfflineError("string error")).toBe(false);
    expect(isOfflineError(null)).toBe(false);
    expect(isOfflineError(undefined)).toBe(false);
  });
});
