import { colors, radius, spacing } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  roleTitle?: string;
};

export default function SuccessModal({
  visible,
  onClose,
  title = "Application sent!",
  message,
  roleTitle,
}: Props) {
  const bodyText =
    message ??
    (roleTitle
      ? `Your application for "${roleTitle}" has been submitted. The idea owner will review it and get back to you.`
      : "Your application has been submitted. The idea owner will review it and get back to you.");

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={36} color={colors.surface} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{bodyText}</Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27, 31, 59, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: spacing.xl,
  },
  button: {
    width: "100%",
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
});
