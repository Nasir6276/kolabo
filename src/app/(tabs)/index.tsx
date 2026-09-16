import { useAuth } from "@/components/AuthContext";
import { Text, View } from "react-native";

export default function Home() {
  const { user } = useAuth();

  const firstName = user?.displayName?.split(" ")[0] ?? "there";
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Home</Text>
      <Text style={{ fontSize: 20 }}>Welcome back, {firstName}!</Text>
    </View>
  );
}
