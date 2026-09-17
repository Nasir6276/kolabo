import { useAuth } from "@/components/AuthContext";
import { getGreeting } from "@/utils/greeting";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const INK = "#1B1F3B";
const MUTED = "#6B7280";

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

      <Text style={styles.greeting} numberOfLines={1}>
        {greeting}, {firstName}
      </Text>

      <TouchableOpacity
        onPress={goToNotifications}
        style={styles.notificationButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="notifications-outline" size={22} color={INK} />
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
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logo: { width: 32, height: 32 },
  greeting: {
    fontSize: 14,
    fontWeight: "600",
    color: MUTED,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  notificationButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D64545",
  },
});
