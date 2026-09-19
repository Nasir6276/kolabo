import { useAuth } from "@/components/AuthContext";
import { colors, radius, spacing } from "@/theme/colors";
import { getGreeting } from "@/utils/greeting";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  hasUnreadNotifications?: boolean;
};

export default function HomeHeader({ hasUnreadNotifications = false }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  const greeting = getGreeting();

  const goToNotifications = () => router.push("/notifications");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/kolabo-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.greetingWrap}>
        <Text style={styles.greeting} numberOfLines={1}>
          {greeting}, <Text style={styles.name}>{firstName}</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={goToNotifications}
        style={styles.notificationButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="notifications-outline" size={21} color={colors.ink} />
        {hasUnreadNotifications && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  logo: { width: 30, height: 30 },
  greetingWrap: { flex: 1, alignItems: "center" },
  greeting: { fontSize: 13, fontWeight: "500", color: colors.textSecondary },
  name: { color: colors.textPrimary, fontWeight: "700" },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSubtle,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surfaceSubtle,
  },
});
