# PlayKcal (mobile)

Your nutrition sidekick that makes calorie tracking effortless. 🥗✨

PlayKcal helps you log meals, track calories, and understand your nutrition — all in a simple, focused mobile app.

<img src="./screenshots/11.jpg" alt="Screenshot 1" width="200" height="450" />
<img src="./screenshots/22.jpg" alt="Screenshot 2" width="200" height="450" />
<img src="./screenshots/33.jpg" alt="Screenshot 2" width="200" height="450" />
<img src="./screenshots/44.jpg" alt="Screenshot 1" width="200" height="450" />
<img src="./screenshots/55.jpg" alt="Screenshot 2" width="200" height="450" />
<img src="./screenshots/66.jpg" alt="Screenshot 2" width="200" height="450" />
<img src="./screenshots/77.jpg" alt="Screenshot 2" width="200" height="450" />
<img src="./screenshots/88.jpg" alt="Screenshot 2" width="200" height="450" />

---

## Overview

This folder contains the React Native mobile app (Expo prebuild / bare workflow) for PlayKcal. The API and database live in the sibling `server/` folder and use PostgreSQL + Prisma.

Key ideas:
- Mobile app: Expo prebuild (bare), TypeScript, Zustand for state
- Backend: Node + TypeScript + Prisma + PostgreSQL (see `../server`)

## Tech stack

- React Native (Expo prebuild / bare)
- TypeScript
- Zustand (state management)
- @react-native-async-storage/async-storage (persistence)
- Axios or fetch (networking)
- Backend: Node + Prisma + PostgreSQL (in `server/`)

---

## Prerequisites

- Node.js 16+ (or the version used by the repo)
- Yarn or npm
- Expo CLI (optional): `npm install -g expo-cli` or use `npx expo ...`
- CocoaPods (macOS) for iOS native deps: `brew install cocoapods`
- A running PostgreSQL instance and `DATABASE_URL` for the server

---

## Quick start

1. Start the backend API (see `../server`). Make sure it runs and is reachable (e.g. `http://localhost:3000`).
2. Start the mobile app from this `my-app/` folder and configure `API_BASE_URL` to point at your server.

Detailed steps follow.

---

## Backend (server) — quick checklist

From the repo root:

```zsh
cd server
```

Install dependencies (select the tool used by the server package.json):

```zsh
yarn install
# or
npm install
# or (if using bun)
bun install
```

Create `.env` with at least:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
```

Run Prisma generate and migrations:

```zsh
npx prisma generate
npx prisma migrate dev --name init
```

Start the server (example):

```zsh
yarn dev
# or
npm run dev
# or
bun run dev
```

Ensure API is reachable at the configured port.

---

## Mobile app — install & run

From `my-app/`:

1. Install dependencies:

```zsh
cd my-app
yarn install
# or
npm install
```

2. Prebuild / install native deps (iOS):

```zsh
# if you need to generate native projects
npx expo prebuild --platform ios
cd ios && pod install && cd ..
```

3. Configure the app API URL:

- Update the API base URL used by the app (search for `API_BASE_URL` or `src/constants`) and set it to your server address, e.g. `http://localhost:3000` or `http://<LAN_IP>:3000`.

Notes:
- iOS simulator can usually reach `localhost` on the host machine.
- Android emulator may require `10.0.2.2` or use your machine LAN IP.

4. Run the app in development:

```zsh
yarn start
# or
npm run start

# then open simulator/device via Expo
yarn ios   # runs iOS
yarn android # runs Android
```

If you're using the bare workflow and native projects already exist, open Xcode / Android Studio for device builds.

---

## Zustand store (example)

Use `zustand` with `persist` and `@react-native-async-storage/async-storage` for lightweight local state and small caches (e.g. cached foods, preferences). Keep network calls in a small API client or inside stores.

Example store file: `src/stores/useFoodStore.ts` (not added here). If you'd like, I can add a ready-to-use store and a sample screen.

---

## Common issues

- Android networking: use `10.0.2.2` or your machine IP if `localhost` fails.
- CORS: allow requests from the app during development.
- Large persistence: don't store large blobs in AsyncStorage.

---

## Next steps I can do for you

- Add a `src/stores/useFoodStore.ts` example using Zustand + AsyncStorage
- Add `my-app/.env.example` and `server/.env.example`
- Inspect and document `server/prisma/schema.prisma` models the app expects

Tell me which you'd like and I'll update the repository.