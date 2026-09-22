import { AuthProvider, useAuth } from "@/components/AuthContext";
import { IdeasProvider } from "@/components/IdeasContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator color="#1B1F3B" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="onboarding" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <IdeasProvider>
        <RootNavigator />
      </IdeasProvider>
    </AuthProvider>
  );
}
