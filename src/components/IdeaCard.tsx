import { colors, radius, spacing } from "@/theme/colors";
import { Idea } from "@/types/idea";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  idea: Idea;
  onPress?: (idea: Idea) => void;
};

export default function IdeaCard({ idea, onPress }: Props) {
  const rolesFilled = idea.rolesTotal - idea.rolesOpen;
  const progress = idea.rolesTotal > 0 ? rolesFilled / idea.rolesTotal : 0;
  const isFull = idea.rolesOpen === 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(idea)}
    >
      <View style={styles.headerRow}>
        <View style={styles.posterRow}>
          <Image
            source={{ uri: idea.postedBy.avatarUrl }}
            style={styles.avatar}
          />
          <Text style={styles.postedBy}>{idea.postedBy.name}</Text>
        </View>
        <View style={[styles.statusPill, isFull && styles.statusPillFull]}>
          <Text style={[styles.statusText, isFull && styles.statusTextFull]}>
            {isFull ? "Team full" : `${idea.rolesOpen} open`}
          </Text>
        </View>
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

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  posterRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 22, height: 22, borderRadius: 11, marginRight: spacing.sm },
  postedBy: { fontSize: 12, color: colors.textSecondary, fontWeight: "500" },
  statusPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusPillFull: { backgroundColor: colors.surfaceSubtle },
  statusText: { fontSize: 10, fontWeight: "700", color: colors.accent },
  statusTextFull: { color: colors.textMuted },
  title: {
    fontSize: 15.5,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  tagText: { fontSize: 11, fontWeight: "600", color: colors.inkSoft },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});
