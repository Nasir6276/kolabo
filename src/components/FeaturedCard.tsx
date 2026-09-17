import { Idea } from "@/types/idea";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const INK = "#1B1F3B";
const ACCENT = "#F2A93B";

type Props = {
  idea: Idea;
  onPress?: (idea: Idea) => void;
};

export default function FeaturedCard({ idea, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(idea)}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Trending</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {idea.title}
      </Text>
      <View style={styles.footerRow}>
        <Image
          source={{ uri: idea.postedBy.avatarUrl }}
          style={styles.avatar}
        />
        <Text style={styles.postedBy}>{idea.postedBy.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: INK,
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    justifyContent: "space-between",
    minHeight: 130,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: INK },
  title: { fontSize: 14, fontWeight: "700", color: "#FFFFFF", lineHeight: 19 },
  footerRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  avatar: { width: 20, height: 20, borderRadius: 10, marginRight: 6 },
  postedBy: { fontSize: 11, color: "#D4D7E5", fontWeight: "500" },
});
