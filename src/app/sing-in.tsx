import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { auth } from "../lib/firebase";

const INK = "#1B1F3B";
const MUTED = "#6B7280";
const FIELD_BG = "#EEF1FB";
const FIELD_BORDER_FOCUSED = INK;
const PLACEHOLDER = "#8A8FA3";
const ERROR = "#D64545";

type FieldKey = "email" | "password";

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "No account matches that email and password.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const goBack = () => router.back();
  const goToSignUp = () => router.push("/sing-up");

  const goToForgotPassword = () => router.push("/forgot-password");

  const handleSignIn = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in AuthContext picks this up automatically —
      // route to wherever a signed-in user should land.
      router.replace("/(tabs)");
    } catch (err: any) {
      setErrorMessage(getFirebaseErrorMessage(err?.code ?? ""));
    } finally {
      setIsSubmitting(false);
    }
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

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

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
              editable={!isSubmitting}
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
                editable={!isSubmitting}
                onSubmitEditing={handleSignIn}
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

          <TouchableOpacity
            style={styles.forgotPasswordRow}
            onPress={goToForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signInButton, isSubmitting && styles.buttonDisabled]}
            activeOpacity={0.9}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign in</Text>
            )}
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
    marginBottom: 24,
  },
  errorBanner: {
    backgroundColor: "#FDECEC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: ERROR,
    fontSize: 13,
    textAlign: "center",
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
  buttonDisabled: {
    opacity: 0.6,
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
