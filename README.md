# Pokémon Challenge

A React Native Pokémon application built with **Expo SDK 58** and **TypeScript**. It retrieves the first 20 Pokémon from [PokéAPI](https://pokeapi.co/), lets users explore individual Pokémon details, and supports partial offline use through SQLite caching.

## Features

- Browse the first **20 Pokémon**, including their names and artwork.
- Select a Pokémon to view its types, abilities, base stats, height, weight, and base experience.
- Loading, error, retry, and empty states on list and detail screens.
- Network-first data retrieval with **SQLite fallback** when a request fails.
- Request cancellation using `AbortController` to avoid processing outdated requests.
- Typed navigation and domain models using TypeScript.
- Android and iOS support.
- Automated tests for APIs, repositories, hooks, screens, and the Pokémon card.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React Native + Expo SDK 58 | Cross-platform application and native tooling |
| TypeScript | Strong typing and maintainable interfaces |
| React Navigation | Typed stack and tab navigation |
| Expo SQLite | Persistent local cache and schema migrations |
| Native `fetch` | HTTP requests to PokéAPI without an additional networking library |
| Jest + `jest-expo` | Automated test runner and Expo-compatible preset |
| React Native Testing Library | Component and custom-hook tests |

Expo-native utilities, including the splash screen and status bar, are used for application-level presentation.

## Requirements

- Node.js **24** (used for development)
- npm
- Xcode and the iOS Simulator for iOS development on macOS
- Android Studio and an Android emulator for Android development

Native builds require the relevant platform tools. A physical iPhone additionally requires Apple code signing.

## Installation

Clone the repository and install dependencies:

```bash
git clone <YOUR_PUBLIC_REPOSITORY_URL>
cd react-native-pokemon-challenge
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Run the native application:

```bash
# iOS Simulator (macOS + Xcode)
npx expo run:ios

# Android emulator
npx expo run:android
```

To test an **offline cold start** in the iOS Simulator without relying on Metro, build a release configuration while online:

```bash
npx expo run:ios --configuration Release
```

## Project structure

```text
src/
├── config/
│   └── api.ts
├── db/
│   ├── database.ts
│   └── migrations.ts
├── features/
│   └── pokemon/
│       ├── apis/
│       │   ├── listApi.ts
│       │   └── detailApi.ts
│       ├── components/
│       │   └── PokemonCard.tsx
│       ├── hooks/
│       │   ├── usePokemonList.ts
│       │   └── usePokemonDetail.ts
│       ├── models/
│       │   ├── Pokemon.ts
│       │   └── PokemonDetail.ts
│       ├── repositories/
│       │   ├── listRepository.ts
│       │   └── detailRepository.ts
│       ├── screens/
│       │   ├── ListScreen.tsx
│       │   └── DetailScreen.tsx
│       └── storage/
│           └── pokemonStorage.ts
└── navigation/
    ├── MainNavigator.tsx
    ├── PokemonNavigator.tsx
    ├── routes.ts
    └── types.ts
```

Test files (`*.test.ts` and `*.test.tsx`) are colocated with the code they verify.

## Architecture and design decisions

The project adopts a **pragmatic, feature-based layered architecture** inspired by Clean Architecture principles. Responsibilities are separated without adding unnecessary classes, use-case passthroughs, or a dependency-injection container for this small assessment.

```text
Screen / Component
       ↓
Custom Hook (UI state, lifecycle, retries, cancellation)
       ↓
Repository (data transformation, network-first policy, cache fallback)
       ├── API module (native fetch / PokéAPI)
       └── Storage module (Expo SQLite)
```

- **Screens** render user-facing states and manage navigation.
- **Hooks** manage loading, errors, retries, and request cancellation.
- **Repositories** map API responses into application models and coordinate network/cache access.
- **API modules** handle HTTP requests and response status checks.
- **Storage functions** encapsulate SQLite reads and writes.
- **Models** represent the application's Pokémon data independently of the API response format.

This design prioritizes **single responsibility, separation of concerns, and testability**. It is not a strict implementation of the Dependency Inversion Principle: repositories currently import concrete API and SQLite storage functions directly. For the challenge's limited scope, this is a deliberate trade-off in favor of clarity and minimal orchestration.

## Persistence and offline behavior

The application uses SQLite with versioned database migrations and a **network-first** strategy:

1. Request fresh Pokémon data from PokéAPI.
2. Transform successful responses into typed application models.
3. Save the list or selected Pokémon details to SQLite.
4. If a request fails, attempt to return previously cached data.
5. If neither the API nor SQLite can provide the requested Pokémon, display the appropriate error state.

The cache stores the first Pokémon list and the details of Pokémon already opened. **Offline support is partial:** an uncached detail page cannot load while disconnected. Image URLs are stored, **not the image bytes**, so artwork may not be available offline. Caching a fresh response is best-effort; cache-write failures do not prevent fresh data from being shown.

## Automated testing

Run all tests:

```bash
npm test -- --runInBand
```

Check TypeScript:

```bash
npx tsc --noEmit
```

### Verified results

| Test suite | Tests passed |
| --- | ---: |
| `listApi.test.ts` | 5 |
| `detailApi.test.ts` | 6 |
| `listRepository.test.ts` | 4 |
| `detailRepository.test.ts` | 5 |
| `usePokemonList.test.ts` | 5 |
| `usePokemonDetail.test.ts` | 6 |
| `PokemonCard.test.tsx` | 4 |
| `ListScreen.test.tsx` | 6 |
| `DetailScreen.test.tsx` | 5 |
| **Total** | **46** |

**Last reported verification:** 9 test suites passed, 46 tests passed, 0 test failures; `npx tsc --noEmit` completed with no errors (November 15, 2026).

The automated tests use mocks to isolate network, storage, hooks, and screen behavior. They do not constitute end-to-end tests against live PokéAPI or physical-device tests.

## Manual verification

- Pokémon listing and detail navigation tested on Android and iOS Simulator.
- SQLite persistence and offline fallback verified in the iOS Simulator.
- Physical iPhone testing was not completed because the local macOS environment lacked an available iOS signing identity; it is not a known application defect.

## Dependencies and assessment considerations

The technical assessment contains two conflicting dependency statements: Section 7 disallows external libraries, while Section 8 permits library selection when justified. This implementation uses React Navigation for navigation, Expo SQLite for persistent offline storage, and Jest/React Native Testing Library for testing; each addresses an explicit functional or quality requirement. Network requests use the native `fetch` API rather than a third-party HTTP client.

## Limitations and potential improvements

- The initial listing is limited to the first 20 Pokémon; pagination is a potential enhancement.
- Pokémon images are referenced by remote URLs and may not display without connectivity.
- Only previously opened Pokémon detail records are accessible offline.