import { Idea } from "@/types/idea";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const INK = "#1B1F3B";
const ACCENT = "#F2A93B";
const MUTED = "#6B7280";

type Props = {
  idea: Idea;
  onPress?: (idea: Idea) => void;
};

export default function IdeaCard({ idea, onPress }: Props) {
  const rolesFilled = idea.rolesTotal - idea.rolesOpen;
  const progress = idea.rolesTotal > 0 ? rolesFilled / idea.rolesTotal : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(idea)}
    >
      <View style={styles.headerRow}>
        <Image
          source={{ uri: idea.postedBy.avatarUrl }}
          style={styles.avatar}
        />
        <Text style={styles.postedBy}>{idea.postedBy.name}</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {idea.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {idea.description}
      </Text>

      <View style={styles.tagsRow}>
        {idea.categories.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.rolesText}>
          {idea.rolesOpen === 0
            ? "Team full"
            : `${idea.rolesOpen} role${idea.rolesOpen > 1 ? "s" : ""} open`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  postedBy: { fontSize: 12, color: MUTED, fontWeight: "500" },
  title: { fontSize: 16, fontWeight: "700", color: INK, marginBottom: 4 },
  description: { fontSize: 13, color: MUTED, lineHeight: 18, marginBottom: 10 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  tag: {
    backgroundColor: "#EEF1FB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 11, fontWeight: "600", color: INK },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: "#EEF1FB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: ACCENT, borderRadius: 3 },
  rolesText: { fontSize: 11, fontWeight: "600", color: MUTED },
});
