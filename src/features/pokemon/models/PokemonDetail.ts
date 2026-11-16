/**
 * Extends the shared Pokémon model with measurements, types, abilities,
 * and base stats for the detail screen.
 */

import type { Pokemon } from "./Pokemon";

/**
 * Represents a Pokémon base statistic.
 */
export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail extends Pokemon {
  /** Height in meters. */
  height: number;
  /** Weight in kilograms. */
  weight: number;
  /** Defaults to zero when the response has no base experience value. */
  baseExperience: number;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
}
