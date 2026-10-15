import IdeaCard from "@/components/IdeaCard";
import { colors, radius, spacing } from "@/theme/colors";
import { Idea } from "@/types/idea";
import { Intent, UserProfile } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  name: string;
  photoUrl?: string | null;
  profile: UserProfile | null;
  ideas: Idea[];
  isOwner: boolean;
  completion?: { percent: number; missing: string[] };
  onEditPress?: () => void;
  onIdeaPress: (idea: Idea) => void;
  bottomInset?: number;
  footer?: ReactNode;
};

const INTENT_LABELS: Record<Intent, string> = {
  join: "Looking to join ideas",
  post: "Posting ideas",
  both: "Joining and posting",
};

export default function ProfileView({
  name,
  photoUrl,
  profile,
  ideas,
  isOwner,
  completion,
  onEditPress,
  onIdeaPress,
  bottomInset = spacing.xxl,
  footer,
}: Props) {
  const insets = useSafeAreaInsets();
  const avatar = profile?.photoUrl ?? photoUrl;

  const openLinkedIn = () => {
    if (!profile?.linkedin) return;
    const url = profile.linkedin.startsWith("http")
      ? profile.linkedin
      : `https://${profile.linkedin}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: bottomInset,
      }}
    >
      {/* Identity header */}
      <View style={styles.header}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>
              {name.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
        )}

        <Text style={styles.name}>{name}</Text>

        {profile?.intent && (
          <View style={styles.intentBadge}>
            <Text style={styles.intentText}>
              {INTENT_LABELS[profile.intent]}
            </Text>
          </View>
        )}

        {isOwner && onEditPress && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.85}
          >
            <Ionicons name="create-outline" size={16} color={colors.ink} />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Completion nudge (owner only, hides at 100%) */}
      {isOwner && completion && completion.percent < 100 && (
        <TouchableOpacity
          style={styles.nudge}
          onPress={onEditPress}
          activeOpacity={0.9}
        >
          <View style={styles.nudgeTop}>
            <Text style={styles.nudgeTitle}>
              Your profile is {completion.percent}% complete
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.surface} />
          </View>
          <View style={styles.nudgeTrack}>
            <View
              style={[styles.nudgeFill, { width: `${completion.percent}%` }]}
            />
          </View>
          <Text style={styles.nudgeHint}>
            Add your {completion.missing.slice(0, 2).join(" and ")} to stand
            out.
          </Text>
        </TouchableOpacity>
      )}

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={profile?.bio ? styles.bio : styles.emptyText}>
          {profile?.bio ||
            (isOwner
              ? "Add a short bio so people know who you are."
              : "No bio yet.")}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {profile?.skills?.length ? (
          <View style={styles.pillsWrap}>
            {profile.skills.map((skill) => (
              <View key={skill} style={styles.pill}>
                <Text style={styles.pillText}>{skill}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            {isOwner ? "No skills added yet." : "No skills listed."}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        {profile?.interests?.length ? (
          <View style={styles.pillsWrap}>
            {profile.interests.map((interest) => (
              <View key={interest} style={styles.pill}>
                <Text style={styles.pillText}>{interest}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            {isOwner ? "No interests picked yet." : "No interests listed."}
          </Text>
        )}
      </View>

      {profile?.linkedin ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          <TouchableOpacity style={styles.linkRow} onPress={openLinkedIn}>
            <Ionicons name="logo-linkedin" size={20} color={colors.ink} />
            <Text style={styles.linkText} numberOfLines={1}>
              {profile.linkedin}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Ideas posted */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isOwner ? "My ideas" : "Ideas posted"}
          {ideas.length > 0 ? ` (${ideas.length})` : ""}
        </Text>
      </View>
      {ideas.length > 0 ? (
        ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onPress={onIdeaPress} />
        ))
      ) : (
        <Text style={[styles.emptyText, styles.ideasEmpty]}>
          {isOwner
            ? "You haven't posted any ideas yet."
            : "No ideas posted yet."}
        </Text>
      )}

      {isOwner && footer}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { alignItems: "center", paddingHorizontal: spacing.xl },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  avatarFallback: {
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { fontSize: 34, fontWeight: "700", color: colors.accent },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  intentBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  intentText: { fontSize: 12, fontWeight: "600", color: colors.inkSoft },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  editButtonText: { fontSize: 13, fontWeight: "700", color: colors.ink },

  nudge: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  nudgeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nudgeTitle: { fontSize: 14, fontWeight: "700", color: colors.surface },
  nudgeTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: spacing.md,
    overflow: "hidden",
  },
  nudgeFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  nudgeHint: { fontSize: 12, color: "#C7CADB" },

  section: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bio: { fontSize: 14, lineHeight: 22, color: colors.textSecondary },
  emptyText: { fontSize: 13, color: colors.textMuted },
  ideasEmpty: { paddingHorizontal: spacing.xl },

  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  pillText: { fontSize: 12, fontWeight: "600", color: colors.inkSoft },

  linkRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  linkText: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.ink },
});
