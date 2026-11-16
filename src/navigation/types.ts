/**
 * Defines route parameters for the root tab and nested Pokémon stack.
 * Screens use these types to get the route and navigation props for their route.
 */

// React Navigation types
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Application route constants
import { ROUTES } from '@/navigation/routes';

/**
 * The list opens without parameters. Details require the selected Pokémon ID.
 */
export type PokemonStackParamList = {
  [ROUTES.POKEMON.LIST]: undefined;
  [ROUTES.POKEMON.DETAIL]: {
    pokemonId: number;
  };
};

/**
 * Allows the root tab to target a screen inside the Pokémon stack.
 */
export type MainTabParamList = {
  [ROUTES.TABS.POKEMON_FLOW]: NavigatorScreenParams<PokemonStackParamList>;
};

/**
 * Resolves the screen props for a Pokémon route, such as
 * `PokemonScreenProps<typeof ROUTES.POKEMON.DETAIL>`.
 */
export type PokemonScreenProps<
  T extends keyof PokemonStackParamList
> = NativeStackScreenProps<PokemonStackParamList, T>;
