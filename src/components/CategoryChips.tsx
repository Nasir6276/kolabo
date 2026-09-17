import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const INK = "#1B1F3B";
const ACCENT = "#F2A93B";

type Props = {
  categories: string[];
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
  container: { paddingHorizontal: 20, gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEF1FB",
    marginRight: 8,
  },
  chipActive: { backgroundColor: INK },
  chipText: { fontSize: 13, fontWeight: "600", color: INK },
  chipTextActive: { color: ACCENT },
});
