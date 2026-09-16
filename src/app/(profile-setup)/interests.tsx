import { useAuth } from "@/components/AuthContext";
import { saveUserProfile } from "@/lib/profile";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INK = "#1B1F3B";
const MUTED = "#6B7280";
const FIELD_BG = "#EEF1FB";

const MAX_SELECTIONS = 5;

const INTERESTS = [
  "Technology and software",
  "Design",
  "Business and entrepreneurship",
  "Marketing and growth",
  "Finance and economics",
  "Agriculture and agritech",
  "Health and wellness",
  "Education",
  "Fashion and apparel",
  "Arts and entertainment",
  "Writing and content",
  "Social impact and nonprofit",
  "Real estate and construction",
  "Gaming",
  "Science and research",
  "Logistics and supply chain",
  "Legal and policy",
  "Food and beverage",
  "Travel and hospitality",
  "Other",
];

export default function Interests() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [selected, setSelected] = useState<string[]>([]);

  const goToHome = () => router.replace("/(tabs)");
  const handleSkip = () => goToHome();

  const toggleInterest = (interest: string) => {
    setSelected((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, interest];
    });
  };

  const handleFinish = async () => {
    if (user) {
      try {
        await saveUserProfile(user.uid, { interests: selected });
      } catch (err) {
        console.warn("Failed to save interests", err);
      }
    }
    goToHome();
  };

  const isAtLimit = selected.length >= MAX_SELECTIONS;

  return (
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
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What are you into?</Text>
        <Text style={styles.subtitle}>
          Pick up to {MAX_SELECTIONS} areas that match what you'd want to build
          or contribute to.
        </Text>

        <Text style={styles.counter}>
          {selected.length}/{MAX_SELECTIONS} selected
        </Text>

        <View style={styles.pillWrap}>
          {INTERESTS.map((interest) => {
            const isSelected = selected.includes(interest);
            const isDisabled = !isSelected && isAtLimit;

            return (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                  isDisabled && styles.pillDisabled,
                ]}
                onPress={() => toggleInterest(interest)}
                activeOpacity={0.85}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                    isDisabled && styles.pillTextDisabled,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.finishButton,
            selected.length === 0 && styles.finishButtonDisabled,
          ]}
          activeOpacity={0.9}
          onPress={handleFinish}
          disabled={selected.length === 0}
        >
          <Text style={styles.finishButtonText}>
            {selected.length === 0 ? "Select at least one" : "Finish"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
  },
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
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  counter: {
    fontSize: 13,
    fontWeight: "600",
    color: INK,
    textAlign: "center",
    marginBottom: 20,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: FIELD_BG,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  pillSelected: {
    backgroundColor: INK,
    borderColor: INK,
  },
  pillDisabled: {
    opacity: 0.4,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: INK,
  },
  pillTextSelected: {
    color: "#FFFFFF",
  },
  pillTextDisabled: {
    color: MUTED,
  },
  bottomBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
  },
  finishButton: {
    backgroundColor: INK,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: "center",
  },
  finishButtonDisabled: {
    backgroundColor: "#C7CAD6",
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
