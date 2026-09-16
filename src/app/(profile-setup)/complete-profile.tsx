import { useAuth } from "@/components/AuthContext";
import { saveUserProfile } from "@/lib/profile";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const INK = "#1B1F3B";
const MUTED = "#6B7280";
const FIELD_BG = "#EEF1FB";
const FIELD_BORDER_FOCUSED = INK;
const PLACEHOLDER = "#8A8FA3";
const BORDER = "#EDEDF2";

type Intent = "join" | "post" | "both";
type FieldKey = "bio" | "skills" | "linkedin" | "dob";

const INTENT_OPTIONS: { key: Intent; label: string }[] = [
  { key: "join", label: "Join an idea" },
  { key: "post", label: "Post an idea" },
  { key: "both", label: "Both" },
];

export default function CompleteProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [dob, setDob] = useState("");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);

  const goToInterests = () => router.push("/(profile-setup)/interests");
  const handleSkip = () => goToInterests();

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Formats raw digits into DD/MM/YYYY as the user types.
  const handleDobChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setDob(formatted);
  };

  const handleContinue = async () => {
    if (!user) {
      goToInterests();
      return;
    }

    setIsSaving(true);
    try {
      await saveUserProfile(user.uid, {
        bio,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        linkedin,
        dob,
        intent,
        photoUrl: photoUri,
      });
    } catch (err) {
      console.warn("Failed to save profile", err);
    } finally {
      setIsSaving(false);
      goToInterests();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={handleSkip}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Help others know who they're building with. You can always finish
            this later.
          </Text>

          <TouchableOpacity
            style={styles.photoPicker}
            onPress={handlePickPhoto}
            activeOpacity={0.85}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={26} color={MUTED} />
              </View>
            )}
            <View style={styles.photoBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoLabel}>Add a profile picture</Text>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  focusedField === "bio" && styles.inputFocused,
                ]}
                placeholder="A few lines about you, your background, and what you're looking for"
                placeholderTextColor={PLACEHOLDER}
                value={bio}
                onChangeText={setBio}
                onFocus={() => setFocusedField("bio")}
                onBlur={() => setFocusedField(null)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text style={styles.label}>Skills</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "skills" && styles.inputFocused,
                ]}
                placeholder="e.g. UI Design, React Native, Marketing"
                placeholderTextColor={PLACEHOLDER}
                value={skills}
                onChangeText={setSkills}
                onFocus={() => setFocusedField("skills")}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
              />
              <Text style={styles.hint}>
                Separate multiple skills with commas
              </Text>
            </View>

            <View>
              <Text style={styles.label}>LinkedIn profile</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "linkedin" && styles.inputFocused,
                ]}
                placeholder="linkedin.com/in/your-name"
                placeholderTextColor={PLACEHOLDER}
                value={linkedin}
                onChangeText={setLinkedin}
                onFocus={() => setFocusedField("linkedin")}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View>
              <Text style={styles.label}>Date of birth</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === "dob" && styles.inputFocused,
                ]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={PLACEHOLDER}
                value={dob}
                onChangeText={handleDobChange}
                onFocus={() => setFocusedField("dob")}
                onBlur={() => setFocusedField(null)}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            <View>
              <Text style={styles.label}>What are you here for?</Text>
              <View style={styles.intentRow}>
                {INTENT_OPTIONS.map((option) => {
                  const isSelected = intent === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.intentPill,
                        isSelected && styles.intentPillSelected,
                      ]}
                      onPress={() => setIntent(option.key)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.intentPillText,
                          isSelected && styles.intentPillTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.9}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 28 },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  skipText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: INK,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  photoPicker: {
    alignSelf: "center",
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  photoImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: FIELD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  photoBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  photoLabel: {
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
    marginBottom: 28,
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: INK,
    marginBottom: 8,
  },
  input: {
    backgroundColor: FIELD_BG,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: INK,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  inputFocused: {
    borderColor: FIELD_BORDER_FOCUSED,
    backgroundColor: "#F5F7FE",
  },
  hint: {
    fontSize: 12,
    color: MUTED,
    marginTop: 6,
  },
  intentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  intentPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: FIELD_BG,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  intentPillSelected: {
    backgroundColor: INK,
    borderColor: INK,
  },
  intentPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: INK,
  },
  intentPillTextSelected: {
    color: "#FFFFFF",
  },
  continueButton: {
    backgroundColor: INK,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 32,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
