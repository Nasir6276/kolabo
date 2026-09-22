import { colors, radius, spacing } from "@/theme/colors";
import { Role } from "@/types/idea";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  ideaTitle: string;
  openRoles: Role[];
  onSubmit: (roleId: string, message: string) => void;
};

export default function ApplyModal({
  visible,
  onClose,
  ideaTitle,
  openRoles,
  onSubmit,
}: Props) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");

  const selectedRole = openRoles.find((role) => role.id === selectedRoleId);

  const handleClose = () => {
    setSelectedRoleId(null);
    setIsDropdownOpen(false);
    setMessage("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedRoleId) return;
    onSubmit(selectedRoleId, message);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.headerRow}>
              <Text style={styles.title}>Apply to join</Text>
              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle} numberOfLines={1}>
              {ideaTitle}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.form}
            >
              <Text style={styles.label}>Select a role</Text>

              <TouchableOpacity
                style={styles.dropdownTrigger}
                activeOpacity={0.8}
                onPress={() => setIsDropdownOpen((prev) => !prev)}
              >
                <Text
                  style={[
                    styles.dropdownTriggerText,
                    !selectedRole && styles.dropdownPlaceholder,
                  ]}
                >
                  {selectedRole ? selectedRole.title : "Choose a role"}
                </Text>
                <Ionicons
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {openRoles.length === 0 ? (
                    <Text style={styles.noRolesText}>
                      No open roles right now.
                    </Text>
                  ) : (
                    openRoles.map((role) => (
                      <TouchableOpacity
                        key={role.id}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedRoleId(role.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownOptionText}>
                          {role.title}
                        </Text>
                        {selectedRoleId === role.id && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color={colors.ink}
                          />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}

              <Text style={[styles.label, { marginTop: spacing.lg }]}>
                Why do you want to join? (optional)
              </Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Share a bit about your experience or why you're a fit..."
                placeholderTextColor={colors.textMuted}
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
              />
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedRoleId && styles.submitButtonDisabled,
              ]}
              activeOpacity={0.9}
              onPress={handleSubmit}
              disabled={!selectedRoleId}
            >
              <Text style={styles.submitButtonText}>Submit application</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(27, 31, 59, 0.5)",
    justifyContent: "flex-end",
  },
  sheetWrap: { maxHeight: "85%" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.lg,
  },

  form: { marginBottom: spacing.md },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  dropdownTriggerText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  dropdownPlaceholder: { color: colors.textMuted, fontWeight: "400" },

  dropdownList: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownOptionText: { fontSize: 14, color: colors.textPrimary },
  noRolesText: {
    fontSize: 13,
    color: colors.textMuted,
    padding: spacing.md,
    textAlign: "center",
  },

  messageInput: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 90,
  },

  submitButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
});
