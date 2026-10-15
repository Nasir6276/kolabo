import { colors, radius, spacing } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
};

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={30} color={colors.ink} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={onAction}
        >
          <Text style={styles.primaryText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}

      {secondaryLabel && onSecondaryAction && (
        <TouchableOpacity
          onPress={onSecondaryAction}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  primaryText: { color: colors.surface, fontSize: 14, fontWeight: "700" },
  secondaryButton: { marginTop: spacing.md, padding: spacing.sm },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
