import { Stack } from "expo-router";

export default function ProfileSetupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="interests" />
    </Stack>
  );
}
