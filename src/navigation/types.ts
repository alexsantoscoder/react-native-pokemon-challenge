
/**
 * Navigation Types - TypeScript definitions for application navigation.
 *
 * Provides:
 * 1. Strongly typed routes and navigation parameters.
 * 2. Type-safe navigation between Pokémon screens.
 * 3. Support for nested stack and tab navigators.
 * 4. Reusable generic types for screen navigation props.
 */

// React Navigation types
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Application route constants
import { ROUTES } from '@/navigation/routes';

/**
 * Defines the available Pokémon stack screens
 * and the parameters required by each route.
 */
export type PokemonStackParamList = {
  [ROUTES.POKEMON.LIST]: undefined;
  [ROUTES.POKEMON.DETAIL]: {
    pokemonId: number;
  };
};

/**
 * Defines the main tab navigator's routes,
 * including the nested Pokémon stack.
 */
export type MainTabParamList = {
  [ROUTES.TABS.POKEMON_FLOW]: NavigatorScreenParams<PokemonStackParamList>;
};

/**
 * Reusable generic type for Pokémon stack screen props.
 *
 * T represents a route name from PokemonStackParamList.
 * Automatically provides the correct navigation and route
 * types based on the selected screen.
 *
 * Example:
 * PokemonScreenProps<typeof ROUTES.POKEMON.DETAIL>
 */
export type PokemonScreenProps<
  T extends keyof PokemonStackParamList
> = NativeStackScreenProps<PokemonStackParamList, T>;
