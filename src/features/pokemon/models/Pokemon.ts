/**
 * Defines the identity and artwork shared by the list and detail screens.
 */
export interface Pokemon {
  id: number;
  name: string;
  /** Artwork URL. An empty string means no artwork is available. */
  image: string;
}
