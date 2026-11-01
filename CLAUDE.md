@AGENTS.md

## REDOPS project notes
- Target stack: Next.js, FastAPI, Postgres, Redis, OpenSearch. Current state: front-end prototype only, on Vite (see docs/decisions/0001-vite-instead-of-nextjs.md).
- Commands: typecheck `pnpm exec tsc --noEmit`; build `pnpm build`. No lint or test runner is configured yet (adding one needs approval).
- All data in `src/data/mock.ts` is fixture data. Auth in `src/features/Access.tsx` is a mock.
- Force screen states with `?state=loading|empty|error|denied`. Design system: `/design`.
- Not yet written: docs/system-design.md and docs/architecture.md. They wait on the Phase 1 interview.
