import { useAuth } from "@/components/AuthContext";
import { NAV_BAR_TOTAL_SPACE } from "@/components/CustomNavBar";
import { useIdeas } from "@/components/IdeasContext";
import TagInput from "@/components/TagInput";
import { CATEGORIES, TIMEFRAME_OPTIONS } from "@/data/dummyIdeas";
import { colors, radius, spacing } from "@/theme/colors";
import { Category, Idea, Role } from "@/types/idea";
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

export default function Post() {
  const { user } = useAuth();
  const { addIdea } = useIdeas();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const isValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedCategories.length > 0 &&
    roles.length > 0;

  const handleSubmit = () => {
    setErrorMessage(null);

    if (!isValid) {
      setErrorMessage(
        "Please fill in the title, description, at least one category, and at least one role.",
      );
      return;
    }

    setIsSubmitting(true);

    const newIdea: Idea = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      categories: selectedCategories,
      roles: roles.map<Role>((roleTitle, index) => ({
        id: `${Date.now()}-${index}`,
        title: roleTitle,
        isFilled: false,
      })),
      postedBy: {
        name: user?.displayName ?? "Anonymous",
        avatarUrl: user?.photoURL ?? "https://i.pravatar.cc/100",
      },
      imageUrl: imageUri ?? undefined,
      requirements,
      timeframe: timeframe ?? "Not specified",
      location: location.trim() || "Remote",
    };

    addIdea(newIdea);
    setIsSubmitting(false);
    router.push({ pathname: "/idea/[id]", params: { id: newIdea.id } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.pageTitle}>Post an idea</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: NAV_BAR_TOTAL_SPACE + spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handlePickImage}
            activeOpacity={0.85}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={28}
                  color={colors.textMuted}
                />
                <Text style={styles.imagePlaceholderText}>
                  Add a cover photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Give your idea a clear, short title"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain the idea, the problem it solves, and your vision for it"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.sectionLabel}>Categories</Text>
          <View style={styles.chipsWrap}>
            {CATEGORIES.filter((c) => c !== "All").map((category) => {
              const isActive = selectedCategories.includes(
                category as Category,
              );
              return (
                <TouchableOpacity
                  key={category}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => toggleCategory(category as Category)}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Roles needed</Text>
          <TagInput
            items={roles}
            onChange={setRoles}
            placeholder="e.g. React Native Developer"
          />

          <Text style={styles.sectionLabel}>Project requirements</Text>
          <TagInput
            items={requirements}
            onChange={setRequirements}
            placeholder="e.g. Payment integration"
          />

          <Text style={styles.sectionLabel}>Timeframe</Text>
          <View style={styles.chipsWrap}>
            {TIMEFRAME_OPTIONS.map((option) => {
              const isActive = timeframe === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setTimeframe(option)}
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lagos, Nigeria · Remote-friendly"
            placeholderTextColor={colors.textMuted}
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isValid || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Posting..." : "Post idea"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  errorBanner: {
    backgroundColor: "#FDECEC",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: { color: colors.danger, fontSize: 13, textAlign: "center" },

  imagePicker: { marginBottom: spacing.xl },
  imagePreview: { width: "100%", height: 160, borderRadius: radius.lg },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
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
  textArea: { height: 120, paddingTop: spacing.md },

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

  submitButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xxl,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
});
