
import type { Pokemon } from "./Pokemon";

/**
 * Represents a Pokémon base statistic.
 */
export interface PokemonStat {
  name: string;
  value: number;
}

/**
 * PokemonDetail - Domain model containing
 * the selected Pokémon's complete information.
 */
export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  baseExperience: number;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
}
