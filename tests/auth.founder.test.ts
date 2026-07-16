import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockSupabase } from "./helpers/supabase-mock";

vi.mock("@/lib/supabase/env", () => ({
  isSupabaseConfigured: true,
  supabaseUrl: "https://test.supabase.co",
  supabasePublishableKey: "test-publishable-key",
  supabaseSecretKey: "",
}));

const createClientMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: () => createClientMock(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

async function loadFounderAuth() {
  return import("@/lib/auth/founder");
}

beforeEach(() => {
  createClientMock.mockReset();
});

describe("getFounder (authorization)", () => {
  it("returns null when there is no Supabase session", async () => {
    const mockSupabase = createMockSupabase({
      auth: { getUser: vi.fn(async () => ({ data: { user: null }, error: null })) },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { getFounder } = await loadFounderAuth();
    expect(await getFounder()).toBeNull();
  });

  it("returns null when a signed-in user is not on the founders allowlist", async () => {
    const mockSupabase = createMockSupabase({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })),
      },
      from: {
        founders: { data: null, error: null },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { getFounder } = await loadFounderAuth();
    expect(await getFounder()).toBeNull();
  });

  it("returns the founder row for an authorized user", async () => {
    const founderRow = { id: "user-1", email: "founder@velnit.life", full_name: null, created_at: "2026-01-01" };
    const mockSupabase = createMockSupabase({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })),
      },
      from: {
        founders: { data: founderRow, error: null },
      },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { getFounder } = await loadFounderAuth();
    expect(await getFounder()).toEqual(founderRow);
  });
});

describe("requireFounder (authorization)", () => {
  it("redirects to login when there is no session", async () => {
    const mockSupabase = createMockSupabase({
      auth: { getUser: vi.fn(async () => ({ data: { user: null }, error: null })) },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { requireFounder } = await loadFounderAuth();
    await expect(requireFounder()).rejects.toThrow("REDIRECT:/studio/login?error=not-authorized");
  });

  it("redirects to login when signed in but not a founder", async () => {
    const mockSupabase = createMockSupabase({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })),
      },
      from: { founders: { data: null, error: null } },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { requireFounder } = await loadFounderAuth();
    await expect(requireFounder()).rejects.toThrow("REDIRECT:/studio/login?error=not-authorized");
  });

  it("returns the founder without redirecting when authorized", async () => {
    const founderRow = { id: "user-1", email: "founder@velnit.life", full_name: null, created_at: "2026-01-01" };
    const mockSupabase = createMockSupabase({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null })),
      },
      from: { founders: { data: founderRow, error: null } },
    });
    createClientMock.mockResolvedValue(mockSupabase);

    const { requireFounder } = await loadFounderAuth();
    await expect(requireFounder()).resolves.toEqual(founderRow);
  });
});
