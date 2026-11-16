import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { COLORS } from "@/config/theme";
import type { PokemonDetail } from "@/features/pokemon/models/PokemonDetail";

type PokemonDetailAttributesProps = Pick<PokemonDetail, "height" | "weight" | "baseExperience">;

export default function PokemonDetailAttributes({
  height,
  weight,
  baseExperience,
}: PokemonDetailAttributesProps) {
  const { fontScale } = useWindowDimensions();

  const attributes = [
    { label: "Height", value: `${height.toFixed(1)} m`, icon: "resize-outline" },
    { label: "Weight", value: `${weight.toFixed(1)} kg`, icon: "scale-outline" },
    { label: "Base XP", value: baseExperience, icon: "flash-outline" },
  ] as const;

  return (
    <View style={styles.attributes}>
      {attributes.map(({ label, value, icon }) => (
        <View key={label} style={[styles.attribute, { flexBasis: 88 * fontScale }]}>
          <Ionicons name={icon} size={20} color={COLORS.textSecondary} accessible={false} />
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  attributes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attribute: {
    flexGrow: 1,
    maxWidth: "100%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  value: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
