import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INK = "#1B1F3B";
const MUTED = "#6B7280";
const FIELD_BG = "#EEF1FB";
const FIELD_BORDER_FOCUSED = INK;
const PLACEHOLDER = "#8A8FA3";

type FieldKey = "email" | "password";

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const goBack = () => router.back();
  const goToSignUp = () => router.push("/sing-up");

  const handleSignIn = () => {
    // TODO: wire up to your sign-in endpoint
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color={INK} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Sign in</Text>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
              ]}
              placeholder="Email"
              placeholderTextColor={PLACEHOLDER}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <View
              style={[
                styles.inputWrapper,
                focusedField === "password" && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.inputInner}
                placeholder="Password"
                placeholderTextColor={PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPasswordRow}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            activeOpacity={0.9}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToSignUp} style={styles.signUpRow}>
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    marginBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: INK,
    textAlign: "center",
    marginBottom: 50,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: FIELD_BG,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: INK,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: FIELD_BG,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: 16,
  },
  inputInner: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: INK,
  },
  inputFocused: {
    borderColor: FIELD_BORDER_FOCUSED,
    backgroundColor: "#F5F7FE",
  },
  forgotPasswordRow: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: INK,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: INK,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signUpRow: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: INK,
    fontWeight: "500",
  },
  signUpLink: {
    color: INK,
    fontWeight: "700",
  },
});
