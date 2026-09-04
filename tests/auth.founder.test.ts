import { beforeEach, describe, expect, it, vi } from "vitest";

const getSessionMock = vi.fn();

vi.mock("@/lib/db", () => ({ isDatabaseConfigured: true }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: (...args: unknown[]) => getSessionMock(...args) } },
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

async function loadFounderAuth() {
  return import("@/lib/auth/founder");
}

const authorizedSession = {
  user: {
    id: "user-1",
    email: "founder@velnit.life",
    name: "Founder",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
  },
};

const expectedFounder = {
  id: "user-1",
  email: "founder@velnit.life",
  full_name: "Founder",
  created_at: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  getSessionMock.mockReset();
  process.env.FOUNDER_EMAILS = "founder@velnit.life";
});

describe("getFounder (authorization)", () => {
  it("returns null when there is no Better Auth session", async () => {
    getSessionMock.mockResolvedValue(null);
    const { getFounder } = await loadFounderAuth();
    expect(await getFounder()).toBeNull();
  });

  it("returns null when a signed-in user is not on the founders allowlist", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "user-1", email: "outsider@example.com", name: "Outsider", createdAt: new Date() },
    });
    const { getFounder } = await loadFounderAuth();
    expect(await getFounder()).toBeNull();
  });

  it("maps an authorized Better Auth user to a founder", async () => {
    getSessionMock.mockResolvedValue(authorizedSession);
    const { getFounder } = await loadFounderAuth();
    expect(await getFounder()).toEqual(expectedFounder);
  });
});

describe("requireFounder (authorization)", () => {
  it("redirects to login when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);
    const { requireFounder } = await loadFounderAuth();
    await expect(requireFounder()).rejects.toThrow("REDIRECT:/studio/login?error=not-authorized");
  });

  it("redirects to login when signed in but not a founder", async () => {
    getSessionMock.mockResolvedValue({
      user: { id: "user-1", email: "outsider@example.com", name: "Outsider", createdAt: new Date() },
    });
    const { requireFounder } = await loadFounderAuth();
    await expect(requireFounder()).rejects.toThrow("REDIRECT:/studio/login?error=not-authorized");
  });

  it("returns the founder without redirecting when authorized", async () => {
    getSessionMock.mockResolvedValue(authorizedSession);
    const { requireFounder } = await loadFounderAuth();
    await expect(requireFounder()).resolves.toEqual(expectedFounder);
  });
});
