
/**
 * DetailRepository tests.
 *
 * Verifies:
 * 1. Successful API requests and caching.
 * 2. PokéAPI response transformation.
 * 3. SQLite offline fallback.
 * 4. Error handling when no cache exists.
 * 5. Request cancellation.
 */

import type { SQLiteDatabase } from "expo-sqlite";

// Repository
import { getPokemonDetail } from "./detailRepository";

// API
import { fetchPokemonDetail } from "@/features/pokemon/apis/detailApi";

// Storage
import {
  savePokemonDetail,
  getCachedPokemonDetail,
} from "@/features/pokemon/storage/pokemonStorage";

// Models
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

// Mock external dependencies.
jest.mock("@/features/pokemon/apis/detailApi");

jest.mock("@/features/pokemon/storage/pokemonStorage");

// Typed mocked functions.
const mockFetchPokemonDetail = jest.mocked(fetchPokemonDetail);
const mockSavePokemonDetail = jest.mocked(savePokemonDetail);
const mockGetCachedPokemonDetail = jest.mocked(getCachedPokemonDetail);

// SQLite is mocked because these tests verify repository logic.
const db = {} as SQLiteDatabase;

// Previously cached Pokémon details.
const cachedPokemon: PokemonDetail = {
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

// Mock response matching the PokéAPI response type.
const apiResponse: Awaited<
  ReturnType<typeof fetchPokemonDetail>
> = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  base_experience: 64,

  sprites: {
    front_default: "https://example.com/default.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/artwork.png",
      },
    },
  },

  types: [
    {
      slot: 2,
      type: {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/",
      },
    },
    {
      slot: 1,
      type: {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/",
      },
    },
  ],

  abilities: [
    {
      slot: 2,
      is_hidden: true,
      ability: {
        name: "chlorophyll",
        url: "https://pokeapi.co/api/v2/ability/34/",
      },
    },
    {
      slot: 1,
      is_hidden: true,
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/",
      },
    },
  ],

  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/",
      },
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: "attack",
        url: "https://pokeapi.co/api/v2/stat/2/",
      },
    },
  ],
};

describe("getPokemonDetail", () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("fetches Pokémon details from the API and caches the result", async () => {

    mockFetchPokemonDetail.mockResolvedValue(apiResponse);
    mockSavePokemonDetail.mockResolvedValue(undefined);

    const result = await getPokemonDetail(db, 1);

    expect(result.id).toBe(1);
    expect(result.name).toBe("bulbasaur");

    expect(result.image).toBe(
      "https://example.com/artwork.png"
    );

    expect(mockFetchPokemonDetail).toHaveBeenCalledWith(
      1,
      undefined
    );

    expect(mockSavePokemonDetail).toHaveBeenCalledWith(
      db,
      result
    );

  });

  it("transforms PokéAPI data into the PokemonDetail model", async () => {

    mockFetchPokemonDetail.mockResolvedValue(apiResponse);
    mockSavePokemonDetail.mockResolvedValue(undefined);

    const result = await getPokemonDetail(db, 1);

    // Convert decimeters to meters.
    expect(result.height).toBe(0.7);

    // Convert hectograms to kilograms.
    expect(result.weight).toBe(6.9);

    expect(result.baseExperience).toBe(64);

    // Types must be sorted by slot.
    expect(result.types).toEqual([
      "grass",
      "poison",
    ]);

    // Abilities must be sorted by slot.
    expect(result.abilities).toEqual([
      "overgrow",
      "chlorophyll",
    ]);

    // Transform base stats into the domain model.
    expect(result.stats).toEqual([
      { name: "hp", value: 45 },
      { name: "attack", value: 49 },
    ]);

  });

  it("returns cached details when the API fails", async () => {

    mockFetchPokemonDetail.mockRejectedValue(
      new Error("Network unavailable")
    );

    mockGetCachedPokemonDetail.mockResolvedValue(cachedPokemon);

    const result = await getPokemonDetail(db, 1);

    expect(result).toEqual(cachedPokemon);

    expect(mockGetCachedPokemonDetail).toHaveBeenCalledWith(
      db,
      1
    );

    expect(mockSavePokemonDetail).not.toHaveBeenCalled();

  });

  it("throws an error when the API fails and no cache exists", async () => {

    mockFetchPokemonDetail.mockRejectedValue(
      new Error("Network unavailable")
    );

    mockGetCachedPokemonDetail.mockResolvedValue(null);

    await expect(
      getPokemonDetail(db, 1)
    ).rejects.toThrow("Network unavailable");

  });

  it("does not load cached details when the request is cancelled", async () => {

    const controller = new AbortController();

    controller.abort();

    mockFetchPokemonDetail.mockRejectedValue(
      new Error("Request cancelled")
    );

    await expect(
      getPokemonDetail(db, 1, controller.signal)
    ).rejects.toThrow("Request cancelled");

    expect(mockGetCachedPokemonDetail).not.toHaveBeenCalled();

  });

});
