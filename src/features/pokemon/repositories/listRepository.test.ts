
/**
 * ListRepository tests.
 *
 * Verifies:
 * 1. Successful API requests.
 * 2. SQLite offline fallback.
 * 3. Error handling when no cache exists.
 * 4. Request cancellation.
 */

import type { SQLiteDatabase } from "expo-sqlite";

// Repository
import { getPokemonList } from "./listRepository";

// API
import { fetchPokemonList } from "@/features/pokemon/apis/listApi";

// Storage
import {
  savePokemonList,
  getCachedPokemonList,
} from "@/features/pokemon/storage/pokemonStorage";

// Models
import type { Pokemon } from "@/features/pokemon/models/Pokemon";

// Mock external dependencies.
jest.mock("@/features/pokemon/apis/listApi");

jest.mock("@/features/pokemon/storage/pokemonStorage");

// Typed mocked functions.
const mockFetchPokemonList = jest.mocked(fetchPokemonList);
const mockSavePokemonList = jest.mocked(savePokemonList);
const mockGetCachedPokemonList = jest.mocked(getCachedPokemonList);

// SQLite is mocked because these tests verify repository logic.
const db = {} as SQLiteDatabase;

const cachedPokemon: Pokemon[] = [
  {
    id: 1,
    name: "bulbasaur",
    image: "https://example.com/bulbasaur.png",
  },
];

describe("getPokemonList", () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("fetches Pokémon from the API and caches the result", async () => {

    mockFetchPokemonList.mockResolvedValue({
      count: 1302,
      next: null,
      previous: null,
      results: [
        {
          name: "bulbasaur",
          url: "https://pokeapi.co/api/v2/pokemon/1/",
        },
      ],
    });

    mockSavePokemonList.mockResolvedValue(undefined);

    const result = await getPokemonList(db);

    expect(result).toEqual([
      {
        id: 1,
        name: "bulbasaur",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      },
    ]);

    expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);

    expect(mockSavePokemonList).toHaveBeenCalledWith(
      db,
      result
    );

  });

  it("returns cached Pokémon when the API fails", async () => {

    mockFetchPokemonList.mockRejectedValue(
      new Error("Network unavailable")
    );

    mockGetCachedPokemonList.mockResolvedValue(cachedPokemon);

    const result = await getPokemonList(db);

    expect(result).toEqual(cachedPokemon);

    expect(mockGetCachedPokemonList).toHaveBeenCalledWith(db);

    expect(mockSavePokemonList).not.toHaveBeenCalled();

  });

  it("throws an error when the API fails and no cache exists", async () => {

    mockFetchPokemonList.mockRejectedValue(
      new Error("Network unavailable")
    );

    mockGetCachedPokemonList.mockResolvedValue(null);

    await expect(getPokemonList(db)).rejects.toThrow(
      "Network unavailable"
    );

  });

  it("does not load cached data when the request is cancelled", async () => {

    const controller = new AbortController();

    controller.abort();

    mockFetchPokemonList.mockRejectedValue(
      new Error("Request cancelled")
    );

    await expect(
      getPokemonList(db, controller.signal)
    ).rejects.toThrow("Request cancelled");

    expect(mockGetCachedPokemonList).not.toHaveBeenCalled();

  });

});
