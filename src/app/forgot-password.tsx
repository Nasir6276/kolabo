import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
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
const SUCCESS_BG = "#E9F7EF";
const SUCCESS_TEXT = "#1E7A45";

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-not-found":
      return "No account matches that email.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function ForgotPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const goBack = () => router.back();

  const handleSendReset = async () => {
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setIsSent(true);
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
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            {isSent
              ? "Check your inbox for a link to reset your password."
              : "Enter the email tied to your account and we'll send you a reset link."}
          </Text>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {isSent ? (
            <View style={styles.successBanner}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={SUCCESS_TEXT}
              />
              <Text style={styles.successText}>Reset link sent to {email}</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                placeholder="Email"
                placeholderTextColor={PLACEHOLDER}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
                editable={!isSubmitting}
                onSubmitEditing={handleSendReset}
              />
            </View>
          )}

          {isSent ? (
            <TouchableOpacity
              style={styles.sendButton}
              activeOpacity={0.9}
              onPress={goBack}
            >
              <Text style={styles.sendButtonText}>Back to sign in</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sendButton, isSubmitting && styles.buttonDisabled]}
              activeOpacity={0.9}
              onPress={handleSendReset}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send reset link</Text>
              )}
            </TouchableOpacity>
          )}
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  errorBanner: {
    backgroundColor: "#FDECEC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: ERROR, fontSize: 13, textAlign: "center" },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: SUCCESS_BG,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  successText: {
    color: SUCCESS_TEXT,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
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
  inputFocused: {
    borderColor: FIELD_BORDER_FOCUSED,
    backgroundColor: "#F5F7FE",
  },
  sendButton: {
    backgroundColor: INK,
    borderRadius: 10,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  sendButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
