
import { fetchPokemonDetail } from "@/features/pokemon/apis/detailApi";

import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

/**
 * DetailRepository - Retrieves Pokémon details
 * and transforms the API response into a domain model.
 */
export async function getPokemonDetail(
  pokemonId: number,
  signal?: AbortSignal
): Promise<PokemonDetail> {

  const data = await fetchPokemonDetail(
    pokemonId,
    signal
  );

  return {
    id: data.id,
    name: data.name,

    image:
      data.sprites.other["official-artwork"].front_default
      ?? data.sprites.front_default
      ?? "",

    // Convert decimeters to meters.
    height: data.height / 10,

    // Convert hectograms to kilograms.
    weight: data.weight / 10,

    baseExperience: data.base_experience ?? 0,

    types: [...data.types]
      .sort((a, b) => a.slot - b.slot)
      .map((item) => item.type.name),

    abilities: [...data.abilities]
      .sort((a, b) => a.slot - b.slot)
      .map((item) => item.ability.name),

    stats: data.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
}
