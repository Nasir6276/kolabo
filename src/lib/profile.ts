import { PrivateInfo, UserProfile } from "@/types/profile";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// merge: true so different screens can write different fields to the same doc
export async function saveUserProfile(
  uid: string,
  data: Record<string, unknown>,
) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

export async function savePrivateInfo(uid: string, data: PrivateInfo) {
  await setDoc(doc(db, "users", uid, "private", "info"), data, { merge: true });
}

export async function getPrivateInfo(uid: string): Promise<PrivateInfo> {
  const snap = await getDoc(doc(db, "users", uid, "private", "info"));
  return (snap.data() as PrivateInfo) ?? {};
}

export function subscribeToUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => onData(snap.exists() ? (snap.data() as UserProfile) : null),
    onError,
  );
}
