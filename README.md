# Pokédex — React Native Technical Challenge

A mobile Pokédex built with **React Native, Expo SDK 58, and TypeScript** as part of a technical assessment. The goal is to deliver a clear, maintainable application that retrieves Pokémon data from the public [PokéAPI](https://pokeapi.co/) and demonstrates thoughtful software design.

> **Project status:** Initial project setup. Features and architecture described as *planned* below have not yet been implemented.

## Requirements and planned features

- [ ] Display the **first 20 Pokémon** with a name and image.
- [ ] Select a Pokémon to open its details.
- [ ] Display useful details such as types, abilities, stats, height, weight, and base experience.
- [ ] Provide loading, error, and empty states.
- [ ] Handle network failures and make data available offline when previously cached.
- [ ] Persist relevant Pokémon data locally and document the consistency strategy.
- [ ] Support Android and iOS with a responsive, accessible interface.

**Optional enhancements (not yet implemented):** pagination, skeleton loading, focused automated tests, additional accessibility improvements, and performance optimization.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React Native | Native Android and iOS UI |
| Expo SDK 58 | Development tooling and native builds |
| TypeScript (strict mode) | Static typing and maintainability |
| PokéAPI | Public Pokémon data source |
| Built-in `fetch` | HTTP requests without an additional networking dependency |

The assessment contains **conflicting guidance** about dependencies: section 7 disallows external libraries, while section 8 says library selection is permitted if justified. Until clarified, the implementation will minimize additional packages. Expo itself is expressly permitted. Navigation and on-device persistence choices will be documented once decided and implemented.

## Getting started

### Prerequisites

- Node.js **24.x** (Node 24.22.3 was used during project setup)
- npm
- Android Studio and an Android emulator **or** Xcode and an iOS Simulator (macOS)
- An environment that supports Expo SDK 58

### Install

```bash
npm ci
```

### Run

```bash
# Start the Expo development server
npx expo start

# Build and launch Android locally
npx expo run:android

# Build and launch iOS locally (macOS only)
npx expo run:ios
```

`expo run:android` and `expo run:ios` automatically generate native projects on first use when the relevant native directory does not exist. Local native builds require their respective platform toolchains.

### Validate

```bash
npx expo-doctor
npx expo install --check
npx tsc --noEmit
```

## Architecture (planned)

The intended approach is **Clean Architecture**, with clear separation between UI, application rules, and data access. The exact folder structure may evolve during implementation.

```text
src/
  domain/
    models/             # Core Pokémon entities and types
    repositories/       # Repository interfaces
    use-cases/          # Application operations
  data/
    api/                # PokéAPI HTTP access
    mappers/            # API response → domain model
    repositories/       # Repository implementations
    storage/            # Local persistence implementation
  presentation/
    components/         # Reusable UI components
    screens/            # Pokémon list and detail screens
    hooks/              # Screen-facing state and logic
  shared/
    types/              # Cross-cutting shared types (if needed)
```

**Design goals:** keep business logic independent of React Native UI, depend on repository interfaces rather than concrete network clients, isolate side effects, and make critical logic testable. Dependency injection will be lightweight and explicit where useful; avoid unnecessary abstractions.

## Data source

[PokéAPI](https://pokeapi.co/)

Potential API routes:

```text
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
GET https://pokeapi.co/api/v2/pokemon/{id-or-name}
```

API response types will be kept separate from domain models, with mappings implemented where useful.

## Persistence and offline behavior (planned)

The project requires local persistence for relevant Pokémon information and a justification for the chosen strategy. The implementation will document:

- What data is cached, where it is stored, and why.
- When cached entries are read or refreshed.
- What happens when the device is offline or the API is unavailable.

No persistence solution is claimed as implemented yet. Any selected API/package must be checked against the assessment's library restriction.

## Testing

Automated tests are an **optional bonus** in the assessment and are **not configured yet**. If implemented, this section will document the test stack and exact commands.

## Security and dependency notes

During initial installation, `npm audit` reported **three moderate findings** along the Expo tooling dependency chain (`expo` → `@expo/fingerprint` → `minimatch`), including advisory [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).

At the time of the report, `npm audit fix --force` proposed a **breaking downgrade to Expo SDK 52**. That change was **not applied**. This is a tracked dependency warning, not a claim that the application is free from security risk. Before submitting, recheck the audit and available compatible updates:

```bash
npm audit
npm ls minimatch @expo/fingerprint
```

## Known limitations and trade-offs

- Functional screens, persistence, and testing are still pending implementation.
- The restriction on third-party libraries requires clarification before selecting navigation and persistence dependencies.
- The above moderate npm audit findings remain to be reviewed against compatible upstream fixes.

## Deliverables checklist

- [ ] Pokémon list and details working on Android and iOS
- [ ] Local persistence and network error handling documented
- [ ] Architecture and dependency choices updated to reflect the implementation
- [ ] Setup and validation instructions verified
- [ ] Relevant screenshots or a short demo video added (recommended)
- [ ] Known limitations and future improvements updated

---

*Technical assessment project. Pokémon and related names belong to their respective owners. Pokémon data is provided by the community-driven PokéAPI.*
