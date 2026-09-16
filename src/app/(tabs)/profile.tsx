import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../components/AuthContext";

const INK = "#1B1F3B";

export default function Profile() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/sing-up");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Profile</Text>

      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.85}
        style={{
          marginTop: 24,
          backgroundColor: INK,
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 999,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
          Log out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
