import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from '@/navigation/routes';

/**
 * Pokemon Stack Navigator parameters.
 */
export type PokemonStackParamList = {
  [ROUTES.POKEMON.LIST]: undefined;
  [ROUTES.POKEMON.DETAIL]: {
    pokemonId: number;
  };
};

/**
 * Main Tab Navigator parameters.
 */
export type MainTabParamList = {
  [ROUTES.TABS.POKEMON_FLOW]:
    NavigatorScreenParams<PokemonStackParamList>;
};

/**
 * Pokemon List screen props.
 */
export type PokemonListScreenProps = NativeStackScreenProps<
  PokemonStackParamList,
  typeof ROUTES.POKEMON.LIST
>;