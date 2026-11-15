
/**
 * usePokemonDetail hook tests.
 *
 * Verifies:
 * 1. Initial loading state.
 * 2. Successful Pokémon detail retrieval.
 * 3. Error handling.
 * 4. Refetching Pokémon details.
 * 5. Request cancellation when the Pokémon ID changes.
 * 6. Request cancellation on unmount.
 */

// React Native Testing Library
import {
  renderHook,
  act,
  waitFor,
} from "@testing-library/react-native";

// Expo SQLite
import { useSQLiteContext } from "expo-sqlite";
import type { SQLiteDatabase } from "expo-sqlite";

// Hook
import { usePokemonDetail } from "./usePokemonDetail";

// Repository
import { getPokemonDetail } from "@/features/pokemon/repositories/detailRepository";

// Models
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

// Mock SQLite and repository dependencies.
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

jest.mock("@/features/pokemon/repositories/detailRepository");

// Typed mocked functions.
const mockUseSQLiteContext = jest.mocked(useSQLiteContext);
const mockGetPokemonDetail = jest.mocked(getPokemonDetail);

// Mock SQLite database.
const db = {} as SQLiteDatabase;

// Mock Pokémon details.
const mockPokemon: PokemonDetail = {
  id: 1,
  name: "bulbasaur",
  image: "https://example.com/bulbasaur.png",
  height: 0.7,
  weight: 6.9,
  baseExperience: 64,
  types: ["grass", "poison"],
  abilities: ["overgrow", "chlorophyll"],
  stats: [
    { name: "hp", value: 45 },
    { name: "attack", value: 49 },
  ],
};

describe("usePokemonDetail", () => {

  beforeEach(() => {
    jest.resetAllMocks();

    mockUseSQLiteContext.mockReturnValue(db);
  });

  // 1. Initial loading
  it("starts in a loading state", async () => {

    // Keep the request pending.
    mockGetPokemonDetail.mockImplementation(
      () => new Promise<PokemonDetail>(() => {})
    );

    const { result } = await renderHook(
      () => usePokemonDetail(1)
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();

  });

  // 2. Successful request
  it("loads Pokémon details successfully", async () => {

    mockGetPokemonDetail.mockResolvedValue(mockPokemon);

    const { result } = await renderHook(
      () => usePokemonDetail(1)
    );

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(mockPokemon);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(mockGetPokemonDetail).toHaveBeenCalledTimes(1);

    expect(mockGetPokemonDetail).toHaveBeenCalledWith(
      db,
      1,
      expect.any(AbortSignal)
    );

  });

  // 3. Error handling
  it("handles repository errors", async () => {

    mockGetPokemonDetail.mockRejectedValue(
      new Error("Network unavailable")
    );

    const { result } = await renderHook(
      () => usePokemonDetail(1)
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toBeNull();

  });

  // 4. Refetching
  it("refetches Pokémon details when requested", async () => {

    mockGetPokemonDetail.mockResolvedValue(mockPokemon);

    const { result } = await renderHook(
      () => usePokemonDetail(1)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetPokemonDetail).toHaveBeenCalledTimes(1);

    // Trigger another request.
    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(mockGetPokemonDetail).toHaveBeenCalledTimes(2);
    });

    expect(result.current.pokemon).toEqual(mockPokemon);

  });

  // 5. Cancellation when Pokémon ID changes
  it("aborts the previous request when the Pokémon ID changes", async () => {

    // Keep requests pending.
    mockGetPokemonDetail.mockImplementation(
      () => new Promise<PokemonDetail>(() => {})
    );

    const { rerender } = await renderHook(
      ({ pokemonId }: { pokemonId: number }) =>
        usePokemonDetail(pokemonId),
      {
        initialProps: { pokemonId: 1 },
      }
    );

    const firstSignal = mockGetPokemonDetail.mock.calls[0][2];

    expect(firstSignal?.aborted).toBe(false);

    // Request a different Pokémon.
    await rerender({ pokemonId: 2 });

    expect(firstSignal?.aborted).toBe(true);

    expect(mockGetPokemonDetail).toHaveBeenCalledWith(
      db,
      2,
      expect.any(AbortSignal)
    );

  });

  // 6. Cancellation on unmount
  it("aborts the request when the hook unmounts", async () => {

    // Keep the request pending.
    mockGetPokemonDetail.mockImplementation(
      () => new Promise<PokemonDetail>(() => {})
    );

    const { unmount } = await renderHook(
      () => usePokemonDetail(1)
    );

    expect(mockGetPokemonDetail).toHaveBeenCalledTimes(1);

    const signal = mockGetPokemonDetail.mock.calls[0][2];

    expect(signal?.aborted).toBe(false);

    // Simulate leaving the detail screen.
    await unmount();

    expect(signal?.aborted).toBe(true);

  });

});
