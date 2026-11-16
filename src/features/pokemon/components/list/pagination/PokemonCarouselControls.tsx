/**
 * Renders the adjacent-page arrows and padded page counter.
 * Arrows become available once the carousel has been measured.
 */

// Native UI and icons
import Ionicons from "@expo/vector-icons/Ionicons";
import { I18nManager, Pressable, StyleSheet, Text, View } from "react-native";

// App palette
import { COLORS } from "@/config/theme";

interface PokemonCarouselControlsProps {
  currentIndex: number;
  itemCount: number;
  isViewportReady: boolean;
  onPageSelect: (index: number) => void;
}

export default function PokemonCarouselControls({
  currentIndex,
  itemCount,
  isViewportReady,
  onPageSelect,
}: PokemonCarouselControlsProps) {
  const currentPage = currentIndex + 1;

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
  );
}

const styles = StyleSheet.create({
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
});
