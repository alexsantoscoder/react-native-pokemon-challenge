
/**
 * DetailApi tests.
 *
 * Verifies:
 * 1. Correct PokéAPI detail endpoint.
 * 2. Successful API response.
 * 3. HTTP error handling.
 * 4. Network error handling.
 * 5. AbortSignal forwarding.
 * 6. Invalid Pokémon ID validation.
 */

// API
import { fetchPokemonDetail } from "./detailApi";

// Configuration
import { API_BASE_URL } from "@/config/api";

// Mock response matching the actual API return type.
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
      slot: 1,
      type: {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/",
      },
    },
    {
      slot: 2,
      type: {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/",
      },
    },
  ],

  abilities: [
    {
      slot: 1,
      is_hidden: false,
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/",
      },
    },
    {
      slot: 2,
      is_hidden: true,
      ability: {
        name: "chlorophyll",
        url: "https://pokeapi.co/api/v2/ability/34/",
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

describe("fetchPokemonDetail", () => {

  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    // Spy on fetch without replacing its TypeScript signature.
    mockFetch = jest.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    // Restore the original fetch implementation.
    mockFetch.mockRestore();
  });

  /**
   * 1. Correct API endpoint.
   */
  it("requests the correct Pokémon details", async () => {

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(apiResponse),
    } as unknown as Response);

    await fetchPokemonDetail(1);

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/pokemon/1`,
      { signal: undefined }
    );

  });

  /**
   * 2. Successful API response.
   */
  it("returns Pokémon details successfully", async () => {

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(apiResponse),
    } as unknown as Response);

    const result = await fetchPokemonDetail(1);

    expect(result).toEqual(apiResponse);
    expect(result.name).toBe("bulbasaur");
    expect(result.types).toHaveLength(2);
    expect(result.abilities).toHaveLength(2);

  });

  /**
   * 3. HTTP error handling.
   */
  it("throws an error when the server returns an HTTP error", async () => {

    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    } as unknown as Response);

    await expect(
      fetchPokemonDetail(999999)
    ).rejects.toThrow();

  });

  /**
   * 4. Network error handling.
   */
  it("propagates network errors", async () => {

    mockFetch.mockRejectedValue(
      new Error("Network unavailable")
    );

    await expect(
      fetchPokemonDetail(1)
    ).rejects.toThrow("Network unavailable");

  });

  /**
   * 5. AbortSignal forwarding.
   */
  it("forwards the AbortSignal to fetch", async () => {

    const controller = new AbortController();

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(apiResponse),
    } as unknown as Response);

    await fetchPokemonDetail(1, controller.signal);

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/pokemon/1`,
      { signal: controller.signal }
    );

  });

  /**
   * 6. Invalid Pokémon ID validation.
   */
  it("rejects invalid Pokémon IDs without making a request", async () => {

    const invalidIds = [0, -1, 1.5, NaN, Infinity];

    for (const pokemonId of invalidIds) {
      await expect(
        fetchPokemonDetail(pokemonId)
      ).rejects.toThrow();
    }

    expect(mockFetch).not.toHaveBeenCalled();

  });

});
