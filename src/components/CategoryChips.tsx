import { colors, radius, spacing } from "@/theme/colors";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategoryChips({
  categories,
  selected,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isActive = category === selected;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(category)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  chipTextActive: { color: "#fff" },
});
