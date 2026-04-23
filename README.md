# Projekt Deutsch

Local-first German drill app. Personal tool for closing the gap between passive recognition and real-time production. Targets A2.2 → B1.

## Stack

Vite + React 19 + TypeScript, Tailwind v4, Dexie (IndexedDB), Zustand, React Router, Vitest.

## Scripts

```sh
npm run dev      # start dev server
npm test         # run tests
npm run build    # typecheck + build
npm run lint     # eslint
```

No backend, no auth, no sync. All state lives in the browser.
