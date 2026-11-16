/**
 * Shows carousel progress with up to four decorative dots.
 * The page counter supplies the exact position for assistive technology.
 */

// Native UI
import { StyleSheet, View } from "react-native";

// App palette
import { COLORS } from "@/config/theme";

interface PokemonCarouselProgressDotsProps {
  currentIndex: number;
  itemCount: number;
}

export default function PokemonCarouselProgressDots({
  currentIndex,
  itemCount,
}: PokemonCarouselProgressDotsProps) {
  // Group pages across at most four dots while the counter shows the exact page.
  const dotCount = Math.min(itemCount, 4);
  const activeDot = Math.floor(currentIndex * dotCount / itemCount);

  return (
    <View
      style={styles.dots}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: dotCount }, (_, index) => (
        <View key={index} style={[styles.dot, index === activeDot && styles.activeDot]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.divider,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
});
