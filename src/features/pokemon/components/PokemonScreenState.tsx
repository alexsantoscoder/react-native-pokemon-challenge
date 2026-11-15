import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import { COLORS, CONTENT_MAX_WIDTH } from "@/config/theme";

type PokemonScreenStateProps = { message: string } & (
  | { kind: "loading" | "empty" }
  | { kind: "error"; onRetry: () => void }
);

export default function PokemonScreenState(props: PokemonScreenStateProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {props.kind === "loading" ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <Ionicons
          name={props.kind === "error" ? "alert-circle-outline" : "information-circle-outline"}
          color={props.kind === "error" ? COLORS.error : COLORS.textSecondary}
          size={24}
          accessible={false}
        />
      )}
      <Text
        style={[styles.message, props.kind === "error" && styles.errorMessage]}
        accessibilityLiveRegion="polite"
      >
        {props.message}
      </Text>
      {props.kind === "error" && (
        <Pressable
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
          onPress={props.onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again"
        >
          <Ionicons name="refresh-outline" size={20} color={COLORS.background} accessible={false} />
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  message: {
    maxWidth: CONTENT_MAX_WIDTH,
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  errorMessage: {
    color: COLORS.text,
  },
  retry: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  retryPressed: {
    backgroundColor: COLORS.primarySoft,
  },
  retryText: {
    flexShrink: 1,
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
