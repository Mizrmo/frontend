# Mizrmo Mobile — Frontend

Expo/React Native ride-sharing app for Ghana (rider + driver apps in one codebase). Talks to the `mizrmo-backend` NestJS API (separate repo).

## Stack

- Expo SDK 54, Expo Router (file-based routing), React Native 0.81, React 19
- `react-native-web` for the web build (Vercel/Netlify configs both present)
- Axios for API calls, no external state library — auth/session state lives in a single React Context
- TypeScript throughout

## Project layout

```
app/                  Expo Router routes (file-based). Folders in parens are route groups.
  index.tsx           Onboarding / splash — redirects to (rider) or (driver) home if already logged in
  (auth)/              Sign up, sign in, OTP verification, password set/reset, driver vehicle onboarding
  (rider)/             Rider-facing screens (home, search, trips, favourites, ride details...)
  (driver)/             Driver-facing screens (dashboard, advertise a ride, incoming requests...)
  (profile)/            Shared account screens (edit profile, payment methods, support, referrals...)
  _layout.tsx           Root layout: font loading, splash screen, AuthProvider, Stack navigator

src/
  api/                 One file per backend resource (auth.ts, trips.ts, bookings.ts, vehicles.ts, ...).
                       All of them import the shared axios instance from client.native.ts.
  context/AuthContext.tsx   Session state: user, active role (RIDER/DRIVER), sign in/out, role switching
  config/env.ts        Reads EXPO_PUBLIC_* env vars (API URL, WS URL, Paystack/Google Maps keys)
  hooks/                Small focused hooks (device location, profile photo/bio, push notifications, trip tracking)
  utils/                Pure helpers (route/geocode math, favourites, last-search cache, sign-out cleanup...)

components/            Shared UI, including native/web split components (see below)
```

### Routing conventions

Expo Router's parenthesized folders are **route groups** — they organize files but are not part of the URL. `app/(rider)/home.tsx` is reachable at `/home`, not `/(rider)/home`. When navigating by literal URL (e.g. testing on web), use the un-grouped path: `http://localhost:8081/signin`, not `/(auth)/signin`.

`app/index.tsx` is the entry route. It shows a splash/onboarding carousel for logged-out users, or silently redirects to the right home screen (`resolvePostAuthRoute`) if a session already exists.

## Auth & session model

- Registration is OTP-based: `POST /auth/register/initiate` → OTP sent → `POST /auth/verify-otp` → `POST /auth/set-password` → auto-login. See `app/(auth)/register.tsx` → `verify-otp.tsx` → `set-password.tsx`.
- Tokens are stored via `src/api/storage.ts` (`expo-secure-store` on native, `localStorage` on web — see Web Platform Gaps below) and read/written through `src/api/tokens.ts`.
- `src/api/client.native.ts` is the single shared axios instance (despite the `.native` suffix, it's imported directly by filename everywhere and used on all platforms including web — there is no separate web client). It attaches the access token to every request and handles 401s:
  - On a 401, it calls `POST /auth/refresh` with the stored refresh token (single-flight — concurrent 401s trigger one refresh, not one each) and retries the original request with the new access token.
  - If refresh itself fails (expired/revoked refresh token, or the 401 came from an auth endpoint), it clears the session and redirects to `/signin`.
  - Access tokens are short-lived (15 min); refresh tokens are 7 days and rotate on every use (each refresh call invalidates the token that was just used).
- Rider ↔ Driver is a single account concept, not two accounts: `AuthContext.switchRole('DRIVER')` checks whether the user has completed driver onboarding (vehicle + documents) and either switches `activeRole` or returns a `actionRoute` to send them to onboarding first.

## API layer conventions

- Each `src/api/*.ts` file wraps one backend resource area and exports plain async functions (`getMyVehicles()`, `initiateRegistration()`, etc.) — no class, no generated client.
- `src/api/errors.ts` — `getApiErrorMessage(error)` extracts a user-facing message from an axios error; use it in every `catch` block that surfaces an error to the user.
- `src/api/types.ts` — shared request/response types.

## Environment configuration

`src/config/env.ts` reads Expo public env vars at build time, falling back to the sandbox API if unset:

```
EXPO_PUBLIC_API_URL   default: https://sandbox-api.mizrmo.com/api/v1
EXPO_PUBLIC_WS_URL    default: https://sandbox-api.mizrmo.com
```

To point the app at a local `mizrmo-backend` instead: copy `.env.example` to `.env` (gitignored) and set both vars to your local backend's URL, e.g. `http://localhost:5005/api/v1` and `http://localhost:5005` if running the backend's own `docker-compose` stack (which maps its container port 4000 to host port 5005). EAS build profiles (`eas.json`) hardcode these per environment for real builds — `development`/`preview` point at sandbox, `production` at `api.mizrmo.com`.

If you point the frontend at a local backend and test via `npm run web`, add the web dev server's origin (default `http://localhost:8081`) to the backend's CORS allowlist in `mizrmo-backend/src/main.ts` — it only allowlists `localhost:5173`/`4173` (the admin dashboard's ports) by default.

## Web platform gaps

This is a React Native app; the web build (`npm run web`, via `react-native-web`) is a secondary target and several native packages silently do nothing or crash there. The fix pattern used throughout this codebase is a **native/web split component**: `Thing.native.tsx` (re-exports or wraps the real native package) + `Thing.tsx` (web-only fallback, picked up automatically by Metro on web since it only special-cases `.native`/`.ios`/`.android`, not `.tsx`). Follow this pattern for any new native-only dependency.

Known instances:

| Gap | Where | Fix |
|---|---|---|
| `expo-secure-store` has no web implementation | `src/api/storage.ts` | `Platform.OS === 'web'` branch uses `window.localStorage` instead |
| `react-native-web`'s `Alert.alert()` is a no-op (confirmed empty function in `node_modules/react-native-web/dist/exports/Alert/index.js`) | `src/utils/webAlertPolyfill.ts`, imported once in `app/_layout.tsx` | Patches `Alert.alert` (a module-level singleton, so one patch fixes all ~100 call sites) to use `window.alert`/`window.confirm` on web |
| `@react-native-community/datetimepicker` has no web build at all | `components/DateTimePicker.native.tsx` / `components/DateTimePicker.tsx` | Web version renders a native `<input type="date"/"datetime-local"/"time">` with the same `value`/`mode`/`onChange` prop shape |
| `react-native-maps` doesn't work on web | `components/Map.native.tsx` / `components/Map.tsx` | Web version renders a static placeholder box (no interactive map on web by design) |
| React Native's `FormData.append(field, {uri, name, type})` file-upload shape isn't understood by the browser's native `FormData` — it silently stringifies to `"[object Object]"` instead of attaching a file | `src/api/upload.ts`'s `appendImageToFormData` | `Platform.OS === 'web'` branch `fetch()`s the blob:/data: URI back into a real `Blob` and appends that (with a filename) instead |

When testing a flow on web, watch for screens that silently do nothing on tap — it's usually one of the above categories (or a new one) rather than a logic bug.

## Known gaps / follow-ups

- No push-notification credentials configured for local dev (`[PushService] FCM credentials not configured` — expected, not an error).
- `app/(driver)/home.tsx`'s `loadDashboard()` loads its five API calls independently (`Promise.allSettled`, each card sets its own state) specifically so one failing/403'ing call — e.g. a rider account without a driver profile hitting driver-only endpoints — doesn't blank out the whole dashboard. Keep new dashboard cards on this pattern rather than reverting to `Promise.all`.
