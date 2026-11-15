
/**
 * ListScreen component tests.
 *
 * Verifies:
 * 1. Loading state.
 * 2. Successful Pokémon list rendering.
 * 3. Error state.
 * 4. Retry functionality.
 * 5. Navigation to Pokémon details.
 * 6. Empty state.
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
import ListScreen from "./ListScreen";

// Hook
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";

// Navigation
import { ROUTES } from "@/navigation/routes";

// Models
import type { Pokemon } from "@/features/pokemon/models/Pokemon";

jest.mock("@expo/vector-icons/Ionicons", () => () => null);

// Mock the hook without loading its actual implementation.
jest.mock("@/features/pokemon/hooks/usePokemonList", () => ({
  usePokemonList: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => {
  const { default: mockSafeAreaContext } = jest.requireActual(
    "react-native-safe-area-context/jest/mock"
  );
  return mockSafeAreaContext;
});

// Typed mocked hook.
const mockUsePokemonList = jest.mocked(usePokemonList);

// Mock navigation.
const mockNavigate = jest.fn();

// Use the screen's existing navigation prop types.
type ListScreenProps = ComponentProps<typeof ListScreen>;

const navigation = {
  navigate: mockNavigate,
} as unknown as ListScreenProps["navigation"];

const route = {
  key: "pokemon-list",
  name: ROUTES.POKEMON.LIST,
} as ListScreenProps["route"];

// Mock Pokémon data.
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

// Mock refetch callback.
const mockRefetch = jest.fn();

// Default successful hook state.
const defaultHookState: ReturnType<typeof usePokemonList> = {
  pokemon: mockPokemon,
  isLoading: false,
  error: null,
  refetch: mockRefetch,
};

describe("ListScreen", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePokemonList.mockReturnValue({
      ...defaultHookState,
    });
  });

  /**
   * 1. Loading state.
   */
  it("displays a loading indicator", async () => {

    mockUsePokemonList.mockReturnValue({
      ...defaultHookState,
      pokemon: [],
      isLoading: true,
    });

    await render(
      <ListScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText("Loading Pokémon...")
    ).toBeTruthy();

  });

  /**
   * 2. Successful Pokémon rendering.
   */
  it("renders the Pokémon list", async () => {

    await render(
      <ListScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText("bulbasaur")
    ).toBeTruthy();

    expect(
      screen.getByText("ivysaur")
    ).toBeTruthy();

  });

  /**
   * 3. Error handling.
   */
  it("displays an error message", async () => {

    mockUsePokemonList.mockReturnValue({
      ...defaultHookState,
      pokemon: [],
      error: "Network unavailable",
    });

    await render(
      <ListScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText("Network unavailable")
    ).toBeTruthy();

  });

  /**
   * 4. Retry functionality.
   */
  it("calls refetch when the retry button is pressed", async () => {

    mockUsePokemonList.mockReturnValue({
      ...defaultHookState,
      pokemon: [],
      error: "Network unavailable",
    });

    await render(
      <ListScreen navigation={navigation} route={route} />
    );

    await fireEvent.press(
      screen.getByText("Try again")
    );

    expect(mockRefetch).toHaveBeenCalledTimes(1);

  });

  /**
   * 5. Navigation to Pokémon details.
   */
  it("navigates to the selected Pokémon", async () => {

    await render(
      <ListScreen navigation={navigation} route={route} />
    );

    await fireEvent.press(
      screen.getByRole("button", {
        name: "View bulbasaur details",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      ROUTES.POKEMON.DETAIL,
      { pokemonId: 1 }
    );

  });

  /**
   * 6. Empty list handling.
   */
  it("displays an empty-state message", async () => {

    mockUsePokemonList.mockReturnValue({
      ...defaultHookState,
      pokemon: [],
    });

    await render(
      <ListScreen navigation={navigation} route={route} />
    );

    expect(
      screen.getByText("No Pokémon found.")
    ).toBeTruthy();

  });

});
