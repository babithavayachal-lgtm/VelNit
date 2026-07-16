import { vi, type Mock } from "vitest";

/**
 * A minimal fake Supabase query builder. Every chain method (select, eq,
 * insert, update, order, in, ...) returns the same builder instance, and
 * the builder itself resolves (via `.then`) to whatever result it was
 * constructed with - mirroring how postgrest-js builders are "thenable"
 * even without an explicit terminal call. `.single()`/`.maybeSingle()`
 * resolve to the same result, since our tests only ever configure one
 * outcome per `.from(table)` call.
 */
export function makeQueryBuilder(result: unknown) {
  const chainMethods = [
    "select",
    "insert",
    "update",
    "eq",
    "neq",
    "in",
    "order",
    "limit",
    "lte",
    "gte",
  ] as const;

  const builder: Record<string, unknown> = {};
  for (const method of chainMethods) {
    builder[method] = vi.fn(() => builder);
  }
  builder.maybeSingle = vi.fn(async () => result);
  builder.single = vi.fn(async () => result);
  builder.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(result).then(resolve, reject);

  return builder as Record<string, Mock> & PromiseLike<unknown>;
}

export type MockResult = { data: unknown; error: unknown };

/**
 * A fake Supabase client good enough for testing our services layer:
 * configure one result (or a queue of results, for tables hit more than
 * once in a single service call) per table name, then inspect
 * `client.buildersByTable[table]` to assert on exactly what was sent to
 * `.insert()` / `.update()`.
 */
export function createMockSupabase(config: {
  from?: Record<string, MockResult | MockResult[]>;
  auth?: {
    getUser?: Mock;
    signInWithPassword?: Mock;
    signOut?: Mock;
  };
}) {
  const callCounts: Record<string, number> = {};
  const buildersByTable: Record<string, ReturnType<typeof makeQueryBuilder>[]> = {};

  const from = vi.fn((table: string) => {
    const entry = config.from?.[table];
    let result: MockResult;

    if (Array.isArray(entry)) {
      const idx = callCounts[table] ?? 0;
      result = entry[Math.min(idx, entry.length - 1)];
      callCounts[table] = idx + 1;
    } else {
      result = entry ?? { data: null, error: { message: `no mock configured for "${table}"` } };
    }

    const builder = makeQueryBuilder(result);
    buildersByTable[table] = buildersByTable[table] ?? [];
    buildersByTable[table].push(builder);
    return builder;
  });

  return {
    from,
    buildersByTable,
    auth: {
      getUser: config.auth?.getUser ?? vi.fn(async () => ({ data: { user: null }, error: null })),
      signInWithPassword:
        config.auth?.signInWithPassword ?? vi.fn(async () => ({ data: { user: null }, error: null })),
      signOut: config.auth?.signOut ?? vi.fn(async () => ({ error: null })),
    },
  };
}
