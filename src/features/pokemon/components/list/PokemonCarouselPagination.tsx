/**
 * Renders the carousel arrows, current page count, and progress dots.
 * Arrows request an adjacent page once the carousel has been measured.
 */

// Native UI and icons
import Ionicons from "@expo/vector-icons/Ionicons";
import { I18nManager, Pressable, StyleSheet, Text, View } from "react-native";

// App theme
import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";

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
  const currentPage = currentIndex + 1;
  // Group pages across at most four dots while the counter shows the exact page.
  const dotCount = Math.min(itemCount, 4);
  const activeDot = Math.floor(currentIndex * dotCount / itemCount);

  const renderArrow = (direction: "previous" | "next") => {
    const isPrevious = direction === "previous";
    const target = currentIndex + (isPrevious ? -1 : 1);
    const disabled = !isViewportReady || target < 0 || target >= itemCount;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.arrow,
          disabled && styles.arrowDisabled,
          pressed && styles.arrowPressed,
        ]}
        onPress={() => {
          // Scrolling can disable this arrow while a press is still in progress.
          if (disabled) return;

          onPageSelect(target);
        }}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={isPrevious ? "Previous Pokémon" : "Next Pokémon"}
        accessibilityState={{ disabled }}
      >
        <Ionicons
          name={isPrevious === I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
          size={22}
          color={disabled ? COLORS.textMuted : COLORS.primarySoft}
          accessible={false}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.pagination}>
      <View style={styles.controls}>
        {renderArrow("previous")}
        <Text
          style={styles.counter}
          accessibilityLabel={`Pokémon ${currentPage} of ${itemCount}`}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.currentPage}>{String(currentPage).padStart(2, "0")}</Text>
          {" / "}{String(itemCount).padStart(2, "0")}
        </Text>
        {renderArrow("next")}
      </View>

      <View
        style={styles.dots}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {Array.from({ length: dotCount }, (_, index) => (
          <View key={index} style={[styles.dot, index === activeDot && styles.activeDot]} />
        ))}
      </View>
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
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  arrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowDisabled: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  arrowPressed: {
    backgroundColor: COLORS.surface,
  },
  counter: {
    flex: 1,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  currentPage: {
    color: COLORS.primarySoft,
  },
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
