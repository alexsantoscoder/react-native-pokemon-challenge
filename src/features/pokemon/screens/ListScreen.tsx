import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";
import PokemonCard from "@/features/pokemon/components/PokemonCard";
import PokemonScreenState from "@/features/pokemon/components/PokemonScreenState";
import { usePokemonList } from "@/features/pokemon/hooks/usePokemonList";
import type { Pokemon } from "@/features/pokemon/models/Pokemon";
import { ROUTES } from "@/navigation/routes";
import type { PokemonScreenProps } from "@/navigation/types";

type ScreenProps = PokemonScreenProps<typeof ROUTES.POKEMON.LIST>;

interface PokemonCarouselProps {
  pokemon: Pokemon[];
  onPokemonPress: (pokemonId: number) => void;
}

const PokemonCarousel = ({ pokemon, onPokemonPress }: PokemonCarouselProps) => {
  const list = useRef<FlatList<Pokemon>>(null);
  const [viewport, setViewport] = useState({ width: 0, initialIndex: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const { width, initialIndex } = viewport;
  const lastIndex = pokemon.length - 1;
  const currentIndex = Math.min(activeIndex, lastIndex);
  const dotCount = Math.min(pokemon.length, 4);
  const activeDot = Math.floor(currentIndex * dotCount / pokemon.length);

  const measureViewport = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width } = nativeEvent.layout;
    setViewport((previous) =>
      previous.width === width ? previous : { width, initialIndex: currentIndex }
    );
  };

  const updatePage = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;

    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const offset = I18nManager.isRTL
      ? contentSize.width - layoutMeasurement.width - contentOffset.x
      : contentOffset.x;
    const index = Math.max(0, Math.min(Math.round(offset / width), lastIndex));

    setActiveIndex((previous) => previous === index ? previous : index);
  };

  const renderArrow = (direction: "previous" | "next") => {
    const isPrevious = direction === "previous";
    const target = currentIndex + (isPrevious ? -1 : 1);
    const disabled = width <= 0 || target < 0 || target > lastIndex;

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

          list.current?.scrollToIndex({ index: target, animated: true });
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
    <View style={styles.carousel}>
      <View
        style={styles.viewport}
        onLayout={measureViewport}
        testID="pokemon-carousel-viewport"
      >
        {width > 0 && (
          <FlatList
            key={width}
            ref={list}
            style={styles.list}
            data={pokemon}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.page, { width }]}>
                <PokemonCard pokemon={item} onPress={onPokemonPress} />
              </View>
            )}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            initialScrollIndex={Math.min(initialIndex, lastIndex)}
            initialNumToRender={3}
            windowSize={5}
            onScroll={updatePage}
            scrollEventThrottle={16}
            testID="pokemon-carousel"
          />
        )}
      </View>

      <View style={styles.pagination}>
        <View style={styles.controls}>
          {renderArrow("previous")}
          <Text
            style={styles.counter}
            accessibilityLabel={`Pokémon ${currentIndex + 1} of ${pokemon.length}`}
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.currentPage}>{String(currentIndex + 1).padStart(2, "0")}</Text>
            {" / "}{String(pokemon.length).padStart(2, "0")}
          </Text>
          {renderArrow("next")}
        </View>

        <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {Array.from({ length: dotCount }, (_, index) => (
            <View key={index} style={[styles.dot, index === activeDot && styles.activeDot]} />
          ))}
        </View>
      </View>
    </View>
  );
};

const ListScreen = ({ navigation }: ScreenProps) => {
  const { pokemon, isLoading, error, refetch } = usePokemonList();
  const { top, bottom, left, right } = useSafeAreaInsets();

  const gotoDetail = useCallback((pokemonId: number) => {
    navigation.navigate(ROUTES.POKEMON.DETAIL, { pokemonId });
  }, [navigation]);

  return (
    <View style={[
      styles.container,
      { paddingTop: top, paddingBottom: bottom, paddingLeft: left, paddingRight: right },
    ]}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>Pokedex</Text>
      </View>

      {isLoading ? (
        <PokemonScreenState kind="loading" message="Loading Pokémon..." />
      ) : error ? (
        <PokemonScreenState kind="error" message={error} onRetry={refetch} />
      ) : pokemon.length === 0 ? (
        <PokemonScreenState kind="empty" message="No Pokémon found." />
      ) : (
        <PokemonCarousel pokemon={pokemon} onPokemonPress={gotoDetail} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignSelf: "center",
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "800",
  },
  carousel: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    paddingVertical: 8,
  },
  viewport: {
    flexShrink: 1,
  },
  list: {
    flexGrow: 0,
  },
  page: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
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

export default ListScreen;
