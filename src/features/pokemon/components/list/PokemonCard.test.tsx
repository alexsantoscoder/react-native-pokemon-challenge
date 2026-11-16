/**
 * Verifies that the card renders the Pokémon's name, artwork, and formatted
 * number and passes the correct ID to its press callback.
 */

// React Native Testing Library
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";

// Component
import PokemonCard from "./PokemonCard";

// Pokémon model
import type { Pokemon } from "@/features/pokemon/models/Pokemon";

jest.mock("@expo/vector-icons/Ionicons", () => () => null);

// Mock Pokémon data.
const mockPokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  image:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
};

describe("PokemonCard", () => {

  it("renders the Pokémon name correctly", async () => {

    await render(
      <PokemonCard
        pokemon={mockPokemon}
        onPress={jest.fn()}
      />
    );

    expect(
      screen.getByText("bulbasaur")
    ).toBeTruthy();

  });

  it("renders the correct Pokémon image", async () => {

    await render(
      <PokemonCard
        pokemon={mockPokemon}
        onPress={jest.fn()}
      />
    );

    const image = screen.getByLabelText("bulbasaur");

    expect(image.props.source).toEqual({
      uri: mockPokemon.image,
    });

  });

  it("renders the Pokémon ID with three digits", async () => {

    await render(
      <PokemonCard
        pokemon={mockPokemon}
        onPress={jest.fn()}
      />
    );

    expect(
      screen.getByText("#001")
    ).toBeTruthy();

  });

  it("calls onPress with the correct Pokémon ID", async () => {

    const mockOnPress = jest.fn();

    await render(
      <PokemonCard
        pokemon={mockPokemon}
        onPress={mockOnPress}
      />
    );

    const card = screen.getByRole("button", {
      name: "View bulbasaur details",
    });

    await fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledTimes(1);

    expect(mockOnPress).toHaveBeenCalledWith(1);

  });

});
