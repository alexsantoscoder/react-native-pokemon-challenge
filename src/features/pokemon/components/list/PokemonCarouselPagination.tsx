/**
 * Lays out the carousel controls and progress dots beneath the cards.
 */

// Native layout
import { StyleSheet, View } from "react-native";

// App layout
import { CONTENT_MAX_WIDTH } from "@/config/theme";

// Pagination components
import PokemonCarouselControls from "./pagination/PokemonCarouselControls";
import PokemonCarouselProgressDots from "./pagination/PokemonCarouselProgressDots";

interface PokemonCarouselPaginationProps {
  currentIndex: number;
  itemCount: number;
  isViewportReady: boolean;
  onPageSelect: (index: number) => void;
}

export default function PokemonCarouselPagination({
  currentIndex,
  itemCount,
  isViewportReady,
  onPageSelect,
}: PokemonCarouselPaginationProps) {
  return (
    <View style={styles.pagination}>
      <PokemonCarouselControls
        currentIndex={currentIndex}
        itemCount={itemCount}
        isViewportReady={isViewportReady}
        onPageSelect={onPageSelect}
      />
      <PokemonCarouselProgressDots currentIndex={currentIndex} itemCount={itemCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 24,
    gap: 10,
  },
});
