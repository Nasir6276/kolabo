import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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

type FieldKey = "fullName" | "email" | "password" | "confirmPassword";

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [focusedField, setFocusedField] = useState<FieldKey | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const goBack = () => router.back();
  const goToSignIn = () => router.push("/sing-in");

  const handleSignUp = async () => {
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      await updateProfile(credential.user, { displayName: fullName.trim() });
      // onAuthStateChanged in AuthContext picks this up automatically —
      // route to wherever a signed-in user should land.
      router.replace("/(profile-setup)/complete-profile");
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
          <Text style={styles.title}>Sign up</Text>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                focusedField === "fullName" && styles.inputFocused,
              ]}
              placeholder="Full Name"
              placeholderTextColor={PLACEHOLDER}
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField("fullName")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              returnKeyType="next"
              editable={!isSubmitting}
            />

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
                returnKeyType="next"
                editable={!isSubmitting}
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

            <View
              style={[
                styles.inputWrapper,
                focusedField === "confirmPassword" && styles.inputFocused,
              ]}
            >
              <TextInput
                style={styles.inputInner}
                placeholder="Confirm password"
                placeholderTextColor={PLACEHOLDER}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, isSubmitting && styles.buttonDisabled]}
            activeOpacity={0.9}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goToSignIn} style={styles.signInRow}>
            <Text style={styles.signInText}>
              Already have an account?{" "}
              <Text style={styles.signInLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 28 },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    marginBottom: 8,
  },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
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
  form: { gap: 16 },
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
  inputInner: { flex: 1, paddingVertical: 16, fontSize: 15, color: INK },
  inputFocused: {
    borderColor: FIELD_BORDER_FOCUSED,
    backgroundColor: "#F5F7FE",
  },
  signUpButton: {
    backgroundColor: INK,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  signUpButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  signInRow: { marginTop: 20, alignItems: "center" },
  signInText: { fontSize: 14, color: INK, fontWeight: "500" },
  signInLink: { color: INK, fontWeight: "700" },
});
