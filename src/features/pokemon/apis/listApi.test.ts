
/**
 * ListApi tests.
 *
 * Verifies:
 * 1. Correct PokéAPI endpoint.
 * 2. Successful API response.
 * 3. HTTP error handling.
 * 4. Network error handling.
 * 5. AbortSignal forwarding.
 */

// API
import { fetchPokemonList } from "./listApi";

// Configuration
import { API_BASE_URL } from "@/config/api";

// Mock PokéAPI response.
const apiResponse: Awaited<
  ReturnType<typeof fetchPokemonList>
> = {
  count: 1302,
  next: null,
  previous: null,
  results: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/",
    },
    {
      name: "ivysaur",
      url: "https://pokeapi.co/api/v2/pokemon/2/",
    },
  ],
};

describe("fetchPokemonList", () => {

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
  it("requests the first 20 Pokémon", async () => {

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(apiResponse),
    } as unknown as Response);

    await fetchPokemonList();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/pokemon?limit=20&offset=0`,
      { signal: undefined }
    );

  });

  /**
   * 2. Successful API response.
   */
  it("returns Pokémon data successfully", async () => {

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(apiResponse),
    } as unknown as Response);

    const result = await fetchPokemonList();

    expect(result).toEqual(apiResponse);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].name).toBe("bulbasaur");

  });

  /**
   * 3. HTTP error handling.
   */
  it("throws an error when the server returns an HTTP error", async () => {

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    } as unknown as Response);

    await expect(
      fetchPokemonList()
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
      fetchPokemonList()
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

    await fetchPokemonList(controller.signal);

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/pokemon?limit=20&offset=0`,
      { signal: controller.signal }
    );

  });

});
