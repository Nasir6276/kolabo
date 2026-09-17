import { Text, View } from "react-native";

export default function builds() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Builds</Text>
    </View>
  );
}
