import { colors, radius, spacing } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
};

export default function TagInput({ items, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft("");
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !draft.trim() && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!draft.trim()}
        >
          <Ionicons name="add" size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {items.length > 0 && (
        <View style={styles.list}>
          {items.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity
                onPress={() => handleRemove(index)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: "row", gap: spacing.sm },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    fontSize: 14,
    color: colors.textPrimary,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: { opacity: 0.4 },
  list: { marginTop: spacing.sm, gap: spacing.xs },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});
