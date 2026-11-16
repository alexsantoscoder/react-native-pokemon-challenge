import { useRef, useState } from "react";
import { FlatList, I18nManager, StyleSheet, View } from "react-native";
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import type { Pokemon } from "@/features/pokemon/models/Pokemon";

import PokemonCard from "./PokemonCard";
import PokemonCarouselPagination from "./PokemonCarouselPagination";

interface PokemonCarouselProps {
  pokemon: Pokemon[];
  onPokemonPress: (pokemonId: number) => void;
}

export default function PokemonCarousel({ pokemon, onPokemonPress }: PokemonCarouselProps) {
  const list = useRef<FlatList<Pokemon>>(null);
  const [viewport, setViewport] = useState({ width: 0, initialIndex: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const { width, initialIndex } = viewport;
  const lastIndex = pokemon.length - 1;
  const currentIndex = Math.min(activeIndex, lastIndex);
  const isViewportReady = width > 0;

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

  const scrollToPage = (index: number) => {
    list.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.carousel}>
      <View
        style={styles.viewport}
        onLayout={measureViewport}
        testID="pokemon-carousel-viewport"
      >
        {isViewportReady && (
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

      <PokemonCarouselPagination
        currentIndex={currentIndex}
        itemCount={pokemon.length}
        isViewportReady={isViewportReady}
        onPageSelect={scrollToPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
