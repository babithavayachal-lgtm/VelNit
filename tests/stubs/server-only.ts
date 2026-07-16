// Stub for the "server-only" package in the Vitest environment. The real
// package throws unconditionally when required outside of Next.js's
// webpack build (Next aliases it to a no-op only in its own server
// bundles), so tests alias it to this empty module instead. See
// vitest.config.ts.
export {};
