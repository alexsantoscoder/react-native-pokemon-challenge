/**
 * Centralizes the route names shared by navigator registration, navigation
 * calls, and route parameter types.
 */

export const ROUTES = {

  // Pokémon stack routes
  POKEMON: {
    LIST: 'PokemonList',
    DETAIL: 'PokemonDetail',
  },

  // Root tab routes
  TABS: {
    POKEMON_FLOW: 'PokemonFlow',
  }

} as const;
