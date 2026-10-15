import { useAuth } from "@/components/AuthContext";
import { NAV_BAR_TOTAL_SPACE } from "@/components/CustomNavBar";
import { useIdeas } from "@/components/IdeasContext";
import ProfileView from "@/components/ProfileView";
import { useUserProfile } from "@/hooks/useUserProfile";
import { auth } from "@/lib/firebase";
import { colors, radius, spacing } from "@/theme/colors";
import { Idea } from "@/types/idea";
import { getProfileCompletion } from "@/utils/profileCompletion";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { ideas } = useIdeas();
  const router = useRouter();
  const { profile, isLoading } = useUserProfile(user?.uid);

  const myIdeas = useMemo(
    () => ideas.filter((idea) => idea.ownerId === user?.uid),
    [ideas, user?.uid],
  );

  const completion = useMemo(() => getProfileCompletion(profile), [profile]);

  const handleChangePassword = () => {
    if (!user?.email) return;
    Alert.alert(
      "Change password",
      `We'll email a reset link to ${user.email}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send link",
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, user.email!);
              Alert.alert("Check your inbox", "We've sent you a reset link.");
            } catch {
              Alert.alert("Something went wrong", "Please try again.");
            }
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/sing-up");
  };

  const handleIdeaPress = (idea: Idea) =>
    router.push({ pathname: "/idea/[id]", params: { id: idea.id } });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <ProfileView
      name={user?.displayName ?? "Your name"}
      photoUrl={user?.photoURL}
      profile={profile}
      ideas={myIdeas}
      isOwner
      completion={completion}
      onEditPress={() => router.push("/edit-profile")}
      onIdeaPress={handleIdeaPress}
      bottomInset={NAV_BAR_TOTAL_SPACE + spacing.xl}
      footer={
        <View style={styles.settings}>
          <Text style={styles.settingsTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons name="person-outline" size={20} color={colors.ink} />
            <Text style={styles.rowText}>Edit profile</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleChangePassword}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.ink} />
            <Text style={styles.rowText}>Change password</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={[styles.rowText, { color: colors.danger }]}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  settings: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  settingsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
