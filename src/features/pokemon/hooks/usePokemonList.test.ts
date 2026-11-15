
/**
 * usePokemonList hook tests.
 *
 * Verifies:
 * 1. Initial loading state.
 * 2. Successful Pokémon retrieval.
 * 3. Error handling.
 * 4. Refetching data.
 * 5. Request cancellation on unmount.
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
import { usePokemonList } from "./usePokemonList";

// Repository
import { getPokemonList } from "@/features/pokemon/repositories/listRepository";

// Models
import type { Pokemon } from "@/features/pokemon/models/Pokemon";

// Mock SQLite and repository dependencies.
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

jest.mock("@/features/pokemon/repositories/listRepository");

// Typed mocked functions.
const mockUseSQLiteContext = jest.mocked(useSQLiteContext);
const mockGetPokemonList = jest.mocked(getPokemonList);

// Mock SQLite database.
const db = {} as SQLiteDatabase;

// Mock Pokémon list.
const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: "bulbasaur",
    image: "https://example.com/bulbasaur.png",
  },
  {
    id: 2,
    name: "ivysaur",
    image: "https://example.com/ivysaur.png",
  },
];

describe("usePokemonList", () => {

  beforeEach(() => {
    jest.resetAllMocks();

    mockUseSQLiteContext.mockReturnValue(db);
  });

  // 1. Initial loading
  it("starts in a loading state", async () => {

    // Keep the request pending.
    mockGetPokemonList.mockImplementation(
      () => new Promise<Pokemon[]>(() => {})
    );

    const { result } = await renderHook(
      () => usePokemonList()
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toEqual([]);

  });

  // 2. Successful request
  it("loads Pokémon successfully", async () => {

    mockGetPokemonList.mockResolvedValue(mockPokemon);

    const { result } = await renderHook(
      () => usePokemonList()
    );

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(mockPokemon);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(mockGetPokemonList).toHaveBeenCalledTimes(1);

    expect(mockGetPokemonList).toHaveBeenCalledWith(
      db,
      expect.any(AbortSignal)
    );

  });

  // 3. Error handling
  it("handles repository errors", async () => {

    mockGetPokemonList.mockRejectedValue(
      new Error("Network unavailable")
    );

    const { result } = await renderHook(
      () => usePokemonList()
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toEqual([]);

  });

  // 4. Refetching data
  it("refetches Pokémon when requested", async () => {

    mockGetPokemonList.mockResolvedValue(mockPokemon);

    const { result } = await renderHook(
      () => usePokemonList()
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetPokemonList).toHaveBeenCalledTimes(1);

    // Trigger another request.
    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(mockGetPokemonList).toHaveBeenCalledTimes(2);
    });

    expect(result.current.pokemon).toEqual(mockPokemon);

  });

  // 5. Cancellation
  it("aborts the request when the hook unmounts", async () => {

    // Keep the request pending until unmount.
    mockGetPokemonList.mockImplementation(
      () => new Promise<Pokemon[]>(() => {})
    );

    const { unmount } = await renderHook(
      () => usePokemonList()
    );

    expect(mockGetPokemonList).toHaveBeenCalledTimes(1);

    // Extract the AbortSignal passed to the repository.
    const signal = mockGetPokemonList.mock.calls[0][1];

    expect(signal?.aborted).toBe(false);

    // Simulate the component leaving the screen.
    await unmount();

    expect(signal?.aborted).toBe(true);

  });

});
