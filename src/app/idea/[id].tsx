import { DUMMY_IDEAS } from "@/data/dummyIdeas";
import { colors, radius, spacing } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IdeaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFavorited, setIsFavorited] = useState(false);

  const idea = DUMMY_IDEAS.find((item) => item.id === id);

  if (!idea) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <Text style={styles.notFoundText}>This idea couldn't be found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rolesFilled = idea.rolesTotal - idea.rolesOpen;
  const progress = idea.rolesTotal > 0 ? rolesFilled / idea.rolesTotal : 0;
  const isFull = idea.rolesOpen === 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{
              uri:
                idea.imageUrl ?? "https://loremflickr.com/400/300/technology",
            }}
            style={styles.image}
          />

          <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.surface} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsFavorited((prev) => !prev)}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={20}
                color={isFavorited ? colors.danger : colors.surface}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tagsRow}>
            {idea.categories.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{idea.title}</Text>

          <View style={styles.posterRow}>
            <Image
              source={{ uri: idea.postedBy.avatarUrl }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.postedByLabel}>Posted by</Text>
              <Text style={styles.postedByName}>{idea.postedBy.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>About this idea</Text>
          <Text style={styles.description}>{idea.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Project requirements</Text>
          {idea.requirements.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Skills needed</Text>
          <View style={styles.skillsRow}>
            {idea.skillsNeeded.map((skill) => (
              <View key={skill} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Timeframe</Text>
          <View style={styles.timeframeRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.timeframeText}>{idea.timeframe}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Location</Text>
          <View style={styles.timeframeRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.timeframeText}>{idea.location}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Team progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {rolesFilled}/{idea.rolesTotal} filled
            </Text>
          </View>
          <View style={[styles.statusPill, isFull && styles.statusPillFull]}>
            <Text style={[styles.statusText, isFull && styles.statusTextFull]}>
              {isFull
                ? "Team full"
                : `${idea.rolesOpen} role${idea.rolesOpen > 1 ? "s" : ""} open`}
            </Text>
          </View>
        </View>
      </ScrollView>

      {!isFull && (
        <View
          style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <TouchableOpacity style={styles.applyButton} activeOpacity={0.9}>
            <Text style={styles.applyButtonText}>Apply to join</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { justifyContent: "center", alignItems: "center", gap: spacing.md },
  notFoundText: { fontSize: 14, color: colors.textSecondary },
  backLink: { padding: spacing.sm },
  backLinkText: { color: colors.accent, fontWeight: "700" },

  imageWrap: { width: "100%", height: 240 },
  image: { width: "100%", height: "100%" },
  topBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "rgba(27, 31, 59, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    marginTop: -radius.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
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
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  tagText: { fontSize: 11, fontWeight: "600", color: colors.inkSoft },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: 28,
  },

  posterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  postedByLabel: { fontSize: 11, color: colors.textMuted },
  postedByName: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.ink,
    marginTop: 7,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillTag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  skillTagText: { fontSize: 12, fontWeight: "600", color: colors.inkSoft },

  timeframeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  timeframeText: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.ink,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  statusPillFull: { backgroundColor: colors.surfaceSubtle },
  statusText: { fontSize: 12, fontWeight: "700", color: colors.accent },
  statusTextFull: { color: colors.textMuted },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  applyButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  applyButtonText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
});
