import { useAuth } from "@/components/AuthContext";
import TagInput from "@/components/TagInput";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  getPrivateInfo,
  savePrivateInfo,
  saveUserProfile,
} from "@/lib/profile";
import { colors, radius, spacing } from "@/theme/colors";
import { Intent } from "@/types/profile";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INTENTS: { value: Intent; label: string }[] = [
  { value: "join", label: "Join an idea" },
  { value: "post", label: "Post an idea" },
  { value: "both", label: "Both" },
];

function formatDob(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, isLoading } = useUserProfile(user?.uid);

  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [linkedin, setLinkedin] = useState("");
  const [dob, setDob] = useState("");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fill the form once, when existing data has loaded
  useEffect(() => {
    if (hydrated || isLoading || !user) return;

    setName(user.displayName ?? "");
    setPhotoUri(profile?.photoUrl ?? user.photoURL ?? null);
    setBio(profile?.bio ?? "");
    setSkills(profile?.skills ?? []);
    setLinkedin(profile?.linkedin ?? "");
    setIntent(profile?.intent ?? null);

    getPrivateInfo(user.uid)
      .then((info) => setDob(info.dob ?? ""))
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, [hydrated, isLoading, user, profile]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!user) return;
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Your name can't be empty.");
      return;
    }

    setIsSaving(true);
    try {
      if (name.trim() !== user.displayName) {
        await updateProfile(user, { displayName: name.trim() });
      }

      await saveUserProfile(user.uid, {
        bio: bio.trim(),
        skills,
        linkedin: linkedin.trim(),
        intent: intent ?? null,
        photoUrl: photoUri ?? null,
      });

      await savePrivateInfo(user.uid, { dob });

      router.back();
    } catch (err: any) {
      setErrorMessage(
        err?.message ?? "Couldn't save your changes. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.ink} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Edit profile</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={[
              styles.confirmButton,
              isSaving && styles.confirmButtonDisabled,
            ]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.surface} size="small" />
            ) : (
              <Ionicons name="checkmark" size={20} color={colors.surface} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
        >
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.photoWrap}
            onPress={handlePickImage}
            activeOpacity={0.85}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <Ionicons
                  name="person-outline"
                  size={36}
                  color={colors.textMuted}
                />
              </View>
            )}
            <View style={styles.photoBadge}>
              <Ionicons name="camera" size={14} color={colors.surface} />
            </View>
          </TouchableOpacity>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell people what you do and what you're good at"
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Skills</Text>
          <TagInput
            items={skills}
            onChange={setSkills}
            placeholder="e.g. React Native"
          />

          <Text style={styles.label}>LinkedIn</Text>
          <TextInput
            style={styles.input}
            value={linkedin}
            onChangeText={setLinkedin}
            placeholder="linkedin.com/in/your-name"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.hint}>Visible to everyone on Kolabo.</Text>

          <Text style={styles.label}>What are you here for?</Text>
          <View style={styles.chipsWrap}>
            {INTENTS.map((option) => {
              const isActive = intent === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setIntent(option.value)}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Date of birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={(text) => setDob(formatDob(text))}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
          />
          <View style={styles.privateRow}>
            <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
            <Text style={styles.hint}>Private. Only you can see this.</Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  pageTitle: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  confirmButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonDisabled: { opacity: 0.6 },

  errorBanner: {
    backgroundColor: "#FDECEC",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: { color: colors.danger, fontSize: 13, textAlign: "center" },

  photoWrap: { alignSelf: "center", marginBottom: spacing.md },
  photo: { width: 96, height: 96, borderRadius: 48 },
  photoPlaceholder: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  photoBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: { height: 110, paddingTop: spacing.md },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  privateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  chipTextActive: { color: colors.accent },
});
