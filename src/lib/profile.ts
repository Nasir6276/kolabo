import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type UserProfileData = {
  bio?: string;
  skills?: string[];
  linkedin?: string;
  dob?: string;
  intent?: "join" | "post" | "both" | null;
  photoUrl?: string | null;
  interests?: string[];
};

export async function saveUserProfile(uid: string, data: UserProfileData) {
  const ref = doc(db, "users", uid);
  // merge: true so this can be called from multiple screens without
  // overwriting fields the other screen already saved
  await setDoc(ref, data, { merge: true });
}
