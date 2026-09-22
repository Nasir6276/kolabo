import { Tabs } from "expo-router";
import CustomNavBar from "../../components/CustomNavBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomNavBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="message" options={{ title: "Message" }} />
      <Tabs.Screen name="post" options={{ title: "Post" }} />
      <Tabs.Screen name="builds" options={{ title: "Builds" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
