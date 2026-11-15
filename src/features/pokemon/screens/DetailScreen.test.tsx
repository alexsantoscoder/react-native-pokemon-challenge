
/**
 * DetailScreen component tests.
 *
 * Verifies:
 * 1. Loading state.
 * 2. Successful Pokémon detail rendering.
 * 3. Error handling.
 * 4. Retry functionality.
 * 5. Empty state.
 */

// React
import type { ComponentProps } from "react";

// React Native Testing Library
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";

// Screen
import DetailScreen from "./DetailScreen";

// Hook
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";

// Navigation
import { ROUTES } from "@/navigation/routes";

// Models
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

// Mock the hook without loading SQLite dependencies.
jest.mock("@/features/pokemon/hooks/usePokemonDetail", () => ({
  usePokemonDetail: jest.fn(),
}));

// Typed mocked hook.
const mockUsePokemonDetail = jest.mocked(usePokemonDetail);

// Use the screen's existing navigation prop types.
type DetailScreenProps = ComponentProps<typeof DetailScreen>;

// Mock navigation.
const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as DetailScreenProps["navigation"];

// Mock route with a Pokémon ID.
const route = {
  key: "pokemon-detail",
  name: ROUTES.POKEMON.DETAIL,
  params: {
    pokemonId: 1,
  },
} as DetailScreenProps["route"];

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

// Mock refetch callback.
const mockRefetch = jest.fn();

// Default successful hook state.
const defaultHookState: ReturnType<typeof usePokemonDetail> = {
  pokemon: mockPokemon,
  isLoading: false,
  error: null,
  refetch: mockRefetch,
};

describe("DetailScreen", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePokemonDetail.mockReturnValue({
      ...defaultHookState,
    });
  });

  /**
   * 1. Loading state.
   */
  it("displays a loading indicator", async () => {

    mockUsePokemonDetail.mockReturnValue({
      ...defaultHookState,
      pokemon: null,
      isLoading: true,
    });

    await render(
      <DetailScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText(/loading pokémon/i)
    ).toBeTruthy();

  });

  /**
   * 2. Successful detail rendering.
   */
  it("renders Pokémon details correctly", async () => {

    await render(
      <DetailScreen navigation={navigation} route={route} />
    );

    // Pokémon name.
    expect(
      screen.getByText(/bulbasaur/i)
    ).toBeTruthy();

    // Pokémon types.
    expect(
      screen.getByText(/grass/i)
    ).toBeTruthy();

    expect(
      screen.getByText(/poison/i)
    ).toBeTruthy();

    // Pokémon abilities.
    expect(
      screen.getByText(/overgrow/i)
    ).toBeTruthy();

    expect(
      screen.getByText(/chlorophyll/i)
    ).toBeTruthy();

    // Pokémon stats.
    expect(
      screen.getByText(/hp/i)
    ).toBeTruthy();

    expect(
      screen.getByText(/attack/i)
    ).toBeTruthy();

    // Verify the correct Pokémon ID was requested.
    expect(mockUsePokemonDetail).toHaveBeenCalledWith(1);

  });

  /**
   * 3. Error handling.
   */
  it("displays an error message", async () => {

    mockUsePokemonDetail.mockReturnValue({
      ...defaultHookState,
      pokemon: null,
      error: "Network unavailable",
    });

    await render(
      <DetailScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText("Network unavailable")
    ).toBeTruthy();

  });

  /**
   * 4. Retry functionality.
   */
  it("calls refetch when the retry button is pressed", async () => {

    mockUsePokemonDetail.mockReturnValue({
      ...defaultHookState,
      pokemon: null,
      error: "Network unavailable",
    });

    await render(
      <DetailScreen navigation={navigation} route={route} />
    );

    await fireEvent.press(
      screen.getByText(/try again|retry/i)
    );

    expect(mockRefetch).toHaveBeenCalledTimes(1);

  });

  /**
   * 5. Empty state.
   */
  it("displays an empty state when Pokémon details are missing", async () => {

    mockUsePokemonDetail.mockReturnValue({
      ...defaultHookState,
      pokemon: null,
    });

    await render(
      <DetailScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText(/not found|no pokémon/i)
    ).toBeTruthy();

  });

});
