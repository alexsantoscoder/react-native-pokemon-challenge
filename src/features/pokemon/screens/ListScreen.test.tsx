
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
import { FlatList } from "react-native";

// React Native Testing Library
import {
  act,
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

const PAGE_WIDTH = 360;
const PAGE_HEIGHT = 520;

function measureCarousel(width = PAGE_WIDTH) {
  return fireEvent(screen.getByTestId("pokemon-carousel-viewport"), "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width, height: PAGE_HEIGHT } },
  });
}

function scrollToPage(index: number, width = PAGE_WIDTH) {
  return fireEvent.scroll(screen.getByTestId("pokemon-carousel"), {
    nativeEvent: {
      contentOffset: { x: index * width, y: 0 },
      layoutMeasurement: { width, height: PAGE_HEIGHT },
      contentSize: { width: mockPokemon.length * width, height: PAGE_HEIGHT },
    },
  });
}

describe("ListScreen", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePokemonList.mockReturnValue({
      ...defaultHookState,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    expect(screen.getByRole("header", { name: "Pokedex" })).toBeTruthy();

  });

  /**
   * 2. Successful Pokémon rendering.
   */
  it("renders the Pokémon list", async () => {

    const { root } = await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 360, height: 640 },
          insets: { top: 24, bottom: 16, left: 8, right: 12 },
        }}
      >
        <ListScreen navigation={navigation} route={route} />
      </SafeAreaProvider>
    );
    expect(root).toHaveStyle({
      paddingTop: 24,
      paddingBottom: 16,
      paddingLeft: 8,
      paddingRight: 12,
    });
    expect(screen.getByRole("header", { name: "Pokedex" })).toBeTruthy();
    await measureCarousel();

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
    expect(screen.getByRole("header", { name: "Pokedex" })).toBeTruthy();

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
    await measureCarousel();

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

  it("shows the padded counter and updates the page on forward and backward scrolling", async () => {
    await render(<ListScreen navigation={navigation} route={route} />);
    await measureCarousel();

    expect(screen.getByText("01 / 02")).toBeTruthy();
    expect(screen.getByLabelText("Pokémon 1 of 2")).toBeTruthy();

    await scrollToPage(1);
    expect(screen.getByText("02 / 02")).toBeTruthy();

    await scrollToPage(0);
    expect(screen.getByText("01 / 02")).toBeTruthy();
  });

  it("scrolls to adjacent pages from the arrows and disables each boundary", async () => {
    const scrollToIndex = jest.spyOn(FlatList.prototype, "scrollToIndex");
    await render(<ListScreen navigation={navigation} route={route} />);
    await measureCarousel();

    const previous = () => screen.getByRole("button", { name: "Previous Pokémon" });
    const next = () => screen.getByRole("button", { name: "Next Pokémon" });

    expect(previous()).toBeDisabled();
    expect(next()).toBeEnabled();
    await fireEvent.press(previous());
    expect(scrollToIndex).not.toHaveBeenCalled();
    await fireEvent.press(next());
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 1, animated: true });

    await scrollToPage(1);
    expect(next()).toBeDisabled();
    expect(previous()).toBeEnabled();
    await fireEvent.press(next());
    expect(scrollToIndex).toHaveBeenCalledTimes(1);
    await fireEvent.press(previous());
    expect(scrollToIndex).toHaveBeenLastCalledWith({ index: 0, animated: true });
  });

  it.each([
    { arrow: "Previous Pokémon", startPage: 1, boundary: 0 },
    { arrow: "Next Pokémon", startPage: 0, boundary: 1 },
  ])("ignores a $arrow press released at its boundary", async ({ arrow, startPage, boundary }) => {
    const scrollToIndex = jest.spyOn(FlatList.prototype, "scrollToIndex");
    await render(<ListScreen navigation={navigation} route={route} />);
    await measureCarousel();
    await scrollToPage(startPage);

    const button = () => screen.getByRole("button", { name: arrow });
    const event = { currentTarget: 1, nativeEvent: { pageX: 0, pageY: 0 }, persist: jest.fn() };
    await act(() => button().props.onResponderGrant(event));
    await scrollToPage(boundary);
    expect(button()).toBeDisabled();
    await act(() => button().props.onResponderRelease(event));

    expect(scrollToIndex).not.toHaveBeenCalled();
  });

  it("keeps the selected page after remeasurement and opens its detail", async () => {
    await render(<ListScreen navigation={navigation} route={route} />);
    await measureCarousel();
    await scrollToPage(1);
    await measureCarousel(400);

    expect(screen.getByLabelText("Pokémon 2 of 2")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "View ivysaur details" }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.POKEMON.DETAIL, { pokemonId: 2 });
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
    expect(screen.getByRole("header", { name: "Pokedex" })).toBeTruthy();

  });

});
